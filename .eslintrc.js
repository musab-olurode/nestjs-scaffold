module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'@stylistic',
		'unused-imports',
		'import',
		'prettier',
		'simple-import-sort',
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'prettier/prettier': 'warn',
		'no-unused-vars': 'off',
		'unused-imports/no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'padding-line-between-statements': [
			'warn',
			{ blankLine: 'always', prev: '*', next: 'return' },
			{ blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
			{
				blankLine: 'any',
				prev: ['const', 'let', 'var'],
				next: ['const', 'let', 'var'],
			},
		],
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					['^@nestjs'], // Nestjs imports
					['\\.module$'], // Module imports
					['\\.provider$'], // Provider imports
					['\\.interceptor$'], // Interceptor imports
					['\\.guard$'], // Guard imports
					['\\.strategy$'], // Strategy imports
					['\\.decorator$'], // Decorator imports
					['\\.validation$'], // Validation imports
					['\\.entity$'], // Entity imports
					['\\.dto$'], // Dto imports
					['\\.controller$'], // Controller imports
					['\\.service$'], // Service imports
					['^'], // Other imports
					['^@?\\w'], // Other node_modules
					['^\\.'], // Relative imports
				],
			},
		],
		'no-console': 'error',
		'no-implied-eval': 'error',
		'no-empty-function': 'off',
		'no-else-return': 'error',
		'no-await-in-loop': 'error',
		'no-duplicate-case': 'error',
		'no-inner-declarations': 'error',
		'valid-jsdoc': 'warn',
		'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
		'no-trailing-spaces': 'error',
		'require-await': 'error',
		indent: 'off',
		'max-params': 'off',
		'no-shadow': 'off',
		'no-nested-ternary': 'error',
		'@stylistic/block-spacing': 'error',
		'@typescript-eslint/no-unnecessary-condition': 'error',
		'@typescript-eslint/array-type': 'error',
		'@typescript-eslint/await-thenable': 'error',
		'@typescript-eslint/no-empty-function': [
			'error',
			{ allow: ['constructors'] },
		],
		'@typescript-eslint/no-loop-func': 'error',
		'@typescript-eslint/no-array-constructor': 'error',
		'@typescript-eslint/no-base-to-string': 'error',
		'@typescript-eslint/no-duplicate-enum-values': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-implied-eval': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/restrict-plus-operands': 'error',
		'@typescript-eslint/no-shadow': 'error',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
	},
};
