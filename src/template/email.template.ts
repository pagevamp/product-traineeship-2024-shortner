export const signupOtpMailTemplate = {
	subject: 'Verify your account',
	/**
	 * Generates a random OTP of the specified size.
	 * @param otpCode - code to send to through email.
	 * @param userName - name of the user to send the email to.
	 */
	body: (otpCode: number, userName: string): string => `
    <div>
    <p>Welcome ${userName}</p>
    <p>Use this code to verify your account:<br><b>${otpCode}</b>
    </div>
    `,
};
