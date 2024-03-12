const express = require("express");
const router = express.Router();

router.get('/', (req, resp) => {
    resp.send("Hola Mundo!");
})

module.exports = router;