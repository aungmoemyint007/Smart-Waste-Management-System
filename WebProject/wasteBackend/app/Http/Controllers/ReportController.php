<?php
// filepath: /home/lazy/Desktop/wasteBackend/app/Http/Controllers/ReportController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Report;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Notification;
use App\Services\GoogleGenerativeAIService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    public function createReport(Request $request)
        {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        
            // Validate the request
            $request->validate([
                'location' => 'required|string|max:255',
                
                // 'type' => 'required|string',
                // 'amount' => 'required|string',
                // 'recycle' => 'required|string',
                // 'reason' => 'required|string',
                // 'confidence' => 'required|numeric',
            ]);
        
            $location = $request->location;
            $type = $request->type;
            $amount = $request->amount;
            $recycle = $request->recycle;
            $reason = $request->reason;
            $confidence = $request->confidence;
            $image = $request->file('image');

            // Store the image in a temporary location
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('temp', $imageName); // Store in storage/app/temp with a unique name

        
            // Create the report without using DB transactions
            try {
                $report = Report::create([
                    'reporter_id' => $user->id,
                    'location' => $location,
                    'waste_type' => $type ?? 'Unknown',  // Provide defaults
                    'amount' => $amount ?? 'Unknown',
                    'recycle_or_not' => $recycle ?? 'Unknown',
                    'reason' => $reason ?? 'No reason provided',
                    'verification_result' => json_encode(['confidence' => $confidence ?? 0]),
                    'status' => 'pending',
                    'image_url' => $imagePath,
                    'reported_date' => now(),
                ]);
        
                // Award 10 points for reporting waste
                $pointsEarned = 10;
                $this->updateRewardPoints($user->id, $pointsEarned );
        
                // // Create a transaction for the earned points
                $this->createTransaction($user->id, 'earned_report', $pointsEarned, 'Points earned for reporting waste');
        
                // // Create a notification for the user
                $this->createNotification($user->id, "You've earned $pointsEarned points for reporting waste!", 'reward');
        
                return response()->json(['report' => $report,'status' => 'success'], 201);
        
            } catch (\Exception $e) {
                // Log and return the error
                // Log::error('Error creating report: ' . $e->getMessage());
                return response()->json(['error' => $e->getMessage()], 500);
            }
    }

    public function getAllReports(){
        $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        $reports = Report::where('reporter_id', $user->id)->get();
        return response()->json(['reports' => $reports], 200);
    }

    public function showAllReports()
{
    $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
    $reports = Report::with([
        'reporter:id,name',  // Get reporter's name
        'collector:id,name'  // Get collector's name
    ])->get();

    return response()->json(['reports' => $reports], 200);
}

        
    public function updateStatus(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate the request
        $request->validate([
            'id' => 'required|integer|exists:reports,id',
            'status' => 'required|string',
            'pointsEarned' => 'nullable|integer',
        ]);

        $report = Report::find($request->id);
        if (!$report) {
            return response()->json(['error' => 'Report not found'], 404);
        }

        $report->status = $request->status;
        if($request->status == 'verified'){
            $pointsEarned = $request->pointsEarned;
            $this->updateRewardPoints($user->id, $pointsEarned, 'Points earned for collecting waste');
            $this->createTransaction($user->id, 'earned_report', $pointsEarned, 'Points earned for collecting waste');
            $this->createNotification($user->id, "You've earned $pointsEarned points for collecting waste!", 'reward');
        } else {
            $this->createNotification($user->id, "Your collection has been rejected!", "reject",);
            $report->collector_id = null;
            $report->collected_date = null;
            $report->status = 'pending';
        }

        $report->collector_id = $user->id; // Update collector_id with the current user's ID
        $report->collected_date = now(); // Update collected_date with the current timestamp
        
        $report->save();

        return response()->json(['report' => $report], 200);
    }

    // Helper function to update reward points
    protected function updateRewardPoints($userId, $pointsToAdd, $reason = 'Points earned for reporting waste')
    {
        // Check if a reward record exists for the given user
        $point = DB::table('points')->where('user_id', $userId)->first();

        if ($point) {
            // If the user already has a rewards record, increment the points
            DB::table('points')
                ->where('user_id', $userId)
                ->update([
                    'points' => DB::raw("points + $pointsToAdd"), // Increment points
                    'updated_at' => now(),
                ]);
        } else {
            // If the user doesn't have a rewards record, create a new one
            DB::table('points')->insert([
                'user_id' => $userId,
                'points' => $pointsToAdd, // Set the initial points
                'level' => 1, // Set the default level
                'description' => $reason,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    // Helper function to create a notification
    protected function createNotification($userId, $message, $category)
    {
        Notification::create([
            'user_id' => $userId,
            'message' => $message,
            'category' => $category,
        ]);
    }

    // Helper function to create a transaction
    protected function createTransaction($userId, $type, $amount, $description)
    {
        Transaction::create([
            'user_id' => $userId,
            'type' => $type,
            'amount' => $amount, // Use 'amount' instead of 'points'
            'description' => $description,
        ]);
    }


    
public function verifyCollectedWaste(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        'waste_type' => 'required|string',
        'amount' => 'required|string',
        'report_id' => 'required|string',
    ]);

    $wasteType = $request->waste_type;
    $amount = $request->amount;

    // Convert report_id to integer
    $reportId = (int) $request->report_id;

    // Check if the report exists
    if (!Report::where('id', $reportId)->exists()) {
        return response()->json(['error' => 'Report not found'], 404);
    }

    // Extract the image from the request
    $image = $request->file('image');

    // Store the image in a temporary location
    $imagePath = $image->store('temp'); // Store in storage/app/temp

    // Check if the image was successfully stored
    if (!$imagePath) {
        return response()->json(['error' => 'Failed to store the image'], 500);
    }

    // Read the image file
    $imageData = Storage::get($imagePath);

    // Get the image path from the reports table using the report ID
    $report = Report::find($reportId);
    if (!$report) {
        return response()->json(['error' => 'Report not found'], 404);
    }

    $imagePathForReportedWaste = $report->image_url;
    if (!$imagePathForReportedWaste || !Storage::exists($imagePathForReportedWaste)) {
        return response()->json(['error' => 'Reported waste image not found'], 404);
    }

    // Read the reported waste image file
    $imageDataForReportedWaste = Storage::get($imagePathForReportedWaste);
    $mimeTypeForReportedWaste = Storage::mimeType($imagePathForReportedWaste);

    $base64ImageForReportedWaste = base64_encode($imageDataForReportedWaste);

    // Convert the collected waste image data to base64
    $base64Image = base64_encode($imageData);

    $prompt = "You are an expert in waste management and recycling. One of the images is reported waste to collect and one is a photo when the reported waste is collected. Analyze these two images and provide:
    1. Confirm if the waste type matches: $wasteType
    2. Estimate if the quantity matches: $amount
    3. If there are people collecting waste in one image, confirm the status is success. If not, but the waste type and amount match, confirm the status is success. If not, confirm the status is failure.
    4. Your confidence level in this assessment (as a percentage)
    5. Points earned for collecting waste upon on waste amount (20 to 100)
    5. Do not respond with an explanation and respond only in JSON format below this
    
    Respond in JSON format like this:
    {
      \"wasteTypeMatch\": true/false,
      \"quantityMatch\": true/false,
      \"confidence\": confidence level as a number between 0 and 1,
      \"status\": \"success\" or \"failure\",
        \"pointsEarned\": points earned for collecting waste and it must be number integer,
        \"reason\": \"The reason for failure or success in one line\"
    }";

    // Construct the request payload
    $payload = [
        'contents' => [
            [
                'parts' => [
                    [
                        'text' => $prompt,
                    ],
                    [
                        'inline_data' => [
                            'mime_type' => $image->getMimeType(),
                            'data' => $base64Image,
                        ],
                    ],
                    [
                        'inline_data' => [
                            'mime_type' => $mimeTypeForReportedWaste,
                            'data' => $base64ImageForReportedWaste,
                        ],
                    ],
                ],
            ],
        ],
        'safetySettings' => [
            [
                'category' => 'HARM_CATEGORY_HARASSMENT',
                'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
            ],
            [
                'category' => 'HARM_CATEGORY_HATE_SPEECH',
                'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
            ],
            [
                'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
            ],
            [
                'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
            ]
        ],
    ];

    // Gemini API endpoint
    $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . env('GEMINI_API_KEY');

    // Send the request to the Gemini API
    $response = Http::withHeaders([
        'Content-Type' => 'application/json',
    ])->post($endpoint, $payload);

    $response->throw(); // Throw an exception for HTTP errors (4xx or 5xx)

    $responseData = $response->json();

    // Extract the generated text from the response
    $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'No response from Gemini.';

    // Attempt to parse the JSON, cleaning up potential surrounding text
    try {
        // Remove any ```json and ``` markers
        $generatedText = str_replace(["```json", "```"], "", $generatedText);

        // Trim whitespace
        $generatedText = trim($generatedText);

        $geminiData = json_decode($generatedText, true); // true for associative array

        if (json_last_error() !== JSON_ERROR_NONE) {
            // JSON decode failed, handle the error
            throw new \Exception('Invalid JSON response from Gemini: ' . json_last_error_msg() . ' Raw response: ' . $generatedText);
        }

        // Validate Confidence Level
        if (!is_numeric($geminiData['confidence']) || $geminiData['confidence'] < 0 || $geminiData['confidence'] > 1) {
            Log::warning('Invalid confidence level from Gemini: ' . $geminiData['confidence']);
            $geminiData['confidence'] = 0; // Set a default value
        }

        return response()->json(['verificationResult' => $geminiData], 200);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Error parsing JSON from Gemini: ' . $e->getMessage() . ' Raw response: ' . $generatedText, 'status' => 'error'], 500);
    } finally {
        // Ensure the temporary image is always deleted
        if ($imagePath) {
            Storage::delete($imagePath);
        }
    }
}}