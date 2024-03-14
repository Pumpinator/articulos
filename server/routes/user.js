const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const articleModel = require("../models/articleModel");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const { authMiddleware, isLogged } = require("../configs/authMiddleware");
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/inicio", authMiddleware, async (req, resp) => {
  try {
    const locals = {
      title: "Inicio | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Inicio",
      isLogged: isLogged(req),
    };
    const data = await articleModel.find();
    resp.render("user/articles", {
      locals,
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/registrar", (req, resp) => {
  try {
    const locals = {
      title: "Registro | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Registro",
      isLogged: isLogged(req),
    };
    resp.render("user/signup", { locals });
  } catch (error) {
    console.error(error);
  }
});

router.post("/registrar", async (req, resp) => {
  try {
    const { username, password } = req.body;
    const encodedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await userModel.create({
        username: username,
        password: encodedPassword,
      });
      resp.status(201).redirect("/ingresar");
    } catch (error) {
      if (error.code === 11000)
        resp.status(409).render("partials/error", {
          error: { code: 409, message: "El nombre de usuario ya está en uso." },
        });
    }
  } catch (error) {
    resp.status(500).render("partials/error", {
      error: {
        code: 500,
        message:
          "El servidor se encontró con un error y no podemos completar tu solicitud.",
      },
    });
  }
});

router.get("/ingresar", (req, resp) => {
  if (isLogged(req)) return resp.redirect("/inicio");
  try {
    const locals = {
      title: "Ingreso | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Ingreso",
      isLogged: isLogged(req),
    };
    resp.render("user/login", { locals });
  } catch (error) {
    console.error(error);
  }
});

router.post("/ingresar", async (req, resp) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!user || !validPassword) {
      resp.status(401).json({ message: "Credenciales incorrectas." });
    }
    const token = jsonwebtoken.sign({ userId: user._id }, JWT_SECRET);
    resp.cookie("token", token, { httpOnly: true });
    resp.redirect("/inicio");
  } catch (error) {
    console.error(error);
  }
});

router.get("/salir", (req, resp) => {
  resp.clearCookie("token");
  resp.redirect("/");
});

module.exports = router;
