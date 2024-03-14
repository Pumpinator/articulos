const express = require("express");
const router = express.Router();
const articleModel = require("../models/articleModel");

router.get("/articulo/agregar", (req, resp) => {
  try {
    const locals = {
      title: "Crear | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Nuevo artículo",
    };
    resp.render("article/articleForm", { locals });
  } catch (error) {
    console.log(error);
  }
});

router.post("/articulo/agregar", (req, resp) => {
  try {
    console.log(req.body);
    try {
      const { title, body } = req.body;
      const article = articleModel.create({ title: title, body: body });
      resp.redirect("/inicio");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/articulo/:id", async (req, resp) => {
  try {
    const locals = {
      title: "Articulo | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Articulo",
    };
    let slug = req.params.id;
    const data = await articleModel.findById({ _id: slug });
    resp.render("article/index", { locals, data });
  } catch (error) {
    console.error(error);
  }
});

router.post("/buscar", async (req, resp) => {
  try {
    const locals = {
      title: "Buscar | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Resultados de búsqueda",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await articleModel.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    resp.render("article/search", { data, locals });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
