<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LeaderboardController extends Controller
{
    public function getAllPointsWithUserNames()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get points along with user name and user picture
        $points = DB::table('points')
            ->join('users', 'points.user_id', '=', 'users.id')
            ->select('points.*', 'users.name as user_name', 'users.picture as user_picture')  // Added user picture
            ->get();

        return response()->json(['points' => $points], 200);
    }
}
