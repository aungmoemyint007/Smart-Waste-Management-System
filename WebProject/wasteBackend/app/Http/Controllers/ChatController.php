<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    // Send a message (text required, image optional)
    public function sendMessage(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $base64Image = null;
        $image = null;

        // Validate input: message is required, image is optional
        $request->validate([
            'message' => 'required|string', // Message is mandatory
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Optional image upload
            'session_id' => 'required|string'  // Validate session ID
        ]);

        $text = $request->input('message');
        $sessionId = $request->input('session_id');  // Get session ID

        // If an image is uploaded, handle it
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('public/images'); // Store image
            $imageUrl = Storage::url($imagePath); // Get public URL
            $imageData = Storage::get($imagePath); // Read image data
            $base64Image = base64_encode($imageData); // Convert to base64
        } else {
            $imageUrl = null;
        }

        // Get AI response using message and optional image
        $aiResponse = $this->getAIResponse($text, $base64Image, $image);

        // Check if the session title is already set
        $existingChat = Chat::where('session_id', $sessionId)->whereNotNull('session_title')->first();
        $sessionTitle = $existingChat ? $existingChat->session_title : $aiResponse['session_title'];

        // Save user message (text or with image)
        $userMessage = Chat::create([
            'user_id' => $user->id,
            'message' => $request->message,
            'image_path' => $imageUrl, // Image URL if present
            'sender' => 'user',
            'session_id' => $sessionId, // Save the session ID
            'session_title' => $sessionTitle, // Save the session title
        ]);

        

        // Save AI response (text only)
        $aiMessage = Chat::create([
            'user_id' => $user->id,
            'message' => $aiResponse['message'], // Extract the message part of the response
            'image_path' => null, // AI response is text-only
            'sender' => 'ai',
            'session_id' => $sessionId, // Save the session ID
            'session_title' => $sessionTitle, // Save the session title
        ]);

        // Return response
        return response()->json([
            'user_message' => $text,
            'ai_message' => $aiResponse['message'], // Extract the message part of the response
            'session_title' => $sessionTitle,
        ]);
    }

    // Retrieve chat history for a specific session
    public function getChatHistory(string $sessionId)
    {
        $chats = Chat::where('user_id', Auth::id())
            ->where('session_id', $sessionId)
            ->get();

        return response()->json($chats);
    }

    // List all the sessions for a user
    public function getSessionList()
    {
        $sessions = Chat::where('user_id', Auth::id())
            ->distinct()
            ->get(['session_id', 'session_title']);

        return response()->json($sessions);
    }

    // Call AI API
    private function getAIResponse($message, $base64Image, $image)
    {
        $prompt = "Please provide a short and simple answer (about 5 lines) and a session title for this chat session.

        Respond *ONLY* in JSON format:
        {
            \"message\": \"Your short answer\",
            \"session_title\": \"Your session title\"
        }";

        // Construct the parts array
        $parts = [
            [
                'text' => $message . $prompt, // Message is always required
            ],
        ];

        // Add image data if provided
        if (!empty($base64Image) && !empty($image)) {
            $parts[] = [
                'inline_data' => [
                    'mime_type' => $image->getMimeType(), // Image MIME type
                    'data' => $base64Image, // Base64-encoded image data
                ],
            ];
        }

        // Construct the payload
        $payload = [
            'contents' => [
                [
                    'parts' => $parts,
                ],
            ],
            'safetySettings' => [
                [
                    'category' => 'HARM_CATEGORY_HARASSMENT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE',
                ],
                [
                    'category' => 'HARM_CATEGORY_HATE_SPEECH',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE',
                ],
                [
                    'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE',
                ],
                [
                    'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    'threshold' => 'BLOCK_MEDIUM_AND_ABOVE',
                ],
            ],
        ];

        // Gemini API endpoint
        $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . env('GEMINI_API_KEY');

        // Send the request to the Gemini API
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($endpoint, $payload);

        // Handle API errors
        if ($response->failed()) {
            throw new \Exception("Error from AI API: " . $response->body());
        }

        $responseData = $response->json();

        $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'No response from AI.';

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

            $message = $geminiData['message'] ?? 'No response from AI.';
            $sessionTitle = $geminiData['session_title'] ?? 'Untitled Session';

            return ['message' => $message, 'session_title' => $sessionTitle];

        } catch (\Exception $e) {
            // Handle JSON parsing errors
            throw new \Exception('Error parsing JSON from Gemini: ' . $e->getMessage() . ' Raw response: ' . $generatedText);
        }

        
    }
}