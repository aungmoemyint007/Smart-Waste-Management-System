<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie; // Make sure this is imported
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;  // Missing import
use Illuminate\Validation\ValidationException; // Missing import
use App\Models\User;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\DB;
use Exception;  

class AuthController extends Controller
{
    public function register(Request $request){
        try {
            // Validate the request
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|max:255|unique:users',
                'password' => 'required|string|min:6'
            ]);

            // Create the user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password), // Hash the password
            ]);

            // Retrieve the user ID
            $userId = $user->id;

            DB::table('points')->insert([
                'user_id' => $userId,
                'points' => 0, // Set the initial points
                'level' => 1, // Set the default level
                'description' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Return a success message without a token
            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'user' => $user
            ], 201); // HTTP 201 Created

        } catch (ValidationException $e) {
            // Validation error handling
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors() // Return validation errors
            ], 422); // HTTP 422 Unprocessable Entity

        } catch (Exception $e) {
            // General error handling
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during registration',
                'error' => $e->getMessage() // Return the error message
            ], 500); // HTTP 500 Internal Server Error
        }
    }

    public function login(Request $request) {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);
    
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }
    
        $user = Auth::user();
        $token = $user->createToken('token')->plainTextToken;
    
        $cookie = cookie('jwt', $token, 60 * 24, '/', null, false, true, true);
        // '/' = Cookie available for all routes
        // null = Allow any domain (Don't restrict to '127.0.0.1')
        // false = Not Secure (Set to `true` in production)
        // true = HttpOnly (JavaScript cannot access it)
        // false = Not a session cookie (Persists even after closing browser)
        $points = $user->points ? $user->points->points : 0;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }
    

    public function logout(){
        $cookie = Cookie::forget('jwt');

        return response()->json([
            'message' => 'Successfully logged out'
        ])->withCookie($cookie);
    }

public function user()
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Retrieve the points from the points table
    $points = $user->points ? $user->points->points : 0;

    return response()->json([
        'user' => $user,
        
    ]);
}

public function changeProfile(Request $request)
{
    try {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate incoming data
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|string|max:255|unique:users,email,' . $user->id, // Ignore the current user's email for uniqueness
            'picture' => 'nullable|string', // Base64 string instead of image file
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'about' => 'nullable|string|max:255',
        ]);

        // Handle the base64 image upload if provided
        if ($request->has('picture') && $validated['picture']) {
            // Check if the picture is a valid base64 string
            $imageData = $validated['picture'];
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                // Get the image type
                $imageType = strtolower($type[1]); // jpg, png, gif, etc.
                if (!in_array($imageType, ['jpeg', 'png', 'jpg', 'gif', 'svg'])) {
                    return response()->json(['error' => 'Invalid image type.'], 400);
                }

                // Decode the base64 string
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $imageData = base64_decode($imageData);

                // Generate a unique file name
                $fileName = 'profile_picture_' . time() . '.' . $imageType;

                // Store the image file in the storage folder
                $path = 'profile_pictures/' . $fileName;
                Storage::put('public/' . $path, $imageData);
                $validated['picture'] = $path;  // Store the relative path in the database
            } else {
                return response()->json(['error' => 'Invalid base64 image format.'], 400);
            }
        }

        // Convert string 'null' to actual null
        foreach ($validated as $key => $value) {
            if ($value === 'null') {
                $validated[$key] = null;
            }
        }

        // Update user profile with the validated data
        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'phone' => $validated['phone'] ?? $user->phone,
            'address' => $validated['address'] ?? $user->address,
            'about' => $validated['about'] ?? $user->about,
            'picture' => $validated['picture'] ?? $user->picture, // Use picture instead of photo
        ]);

        $imageUrl = url('storage/' . $user->picture);

        $imageUrl = str_replace("\\", "", $imageUrl);


        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'picture' => $user->picture ? $imageUrl : null,  // This will return the correct URL
                'name' => $user->name,
                'phone' => $user->phone,
                'address' => $user->address,
                'about' => $user->about,
            ]
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error updating profile',
            'error' => $e->getMessage()
        ], 500);
    }
}




}
