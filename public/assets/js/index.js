require('dotenv').config();
const express = require('express');
const auth = require('basic-auth');
const path = require('path');

const app = express();

// Load username and password from .env
const USERNAME = process.env.PROXY_USERNAME;
const PASSWORD = process.env.PROXY_PASSWORD;

// Authentication middleware
function authenticate(req, res, next) {
    const user = auth(req);
    if (user && user.name === USERNAME && user.pass === PASSWORD) {
        return next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm="Proxy Login"');
        return res.status(401).send('Access Denied: Incorrect Credentials');
    }
}

// Protect everything inside `public/`
app.use(authenticate);
app.use(express.static(path.join(__dirname, 'public')));  // Serves static files

// Start the proxy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy running on http://localhost:${PORT} (with authentication)`);
});
