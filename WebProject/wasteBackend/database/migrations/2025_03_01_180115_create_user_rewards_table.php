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
        Schema::create('user_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('reward_id')->constrained()->onDelete('cascade');
            $table->string('invite_link')->nullable(); // Telegram invite link
            $table->timestamp('invite_link_expires_at')->nullable(); // Expiration timestamp for Telegram link
            $table->timestamp('invite_link_visited_at')->nullable(); // Telegram invite link visited date
            $table->string('invite_link_status')->default('valid'); // Telegram invite link status
            $table->text('qr_code')->nullable(); // QR code for Telegram invite link
            $table->string('drive_link_status')->default('valid'); // Google Drive link status
            $table->string('drive_link')->nullable(); // Google Drive link
            $table->timestamp('redeemed_at')->nullable(); // Reward redeemed date
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_rewards');
    }
};
