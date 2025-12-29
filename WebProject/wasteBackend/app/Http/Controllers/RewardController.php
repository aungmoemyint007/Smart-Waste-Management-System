<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reward;
use App\Models\UserReward;
use App\Models\Point;
use App\Models\Notification;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Auth;

class RewardController extends Controller
{
    public function getAllRewards()
    {
        $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
        }

        $rewards = Reward::all();

        return response()->json(['rewards' => $rewards]);
    }

    public function redeem(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $reward = Reward::findOrFail($request->reward_id);
        $userPoints = Point::where('user_id', $user->id)->sum('points');

        if ($userPoints < $reward->points_required) {
            return response()->json(['error' => 'Not enough points'], 400);
        }

        // Deduct points
        Point::where('user_id', $user->id)->decrement('points', $reward->points_required);

         // Create a new UserReward entry first
        $userReward = UserReward::create([
            'user_id' => $user->id,
            'reward_id' => $reward->id,
            'invite_link_status' => 'pending' // Mark it as pending initially
        ]);

        $invite_link = null;
        $drive_link = null;

        $this->createTransaction($user->id, 'exchanged_reward', $reward->points_required, 'Points exchanged for rewards');
        
                // // Create a notification for the user
        $this->createNotification($user->id, "You've exchanged $reward->points_required points for exchanging $reward->name", 'reward');
        

        // Generate link
        if ($reward->type == 'telegram_invite') {
            $invite_link = $this->generateTelegramInvite($reward->chat_id, $userReward->id);
            $qr = QrCode::format('png')->size(300)->generate($invite_link ?? $drive_link);
            $qrBase64 = base64_encode($qr);
            $userReward->update(['invite_link' => $invite_link, 'invite_link_status' => 'valid', 'redeemed_at' => now(), 'qr_code' => $qrBase64]);
        } elseif ($reward->type == 'google_drive') {
            $drive_link = $this->generateOneTimeDriveLink($reward->drive_link);
            $userReward->update(['drive_link' => $driveLink, 'drive_link_status' => 'valid', 'redeemed_at' => now()]);
        }

        

        

        return response()->json(['success' => true, 'data' => $userReward]);
    }

    protected function createTransaction($userId, $type, $amount, $description)
    {
        Transaction::create([
            'user_id' => $userId,
            'type' => $type,
            'amount' => $amount, // Use 'amount' instead of 'points'
            'description' => $description,
        ]);
    }

    protected function createNotification($userId, $message, $category)
    {
        Notification::create([
            'user_id' => $userId,
            'message' => $message,
            'category' => $category,
        ]);
    }

    public function getReward($id){
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $reward = Reward::findOrFail($id);

        return response()->json(['reward' => $reward]);
    }

    public function getUserReward($id){
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userReward = UserReward::findOrFail($id);

        return response()->json(['user_reward' => $userReward]);
    }

    private function generateTelegramInvite($chatId, $userRewardId)
{
    $botToken = env('TELEGRAM_BOT_TOKEN');
    try {
        $response = Http::retry(3,100)->post("https://api.telegram.org/bot{$botToken}/createChatInviteLink", [
            'chat_id' => $chatId,
            'expire_date' => time() + 3600, // 1-hour validity
            'member_limit' => 1
        ]);
        
        if ($response->successful()) {
            $invite_link = $response->json()['result']['invite_link'] ?? null;
        } else {
            throw new \Exception('Telegram API Error: ' . $response->body());
        }

    } catch (\Exception $e) {
        return response()->json(['error' => 'Telegram API Error', 'message' => $e->getMessage()], 500);
    }

    // If the link was successfully created
    if ($invite_link != null) {
        // Update the specific UserReward entry
        UserReward::where('id', $userRewardId)->update([
            'invite_link_expires_at' => now()->addHour(),
            'invite_link_status' => 'valid'
        ]);
    }

    return $invite_link;
}

public function test(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $reward = Reward::findOrFail($request->reward_id);
    $chatId = $reward->chat_id;
    $botToken = env('TELEGRAM_BOT_TOKEN');

    $response = Http::post("https://api.telegram.org/bot8073813597:AAEbMixAXs0ue8pyL0z6uYBMJbNqDzEOoR4/createChatInviteLink", [
        'chat_id' => $chatId,
        'expire_date' => time() + 3600, // 1-hour validity
        'member_limit' => 1
    ]);
    
    if ($response->successful()) {
        $invite_link = $response->json()['result']['invite_link'] ?? null;
    } else {
        throw new \Exception('Telegram API Error: ' . $response->body());
    }
    return response()->json(['chatId'=>$chatId, 'invite_link' => $invite_link, 'botToken' => $botToken]);
}


    private function generateOneTimeDriveLink($driveLink)
    {
        return $driveLink . '?auth=' . bin2hex(random_bytes(16));
    }

    public function getQRCode($id)
    {
        $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $userReward = UserReward::findOrFail($id);
        $link = $userReward->invite_link ?? $userReward->drive_link;

        // Optionally, you can check if the link is expired
        if ($userReward->invite_link_status === 'valid' && $userReward->invite_link_expires_at < now()) {
            // Expired
            $userReward->update(['invite_link_status' => 'expired']);
        }

        $qrCode = QrCode::format('png')->size(300)->generate($link);
        $qrCodeBase64 = base64_encode($qrCode);

        // Return the QR code as a base64 string in JSON response
        return response()->json([
            'qr_code' => 'data:image/png;base64,' . $qrCodeBase64
        ]);
    }

    public function checkInviteLinkStatus($id)
    {
        $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
        }
        // $id = $request->id;
        $userReward = UserReward::findOrFail($id);

        if ($userReward->invite_link_status === 'valid' && !$userReward->invite_link_visited_at) {
            // When the user visits the link, mark it as "used" and set the visited timestamp
            $userReward->update([
                'invite_link_status' => 'used',
                'invite_link_visited_at' => now(),
            ]);
        }
    
        // Check if the invite link is expired
        if ($userReward->invite_link_status === 'valid' && $userReward->invite_link_expires_at < now()) {
            // Update the status to expired if the link has expired
            $userReward->update(['invite_link_status' => 'expired']);
            return response()->json(['status' => 'expired']);
        }
    
        return response()->json([
            'status' => $userReward->invite_link_status,
            'visited_at' => $userReward->invite_link_visited_at, // Include the visit timestamp if available
        ]);
        // Check the expiration status of the Telegram invite link
        if ($userReward->invite_link_status === 'valid' && $userReward->invite_link_expires_at < now()) {
            // If expired, update the status
            $userReward->update(['invite_link_status' => 'expired']);
            return response()->json(['status' => 'expired']);
        }

        return response()->json(['status' => $userReward->invite_link_status]);
    }

     // New method to handle the visiting of the Google Drive link
     public function visitDriveLink($id)
     {
        $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
         $userReward = UserReward::findOrFail($id);
 
         if ($userReward->drive_link_status === 'valid') {
             // Mark the drive link as used
             $userReward->update([
                 'drive_link_status' => 'used',
                 'visited_at' => now(),  // Record the time of visit
             ]);
 
             return response()->json(['message' => 'Drive link has been visited.']);
         }
 
         return response()->json(['message' => 'Drive link has already been used or is expired.'], 400);
     }

     public function getUserHistory()
     {
         $user = Auth::user();
         if (!$user) {
             return response()->json(['error' => 'Unauthorized'], 401);
         }
     
         $userRewards = UserReward::with('reward:id,name,type,points_required')
             ->where('user_id', $user->id)
             ->get();
     
         return response()->json([
             'user_rewards' => $userRewards
         ]);
     }
     
}
