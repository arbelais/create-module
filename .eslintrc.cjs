/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
    extends: ['xo', 'xo-typescript/space', 'prettier'],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    overrides: [
        {
            files: ['*'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/strict-boolean-expressions': 'off',
                '@typescript-eslint/restrict-template-expressions': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
            },
        },
    ],
};
