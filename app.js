const express = require('express');
const app = express();
const configRoutes = require('./routes');
const cors = require('cors');
const path = require('path');
require('dotenv').config;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'client', 'build')));
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

configRoutes(app);

app.listen(process.env.PORT || 4000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:4000');
});
