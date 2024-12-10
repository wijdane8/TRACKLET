<x-mail::message>
Hi {{ $user->name }},

Your 6-digit code is:

<strong>{{ $otp }}</strong>

@if ($otpType == 'password-reset')
Use this code to reset your password in the {{ config('app.name') }} app.
@else
Use this code to verify your account in the {{ config('app.name') }} app.
@endif

Do not share this code. {{ config('app.name') }} representatives will never ask you to verify this code over the phone or SMS.

<strong>The code is valid for {{ $expiry }}.</strong>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
