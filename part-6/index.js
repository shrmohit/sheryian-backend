const path = require("path");
const express = require("express");
const app = express();

// setting parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/profile/:username/:age", (req, res) => {
  const username = req.params.username;
  const age = req.params.age;
  res.send(`${username} is ${age} year old`);
});

app.listen(3000, () => {
  console.log(`Server running to port ${3000}`);
});
