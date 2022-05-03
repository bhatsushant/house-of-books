const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.json([{ name: 'Tanay' }, { name: 'Sushant' }, { name: 'Harshal' }]);
    return [{ name: 'Tanay' }, { name: 'Sushant' }, { name: 'Harshal' }];
});
module.exports = router;
