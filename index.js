import express from "express";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import * as cheerio from "cheerio";
import axios from "axios";
import request from "request";

dotenv.config();

const app = express();

app.use(express.static("public"));
app.use(express.json());

// const getImages = async (url) => {
//   // const {data} = await  axios.get(url)
//   if(url.endsWith('/')) {
//     url = url.slice(0, -1)
//   }
//   console.log("Loading");
//   let rooturl = url
//   let pages = []
//   let images =[]
//   let iteration = 0

//   async function scrape (url)  {
//     request(url, (err, resp, html)=>{

//       console.log(err);

//     if(!err && resp.statusCode == 200){

//       let $ = cheerio.load(html)
//       $('a').each((index,item) => {

//         if(!item.attribs.href) {
//           return
//         }

//         if(item.attribs.href.startsWith(rooturl)) {
//           if(!images.includes(item.attribs.href)) {
//               images.push(item.attribs.href)
//           }
//         } else if  (item.attribs.href.startsWith('/')) {
//           images.push(rooturl+ item.attribs.href)
//         }
//       })
//         // console.log(images);

//         $("img").each((index, image)=>{
//           var img = $(image).attr('src');
//           var Links = img;
//           images.push(Links);
//         });
//         iteration ++
//         console.log(iteration);
//         if(pages[iteration]) {
//           scrape(pages[iteration])
//         } else {
//           console.log('fired');
//           return images
//         }
//         // console.log(iteration);
//       }
//     })
//   }
//  scrape(url)

// }

Set.prototype.getByIndex = function (index) {
  return [...this][index];
};

const getImages = async (url) => {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  console.log("Loading");
  let rooturl = url;
  let pages = new Set();
  pages.add(url);
  let images = [];
  let iteration = 0;

  try {
    const val = await scrape(url);
  } catch (e) {
    console.log(e.message);
    if (pages[iteration]) {
      iteration++;
      pages[iteration];
    }
  }

  async function scrape(url) {
    try {
      const { data } = await axios.get(url);
      let $ = cheerio.load(data);
      $("a").each((index, item) => {
        if (!item.attribs.href) {
          return;
        }

        if (item.attribs.href.startsWith(rooturl)) {
          return pages.add(item.attribs.href);
        } else if (item.attribs.href.startsWith("/")) {
          return pages.add(rooturl + item.attribs.href);
        }
      });

      $("img").each((index, image) => {
        var img = $(image).attr("src");
        images.push(img);
      });

      console.log(images);

      iteration++;
      if (pages.getByIndex(iteration)) {
        scrape(pages.getByIndex(iteration));
      } else {
        console.log("Done");
        return images;
      }
    } catch (error) {
      console.log(error.message);
      iteration++;
      if (pages.getByIndex(iteration)) {
        scrape(pages.getByIndex(iteration));
      } else {
        console.log(iteration);
        console.log("From CAtch block scrape");
        return images;
      }
    }
  }
};

await getImages("https://www.blockonomics.co/");

// app.get("/api", async (req, res) => {
//   const {url} = req.query;
//   if(!url) return res.status(400).send()
//   const images = await getImages(url);
//   console.log(images);
//   if(images == undefined || images.length < 1)  return res.status(404).send()
//   res.status(200).send({images})
// });

// app.listen(process.env.PORT || 2000, () => {
//   console.log("App is running ");
// });

// try {
//   const browser = await puppeteer.launch({ headless: true,args: ['--no-sandbox'] });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: "networkidle0" });
//   const imageUrls = await page.evaluate(() =>
//     Array.from(document.querySelectorAll("img"), (img) => img.src)
//   );
//   await browser.close();
//   return imageUrls;
// } catch (e) {
//   console.log(e.message);
// }
