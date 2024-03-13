const express = require("express");
const router = express.Router();
const article = require("../models/articleModel");

router.get("/articulo", (req, resp) => {
  resp.render("articleForm");
});

router.get("/articulo/:id", async (req, resp) => {
  try {
    const locals = {
      title: "Articulo | Articulos UTL",
      description: "Hecho por Quetzalcode.",
    };
    let slug = req.params.id;
    const data = await article.findById({ _id: slug });
    resp.render("articleView", { locals, data });
  } catch (error) {
    console.error(error);
  }
});

router.post("/buscar", async (req, resp) => {
  try {
    const locals = {
      title: "Buscar | Articulos UTL",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await article.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    resp.render("search", { data, locals });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
