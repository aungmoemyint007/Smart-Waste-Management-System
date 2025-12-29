<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'address',
        'phone',
        'about',
        'picture',
        
    ];

    protected $hidden = [
        'password',
        
    ];

    protected $casts = [
        
        'password' => 'hashed',
    ];

    // User can submit multiple reports
    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    // User has one reward account
    public function points()
    {
        return $this->hasOne(Point::class);
    }

    // User can have multiple transactions (for earning or redeeming points)
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // User receives multiple notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // User receives multiple notifications
    public function chats()
    {
        return $this->hasMany(Chat::class);
    }

    public function userRewards()
    {
        return $this->hasMany(UserReward::class);
    }
}
