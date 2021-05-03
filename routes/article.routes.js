const { authJwt } = require("../middleware");
const controller = require("../controllers/article.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/articles/get", controller.getArticles);

    app.get("/articles/get/:id", controller.getArticle);

    app.delete("/articles/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteArticle);

    app.post(
        "/article/add",
        [authJwt.verifyToken],
        controller.postArticle
    );
}

