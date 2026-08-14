module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                // Jest test globals
                describe: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            semi: ['warn', 'always']
        }
    }
];
