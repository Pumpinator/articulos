const express = require("express");
const router = express.Router();
const articleModel = require("../models/articleModel");

const { authMiddleware, isLogged } = require("../configs/authMiddleware");

router.get("/articulo/crear", authMiddleware, (req, resp) => {
  try {
    const locals = {
      title: "Crear | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Nuevo artículo",
      isLogged: isLogged(req),
    };
    resp.render("article/create", { locals });
  } catch (error) {
    console.log(error);
  }
});

router.post("/articulo/crear", authMiddleware, async (req, resp) => {
  try {
    try {
      const { title, body } = req.body;
      await articleModel.create({ title: title, body: body });
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
      isLogged: isLogged(req),
    };
    const id = req.params.id;
    const data = await articleModel.findById({ _id: id });
    resp.render("article/lecture", { locals, data });
  } catch (error) {
    console.error(error);
  }
});

router.get("/articulo/actualizar/:id", authMiddleware, async (req, resp) => {
  try {
    const locals = {
      title: "Editar | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Editar artículo",
      isLogged: isLogged(req),
    };
    const { id } = req.params;
    const data = await articleModel.findById({ _id: id });
    resp.render("article/update", {
      locals,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/articulo/actualizar/:id", authMiddleware, async (req, resp) => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;
    await articleModel.findByIdAndUpdate(id, {
      title: title,
      body: body,
      updated_at: Date.now(),
    });
    resp.redirect(`/articulo/actualizar/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/articulo/eliminar/:id', authMiddleware, async (req, resp) => {
  try {
    const id = req.params.id;
    await articleModel.deleteOne( { _id: id } );
    resp.redirect('/inicio');
  } catch (error) {
    console.log(error);
  }

});

router.post("/articulo/buscar", async (req, resp) => {
  try {
    const locals = {
      title: "Buscar | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Resultados de búsqueda",
      isLogged: isLogged(req),
    };

    const searchTerm = req.body.searchTerm;
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

router.use((req, resp) => {
  resp.status(404).render("partials/error", {
    error: { code: 404, message: "Página no encontrada." },
  });
});

module.exports = router;
