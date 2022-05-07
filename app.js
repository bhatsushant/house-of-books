const express = require('express');
const app = express();
const configRoutes = require('./routes');
const cors = require('cors');
const path = require('path');
require('dotenv').config;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}
// app.use(express.static(path.join(__dirname, 'client', 'build')));
configRoutes(app);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(process.env.PORT || 4000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:4000');
});
