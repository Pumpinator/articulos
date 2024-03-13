const express = require("express");
const router = express.Router();
const article = require("../models/article");

router.get("/", async (req, resp) => {
  const locals = {
    title: "Articulos UTL",
    description: "Hecho por Quetzalcode.",
  };

  let perPage = 10;
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

router.get("/articulo/:id", async (req, resp) => {
  try {
    const locals = {
      title: "Articulos UTL",
      description: "Hecho por Quetzalcode.",
    };
    let slug = req.params.id;
    const data = await article.findById({ _id: slug });
    resp.render("article", { locals, data });
  } catch (error) {
    console.error(error);
  }
});

router.post("/buscar", async (req, resp) => {
    try {
        const locals = {
          title: "Seach",
          description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
    
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
    
        const data = await Post.find({
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
          ]
        });
    
        res.render("index", {
          data,
          locals,
          currentRoute: '/'
        });
    
      } catch (error) {
        console.log(error);
      }
});

module.exports = router;
