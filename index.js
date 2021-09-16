import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.use(express.static("public"));
app.use(express.json())

const getImages = async (url) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const imageUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img"), (img) => img.src)
    );
    await browser.close();
    return imageUrls;
  } catch (e) {
    console.log(e.message);
  }
};


app.get("/api", async (req, res) => {
  const {url} = req.query;
  if(!url) return res.status(400).send()
  const images = await getImages(url);
  console.log(images);
  if(images == undefined || images.length < 1)  return res.status(404).send()
  res.status(200).send({images})
});


app.listen(3000, () => {
  console.log("App is running ");
});
