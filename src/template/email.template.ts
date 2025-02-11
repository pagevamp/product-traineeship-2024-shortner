export const signupOtpMailTemplate = {
	subject: 'Verify your account',
	/**
	 * Generates a random OTP of the specified size.
	 * @param otpCode - code to send to through email.
	 * @param userName - name of the user to send the email to.
	 */
	body: (otpCode: string, userName: string): string => `
<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px;">
    <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #333333; margin: 0; font-size: 24px;">Welcome ${userName}!</h1>
    </div>
    
    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0;">
        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">Please use the following code to verify your account:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; text-align: center;">
            <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 5px;">
                ${otpCode}
            </span>
        </div>
        
        <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
            If you didn't request this code, please ignore this email.
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px 0;">
        <p style="color: #999999; font-size: 12px; margin: 0;">
        This is an automated message, please do not reply.
        </p>
    </div>
</div>
    `,

	text: (otpCode: string, userName: string): string => `
Welcome ${userName}!
Please use the following code to verify your account:
${otpCode}
If you didn't request this code, please ignore this email.
 This is an automated message, please do not reply.
`,
};

export const expiredShortCodeMailTemplate = {
	subject: 'Your short URL has expired.',
	/**
	 * Notifies user about expired url through email.
	 * @param shortCode - short code of url to send to through email.
	 * @param userName - name of the user to send the email to.
	 */
	body: (shortCode: string, userName: string): string => `
<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px;">
    <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #333333; margin: 0; font-size: 24px;">URL Expiration Notice</h1>
    </div>
    
    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0;">
        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
            Hey ${userName},
        </p>
        
        <div style="background-color: #fff4f4; padding: 15px; border-radius: 6px; border-left: 4px solid #ff6b6b;">
            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0;">
                Your shortened URL with code 
                <span style="font-family: 'Courier New', monospace; font-weight: bold; color: #ff6b6b; letter-spacing: 1px;">
                    ${shortCode}
                </span> 
                has expired.
            </p>
        </div>
        
        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0 0 0;">
            If you need to continue sharing this URL, please create a new shortened link from your dashboard.
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px 0;">
        <p style="color: #999999; font-size: 12px; margin: 0;">
            This is an automated message, please do not reply.
        </p>
    </div>
</div>
    `,
	text: (shortCode: string, userName: string): string => `
Hey ${userName}!
Your shortened URL with code ${shortCode} has expired.
If you need to continue sharing this URL, please create a new shortened link from your dashboard.
This is an automated message, please do not reply.
`,
};
