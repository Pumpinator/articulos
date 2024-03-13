const express = require("express");
const router = express.Router();

router.get('/', (req, resp) => {
    const locals = {
        title: "Inicio | Articulos",
        active: true
    }
    resp.render("index", { locals });
})

router.get('/registro', (req, resp) => {
    resp.render("signup");
})

router.get('/ingreso', (req, resp) => {
    resp.render("login");
})

router.get('/articulo/registro', (req, resp) => {
    resp.render("articleForm");
})

module.exports = router;