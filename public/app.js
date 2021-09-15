const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch(`/api?url=${ form.url.value.trim() }`);
  console.log( await res.json());
});
