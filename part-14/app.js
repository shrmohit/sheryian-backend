const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.cookie("name", "monitor");
  res.send("done ");
});

app.listen(3000, () => {
  console.log(`Server running http://localhost:3000`);
});
