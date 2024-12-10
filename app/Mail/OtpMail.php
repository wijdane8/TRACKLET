<?php

namespace App\Mail;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public User $user;
    public Otp $otp;

    /**
     * Create a new message instance.
     *
     * @param User $user
     * @param Otp $otp
     */
    public function __construct(User $user, Otp $otp)
    {
        $this->user = $user;
        $this->otp = $otp;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->subject(__('app.otp_mail_subject')) // تعيين عنوان البريد
            ->markdown('mail.auth.otp')
            ->with([
                'user' => $this->user,
                'otp' => $this->otp->code,        // تمرير كود OTP
            ]);
    }
}