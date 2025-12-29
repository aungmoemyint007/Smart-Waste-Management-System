<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reward extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'chat_id', 'drive_link', 'points_required'];


    public function userRewards()
    {
        return $this->hasMany(UserReward::class);
    }
}
