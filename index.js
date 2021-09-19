import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";

import { getImages } from "./scrapper.js";

dotenv.config();

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/api", async (req, res) => {
  let io = req.app.get("socketio");
  const { url } = req.query;
  if (!url) return res.status(400).send();
  const images = await getImages(url, io);
  if (images == undefined || images.length < 1) return res.status(404).send();
  res.status(200).send({ images });
});

const server = app.listen(process.env.PORT || 2000, () => {
  console.log("App is running ");
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected @", socket.id);
});

app.set("socketio", io);
