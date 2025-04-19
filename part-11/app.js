const express = require("express");
const app = express();

const userModel = require("./usermodel");
// ise usermodel ke based par ham crud operation apply kar sakte hain

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// create user
app.get("/create", async (req, res) => {
  // below code is asynchronous code hai to ise syncornous kaene ke liye async await ka use karna padega
  let createduser = await userModel.create({
    name: "harsh",
    username: "harsh",
    email: "mohit@gmail.com",
  });
  res.send(createduser);
  console.log(createduser);
});

//read
app.get("/read", async (req, res) => {
  let readuser = await userModel.find({}); // find() give array of objects ,findOne() give single object
  console.log(readuser);
  res.send(readuser);
});

//update
app.get("/update", async (req, res) => {
  // userModel.findOneAndUpdate(findOne,update,{new:true})
  let updateuser = await userModel.findOneAndUpdate(
    { username: "harsh" },
    { name: " harsh vandana" },
    { new: true }
  );

  console.log(updateuser);
  res.send(updateuser);
});

// delete
app.get("/delete", async (req, res) => {
  let deleteuser = await userModel.findOneAndDelete({ username: "harsh" });
  console.log(deleteuser);
  res.send(deleteuser);
});

app.listen(3000, () => {
  console.log(`Server running at port http://localhost:3000`);
});
