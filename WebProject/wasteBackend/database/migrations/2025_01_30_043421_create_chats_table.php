<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('chats', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id'); // Foreign key to users table
        $table->text('message')->nullable(); // Stores the text message (nullable)
        $table->string('image_path')->nullable(); // Stores the image path (nullable)
        $table->string('sender'); // 'user' or 'ai'
        $table->timestamps(); // created_at and updated_at
        $table->string('session_id');  // ADD THIS LINE
        $table->text('session_title')->nullable(); // ADD THIS LINE


        // Foreign key constraint
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};
