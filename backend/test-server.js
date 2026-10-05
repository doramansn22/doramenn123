const express = require("express");

const app = express();

app.use(express.json());

app.post("/test", (req, res) => {
  console.log("NEW TEST SERVER RECEIVED:", req.body);

  res.json({
    success: true,
    message: "NEW HomeAI server is working",
    receivedProblem: req.body.problem || null,
  });
});

app.listen(5050, "0.0.0.0", () => {
  console.log("NEW HomeAI TEST SERVER running on port 5050");
});