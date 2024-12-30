export const signupOtpMailTemplate = {
	subject: 'Verify your account',
	body: (code: number, user: string): string => `
    <div>
    <p>Welcome ${user}</p>
    <p>Use this code to verify your account:<br><b>${code}</b>
    </div>
    `,
};
