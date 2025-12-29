<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserReward extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'reward_id','qr_code', 'invite_link', 'invite_link_status', 'drive_link', 'drive_link_status', 'redeemed_at', 'invite_link_expires_at', 'invite_link_visited_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reward()
    {
        return $this->belongsTo(Reward::class);
    }
}
