const express = require("express");
const router = express.Router();
const article = require("../models/articleModel");

router.get("/", async (req, resp) => {
  const locals = {
    title: "Articulos UTL",
    description: "Hecho por Quetzalcode.",
  };

  let perPage = 6;
  let page = req.query.pagina || 1;

  const data = await article
    .aggregate([{ $sort: { createdAt: -1 } }])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

  const count = await article.countDocuments({});
  const nextPage = parseInt(page) + 1;
  const hasNextPage = nextPage <= Math.ceil(count / perPage);

  resp.render("index", {
    locals,
    data,
    current: page,
    nextPage: hasNextPage ? nextPage : null,
    currentRoute: "/",
  });
});

module.exports = router;
