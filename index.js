const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    console.log(files);
    res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  // writeFile(path,data,function(err))
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    (err) => {
      res.redirect("/");
    }
  );
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    res.render("show");
  });
});

// app.post("/edit", (req, res) => {
//   fs.rename(
//     `./files/${req.body.title.split(" ").join("")}.txt`,
//     req.body.details,
//     (err) => {
//       res.redirect("/");
//     }
//   );
// });

app.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
