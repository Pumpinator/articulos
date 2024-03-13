const express = require("express");
const router = express.Router();

router.get('/', (req, resp) => {
    const locals = {
        title: "Inicio | Articulos",
        active: true
    }
    resp.render("index", {locals});
})

module.exports = router;