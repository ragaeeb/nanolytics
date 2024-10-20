export default {
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            reportsDirectory: './coverage',
        },
        include: ['src/**/*.test.ts'],
    },
};
