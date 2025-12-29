<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');  // Foreign key to users table
            $table->foreignId('collector_id')->nullable()->constrained('users')->onDelete('set null');  // Foreign key to users table
            $table->string('location');
            $table->string('waste_type');
            $table->string('amount');
            $table->string('recycle_or_not');  // Can be 'yes' or 'no'
            $table->text('reason');
            $table->string('image_url')->nullable();  // Optional, in case an image is uploaded
            $table->text('verification_result')->nullable();  // Can hold any verification data
            $table->enum('status', ['pending', 'verified', 'in_progress', 'completed'])->default('pending');
            $table->dateTime('reported_date');
            $table->dateTime('collected_date')->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
