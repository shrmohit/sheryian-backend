const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  let { username, email, password, age } = req.body;
  //password hid
  bcrypt.genSalt(10, (err, Salt) => {
    bcrypt.hash(password, Salt, async (err, hash) => {
      console.log(hash);
      let userCreate = await userModel.create({
        username,
        email,
        password: hash,
        age,
      });

      //display on screen
      const token = jwt.sign({ email }, "shhhhh");
      res.cookie("token", token);

      res.send(userCreate);
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.send("Something went wrong");
  console.log(user.password, req.body.password);
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    console.log(result);
  });
});

app.get("/logout", (req, res) => {
  console.log(token);
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
