const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const articleModel = require("../models/articleModel");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const userLayout = "../views/layouts/user";

const JWTSECRET = process.env.JWT_SECRET;

const authMiddleware = (req, resp, next) => {
  const token = req.cookies.token;
  if (!token) {
    return resp.status(401).json({ message: "No autorizado." });
  }
  try {
    const decoded = jsonwebtoken.verify(token, JWTSECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return resp.status(401).json({ message: "No autorizado." });
  }
};

router.get("/registrar", (req, resp) => {
  try {
    const locals = {
      title: "Registro | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Registro",
    };
    resp.render("user/userForm", { locals });
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
      resp.status(201).json({
        message: "Creado.",
        user,
      });
    } catch (error) {
      if (error.code === 11000)
        resp.status(409).json({
          message: "Duplicado.",
        });
    }
  } catch (error) {
    resp.status(500).json({
      message: "Error.",
    });
  }
});

router.get("/ingresar", (req, resp) => {
  try {
    const locals = {
      title: "Ingreso | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Ingreso"
    };
    resp.render("user/index", { locals });
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
    const token = jsonwebtoken.sign({ userId: user._id }, JWTSECRET);
    resp.cookie("token", token, { httpOnly: true });
    resp.redirect("/inicio");
  } catch (error) {
    console.error(error);
  }
});

router.get("/inicio", authMiddleware, async (req, resp) => {
  try {
    const locals = {
      title: "Inicio | Articulos UTL",
      description: "Hecho por Quetzalcode.",
      header: "Inicio"
    };
    const data = await articleModel.find();
    resp.render("user/home", { locals, data, layout: userLayout });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
