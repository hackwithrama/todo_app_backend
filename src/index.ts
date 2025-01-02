import express from "express";
import authRouter from "./routes/auth";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.get("/", (req, res, next) => {
  res.send("Hello world!, this is docker");
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
