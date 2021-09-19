import * as cheerio from "cheerio";
import axios from "axios";

function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return pattern.test(str);
}

Set.prototype.getByIndex = function (index) {
  return [...this][index];
};

export const getImages = async (url, io) => {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  io.sockets.emit("logs", {
    log: `Loading ...`,
  });

  let rooturl = url;
  let pages = new Set();
  pages.add(url);
  let images = new Set();
  let iteration = 0;

  try {
    let data = await scrape(url);
    return Array.from(data);
  } catch (e) {
    if (pages[iteration]) {
      iteration++;
      pages[iteration];
    }
  }

  async function scrape(url) {
    try {
      const { data } = await axios.get(url);
      let $ = cheerio.load(data);
      io.sockets.emit("logs", {
        log: `Fetching Images from --> ${url}`,
      });
      // ? Getting all urls in Page
      $("a").each((index, item) => {
        if (!item.attribs.href) {
          return;
        }

        if (item.attribs.href.startsWith(rooturl)) {
          return pages.add(item.attribs.href);
        } else if (item.attribs.href.startsWith("/")) {
          return pages.add(rooturl + item.attribs.href);
        } else if (!item.attribs.href.startsWith("/")) {
          return pages.add(rooturl + "/" + item.attribs.href);
        }
      });

      // ? Getting all images from Page

      $("img").each((index, image) => {
        var src = $(image).attr("src");
        if (src.startsWith(rooturl)) {
          return images.add(rooturl + src);
        } else if (src.startsWith("/")) {
          return images.add(rooturl + src);
        } else if (!src.startsWith("/")) {
          return images.add(rooturl + "/" + src);
        }
        images.add(src);
      });

      iteration++;
      if (pages.getByIndex(iteration)) {
        return scrape(pages.getByIndex(iteration));
      } else {
        //* IF Everything Goes well !!
        return images;
      }
    } catch (error) {
      io.sockets.emit("logs", {
        err: `Something went wrong in  --> ${error.message}`,
      });
      iteration++;
      if (pages.getByIndex(iteration)) {
        return scrape(pages.getByIndex(iteration));
      } else {
        return images;
      }
    }
  }
};
