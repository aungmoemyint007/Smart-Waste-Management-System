<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Report;
use App\Models\Notification;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    public function verifyWaste(Request $request)
    {
        $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        // Extract the image from the request
        $image = $request->file('image');

        // Store the image in a temporary location
        $imageName = time() . '_' . $image->getClientOriginalName();
        $imagePath = $image->storeAs('temp', $imageName); // Store in storage/app/temp

        // Read the image file
        $imageData = Storage::get($imagePath);

        // Convert the image data to base64
        $base64Image = base64_encode($imageData);

        $prompt = "You are an expert in waste management and recycling. Analyze this image and provide:
        1. The type of waste (e.g., plastic, paper, glass, metal, organic)
        2. An estimate of the quantity or amount (in kg or liters)
        3. Your confidence level in this assessment (as a percentage, between 0 and 1)
        4. Are these waste recycle or non-recycle
        5. And the reason for why it can recycle or non-recycle
        6. If the image is not real waste like cartoon or animals or humans, respond only confidence and status is failure.
        7. If the image is not clear or not able to identify, respond only confidence and status is failure.
        8. If the image is real waste, respond all the details and status is scuccess.

        Respond *ONLY* in JSON format, like this (and nothing else):
        ```json
        {
          \"wasteType\": \"type of waste\",
          \"quantity\": \"estimated quantity with unit\",
          \"confidence\": confidence level as a number between 0 and 1, when if the image is not real waste, respond 0 only
          \"recycle\": \"recycle\" or \"non-recycle\",
          \"reason\": \"the reason for why it can recycle or non-recycle in short point\"
          \"status\": \"success\" or \"failure\"
        }
        ```";

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
                ],
            ],
            ],
            'safetySettings' => [ // Adjust these based on your needs
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

            return response()->json(['wasteDetails' => $geminiData], 200);

        } catch (\Exception $e) {
            response()->json(['error' => 'Error parsing JSON from Gemini: ' . $e->getMessage() . ' Raw response: ' . $generatedText, 'status' => 'error'], 500);
            // Handle JSON parsing errors
            throw new \Exception('Error parsing JSON from Gemini: ' . $e->getMessage() . ' Raw response: ' . $generatedText);
        } 
        
        }

        
}