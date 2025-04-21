const express = require("express");
const userModel = require("./model/user");
const postModel = require("./model/post");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/create", async (req, res) => {
  let user = await userModel.create({
    username: "mohit",
    email: "mohit@gmail.com",
    age: 22,
  });
  res.send(user);
});
app.listen(3000);
