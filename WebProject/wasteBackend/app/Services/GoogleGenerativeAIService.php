<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException; // Import RequestException
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Log; // For logging

class GoogleGenerativeAIService
{
    protected $httpClient;
    protected $apiKey;

    public function __construct()
    {
        $this->httpClient = new Client(['base_uri' => 'https://generativelanguage.googleapis.com/v1beta2/']); // Correct base URI
        $this->apiKey = env('GEMINI_API_KEY');
    }

    // ... (preprocessImage function remains the same)

    public function analyzeImage($filePath)
    {
        $base64Data = $filePath;
        $mimeType = 'image/jpg';

        $endpoint = 'models/gemini-1.5-pro:generateMessage'; // Double-check endpoint in docs
        $headers = [
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ];

        $prompt = "You are an expert in waste management and recycling. Analyze this image and provide:
            1. The type of waste (e.g., plastic, paper, glass, metal, organic)
            2. An estimate of the quantity or amount (in kg or liters)
            3. Your confidence level in this assessment (as a percentage, between 0 and 1)
            4. Are these waste recycle or non-recycle
            5. And the reason for why it can recycle or non-recycle
            6. If the image is not real waste like cartoon or animals or humans, respond only confidence.

            Respond *ONLY* in JSON format, like this (and nothing else):
            ```json
            {
              \"wasteType\": \"type of waste\",
              \"quantity\": \"estimated quantity with unit\",
              \"confidence\": confidence level as a number between 0 and 1, when if the image is not real waste, respond 0 only
              \"recycle\": \"recycle\" or \"non-recycle\",
              \"reason\": \"the reason for why it can recycle or non-recycle in short point\"
            }
            ```"; // Improved prompt

        $body = [
            'prompt' => $prompt,
            'instances' => [
                [
                    'image' => [
                        'data' => $base64Data,
                        'mimeType' => $mimeType,
                    ],
                ],
            ],
        ];

        try {
            $response = $this->httpClient->post($endpoint, [
                'headers' => $headers,
                'json' => $body,
            ]);

            $responseData = json_decode($response->getBody()->getContents(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Invalid JSON response from Gemini API: ' . json_last_error_msg() . ' - Response Body: ' . $response->getBody());
                throw new \Exception('Invalid JSON response from Gemini API.');
            }

            // More robust response handling:
            if (isset($responseData['candidates'][0]['output'])) {
                $output = $responseData['candidates'][0]['output'];
                $decodedOutput = json_decode($output, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error('Invalid JSON in Gemini output: ' . json_last_error_msg() . ' - Output: ' . $output);
                    throw new \Exception('Invalid JSON in Gemini output.');
                }

                return $decodedOutput;
            } else {
                Log::error('Unexpected response structure from Gemini API: ' . print_r($responseData, true));
                throw new \Exception('Unexpected response structure from Gemini API.');
            }


        } catch (RequestException $e) { // Catch Guzzle exceptions
            $errorMessage = 'Error analyzing image: ' . $e->getMessage();
            if ($e->hasResponse()) {
                $errorBody = $e->getResponse()->getBody();
                $errorCode = $e->getResponse()->getStatusCode();
                $errorMessage .= " (Status Code: {$errorCode}, Response: {$errorBody})";
                Log::error($errorMessage); // Log detailed error
            } else {
                Log::error($errorMessage);
            }
            throw new \Exception($errorMessage);
        } catch (\Exception $e) {
            Log::error($e); // Log other exceptions
            throw $e;
        }
    }
}