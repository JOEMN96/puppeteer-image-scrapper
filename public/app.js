const form = document.querySelector("form");
var socket = io();
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  poplulateDom();
  try {
    const res = await fetch(`/api?url=${form.url.value.trim()}`);
    const data = await res.json();
    poplulateDom(data.images);
  } catch (e) {
    console.log(e.message);
    poplulateDom(null);
  }
});

function poplulateDom(val) {
  const area = document.querySelector(".list");
  if (val === null) {
    return (area.innerHTML = `<p>Please Provide a website with images !<p>`);
  } else if (val == undefined) {
    return (area.innerHTML = `<div> <div class="loadersmall"></div> </div>`);
  }
  if (typeof val === "object") {
    const template = val.map((item) => {
      return `
      <div>
      <img src='${item}'> </img>
      </div>
      `;
    });
    area.innerHTML = template.join(" ");
  }
}

socket.on("message", function (msg) {
  console.log(msg);
});
