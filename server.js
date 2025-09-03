const express = require("express");
const es6Renderer = require("express-es6-template-engine");
const axios = require("axios");
const moment = require("moment");
const md5 = require("md5");
const cors = require("cors");
const path = require("path");

const dotenv = require("dotenv");
// dotenv.config();
dotenv.config({
    path: './.env',
});

const { readFileSync } = require("node:fs");

const packageJson = JSON.parse(readFileSync("./package.json"));

const apiVersion = packageJson.version;

const app = express();
app.engine("html", es6Renderer);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(express.json());
const corsOptions = {
    // origin: ["http://localhost:8383"],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "25mb" }));

app.get("/", async (req, res) => {
    // If here, we're going to generate html and return it (after storing in the cache)
    const compile = es6Renderer(
        __dirname + "/views/template.html",
        {
            locals: {
                title: "Website Optimisation Examples",
            },
            partials: {
                partial: __dirname + "/views/index.html",
            },
        },
        (err, content) => err || content,
    );
    try {
        const htmlView = await new Promise((resolve, reject) => {
            compile
                .then((htmlView) => {
                    resolve(htmlView);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
        res.send(htmlView);
    } catch (e) {
        res.send(e);
    }
});

app.get("/api/ping", (req, res) => {
    res.status(200);
    res.json({
        version: `${apiVersion}`,
    });
});

app.use(express.static("public", { etag: false, lastModified: false }));

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = app;