const express = require('express');

function createApp() {
    const app = express();
    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Hello from the Week 5 CI/CD sample app!' });
    });

    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    // A simple calculator endpoint - gives the test suite something real to check
    app.get('/add', (req, res) => {
        const a = Number(req.query.a);
        const b = Number(req.query.b);
        if (Number.isNaN(a) || Number.isNaN(b)) {
            return res.status(400).json({ error: 'a and b must be numbers' });
        }
        res.json({ result: a + b });
    });

    return app;
}

module.exports = createApp;

// Only start the server if this file is run directly (not when required by tests)
if (require.main === module) {
    const app = createApp();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
}
