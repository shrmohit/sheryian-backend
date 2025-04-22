const express = require("express");
const app = express();
const userModel = require("./model/user");
const postModel = require("./model/post");
const cookiesParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(cookiesParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  console.log(user);

  res.render("profile", { user });
});

app.post("/post", isLoggedIn, async (req, res) => {
  // niche wali line btati hai ki kon sa user login hai
  let user = await userModel.findOne({ email: req.user.email });
  let { content } = req.body;
  let post = await postModel.create({
    user: user._id,
    content: content,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");

  res.render("edit", { post });
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content }
  );
  res.redirect("/profile");
});

app.post("/register", async (req, res) => {
  let { username, name, email, password, age } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("User already registered");

  bcrypt.genSalt(10, (err, Salt) => {
    bcrypt.hash(password, Salt, async (err, hash) => {
      let userCreated = await userModel.create({
        username,
        name,
        email,
        password: hash,
        age,
      });
      let token = jwt.sign({ email: email, userid: userCreated._id }, "shhhh");
      res.cookie("token", token);
      res.send("registered");
    });
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  // it is use to find user already exist or not
  let user = await userModel.findOne({ email });
  if (!user) return res.status(400).send("Something went to wrong");

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email: email }, "shhhh");
      res.cookie("token", token);
      res.status(200).redirect("/profile");
    } else res.redirect("/login");
  });
});

app.get("/logout", (req, res) => {
  // cookie ko remove karna hota hai
  res.cookie("token", "");
  res.redirect("/login");
  // res.redirect("/login");
});

// middleware for protected route ke liye
function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") return res.redirect("/login");

  try {
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

app.listen(3000, () => {
  console.log(`Server is running http://localhost:3000`);
});
