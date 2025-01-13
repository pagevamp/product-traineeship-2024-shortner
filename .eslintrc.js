module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: ['plugin:@typescript-eslint/recommended'],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'no-restricted-imports': [
			'error',
			{
				patterns: ['../*', './*'],
			},
		],
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/typedef': 'error',
	},
};
