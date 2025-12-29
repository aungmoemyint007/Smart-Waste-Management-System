<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    use HasFactory;

    // Make sure to include 'name' in the fillable attributes
    protected $fillable = ['user_id', 'points', 'level'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
