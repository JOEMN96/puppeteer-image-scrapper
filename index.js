import express from "express";
import dotenv from "dotenv";

import { getImages } from "./scrapper.js";

dotenv.config();

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/api", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send();
  const images = await getImages(url);
  if (images == undefined || images.length < 1) return res.status(404).send();
  res.status(200).send({ images });
});

app.listen(process.env.PORT || 2000, () => {
  console.log("App is running ");
});
