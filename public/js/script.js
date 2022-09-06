let fetchButton;

document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("lolShare JS imported successfully!");
    fetchButton = document.querySelector("#fetchButton");
    fetchButton.onClick;
  },
  false
);

async function fetchMemes() {
  const memesResponse = await fetch(
    "https://api.reddit.com/r/dankmemes/top/?limit=10"
  );
  const memes = await memesResponse.json();
  console.log(memes);
}
