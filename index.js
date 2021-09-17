import express from "express";
import puppeteer from "puppeteer";
import dotenv from "dotenv"
import * as cheerio from 'cheerio';
import axios from 'axios'
import request from "request"

dotenv.config()

const app = express();

app.use(express.static("public"));
app.use(express.json())





const getImages = async (url) => {
  // const {data} = await  axios.get(url)
  if(url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  console.log("Loading");

  let pages = []
  let images =[]

  function scrape (url)  {
    request(url, (err, resp, html)=>{

      if(!err && resp.statusCode == 200){

        if(images.includes(url)) {
          return scrape()
        }

        let $ = cheerio.load(html)

        let atags = $('a').each((index,item) => {
          if(item.attribs.href == "" ) {
            return
          } else if (item.attribs.href.startsWith('/')) {
            pages.push(url+item.attribs.href)
          }
        })

        $("img").each((index, image)=>{
          var img = $(image).attr('src');
          var Links = url + img;
          images.push(Links);
        });
        console.log(images);                                  
      }
    })
  }
  scrape(url)


}

await getImages('https://www.blockonomics.co/')


// app.get("/api", async (req, res) => {
//   const {url} = req.query;
//   if(!url) return res.status(400).send()
//   const images = await getImages(url);
//   if(images == undefined || images.length < 1)  return res.status(404).send()
//   res.status(200).send({images})
// });


app.listen(process.env.PORT || 2000, () => {
  console.log("App is running ");
});


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