const form = document.querySelector("form");
var socket = io.connect();
let codeBlock = document.querySelector("code");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  codeBlock.innerHTML = "";

  poplulateDom();
  try {
    const res = await fetch(`/api?url=${form.url.value.trim()}`);
    const data = await res.json();
    poplulateDom(data.images);
    codeBlock.innerHTML = "";
  } catch (e) {
    poplulateDom(null);
  }
});

function poplulateDom(val) {
  const area = document.querySelector(".list");
  if (val === null) {
    codeBlock.innerHTML = "";
    return (area.innerHTML = `<p>Please Provide a website with images ! <p> `);
  } else if (val == undefined) {
    codeBlock.innerHTML = "";
    return (area.innerHTML = `<pre><code></code> </pre>`);
  }
  codeBlock.innerHTML = "";

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

const populateLogs = (val) => {
  if (val.err) {
    codeBlock.innerHTML += `<span class="red">${val.err}</span>` + "<br>";
    return (codeBlock.scrollTop = codeBlock.scrollHeight);
  }
  codeBlock.innerHTML += `<span class="green">${val.log}</span>` + "<br>";
  codeBlock.scrollTop = codeBlock.scrollHeight;
};

const soketsend = document.querySelector(".socket");
socket.on("logs", (data) => {
  populateLogs(data);
});
