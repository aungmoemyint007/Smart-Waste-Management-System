<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'reporter_id',
        'collector_id',
        'location',
        'waste_type',
        'amount',
        'recycle_or_not',
        'reason',
        'image_url',
        'type',
        'verification_result',
        'status',
        'reported_date',
        'collected_date',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship for the reporter
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    // Relationship for the collector
    public function collector()
    {
        return $this->belongsTo(User::class, 'collector_id');
    }

}
