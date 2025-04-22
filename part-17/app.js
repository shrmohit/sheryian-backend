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
  let user = await userModel.findOne({ email: req.user.email });
  const { content } = req.body;
  let post = await postModel.create({
    user: user._id,
    content: content,
  });

  user.posts.push(post._id);
  //hand change save through this
  await user.save();
  res.redirect("/profile");
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");

  if (post.likes.indexOf(req.user.userid) == -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  await post.save();
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
      let token = jwt.sign({ email: email }, "shhhh");
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
      res.status(200).send("you can login");
    } else res.redirect("/login");
  });
});

app.get("/logout", (req, res) => {
  // cookie ko remove karna hota hai
  res.cookie("token", "");
  res.send("you logout");
  // res.redirect("/login");
});

// middleware for protected route ke liye
function isLoggedIn(req, res, next) {
  if (req.cookies?.token === "") res.send("You must be logged in");
  else {
    let data = jwt.verify(req.cookies?.token, "shhhh");
    req.user = data;
  }
  next();
}

app.listen(3000, () => {
  console.log(`Server is running http://localhost:3000`);
});
