<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\GeminiController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PointController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/send-message', [ChatController::class, 'sendMessage']);
    Route::get('/chat-history', [ChatController::class, 'getChatHistory']);
    Route::post('/verify-waste', [GeminiController::class, 'verifyWaste']);
    Route::post('/create-report', [ReportController::class, 'createReport']);
    Route::get('/get-all-reports', [ReportController::class, 'getAllReports']);
    Route::get('/show-all-reports', [ReportController::class, 'showAllReports']);
    Route::put('/update-report-status', [ReportController::class, 'updateStatus']);
    Route::get('/chat-history/{sessionId}', [ChatController::class, 'getChatHistory']);  // Route with Session ID
    Route::get('/session-list', [ChatController::class, 'getSessionList']);
    Route::post('/verify-collect', [ReportController::class, 'verifyCollectedWaste']);
    Route::get('/leaderboard', [LeaderboardController::class, 'getAllPointsWithUserNames']);
    Route::post('/redeem', [RewardController::class, 'redeem']);
    Route::get('/qr-code/{id}', [RewardController::class, 'getQRCode']);
    Route::get('/check-invite-link/{id}', [RewardController::class, 'checkInviteLinkStatus']);
    Route::get('/check-drive-link/{id}', [RewardController::class, 'visitDriveLink']);
    Route::get('/get-all-rewards', [RewardController::class, 'getAllRewards']);
    Route::get('/get-user-rewards', [RewardController::class, 'getUserHistory']);
    Route::post('/test-invite', [RewardController::class, 'test']);
    Route::get('/get-reward/{id}', [RewardController::class, 'getReward']);
    Route::get('/get-user-reward/{id}', [RewardController::class, 'getUserReward']);
    Route::get('/get-unread-notifications', [NotificationController::class, 'getAllNotifications']);
    Route::put('/mark-as-read/{id}', [NotificationController::class, 'markAsRead']);
    Route::get('/get-user-points', [PointController::class, 'getUserPoints']);
    Route::post('/change-profile', [AuthController::class, 'changeProfile']);
    Route::get('/test-invite-link/{id}', function($id) {
        return response()->json(['status' => 'success', 'id' => $id]);
    });
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


