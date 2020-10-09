module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    globals: {
        rootDir: true,
        userDir: true,
        bfunLib: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'indent': [
            'error',
            4,
            { SwitchCase: 1 }
        ],
        'linebreak-style': ['off'],
        'no-console': ['off'],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
