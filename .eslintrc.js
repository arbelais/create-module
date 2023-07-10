module.exports = {
    extends: ['xo', 'xo-typescript/space', 'prettier'],
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
