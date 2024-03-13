const express = require("express");
const router = express.Router();

const userLayout = '../views/layouts/user';

router.get("/registro", (req, resp) => {
  try {
    const locals = {
      title: "Registro | Articulos UTL",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };
    resp.render("user/signup", { locals, layout: userLayout });
  } catch (error) {
    console.error(error);
  }
});

router.get("/usuario", (req, resp) => {
  try {
    const locals = {
      title: "Ingreso | Articulos UTL",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };
    resp.render("user/index", { locals, layout: userLayout  });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
