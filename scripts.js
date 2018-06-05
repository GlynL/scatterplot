document.addEventListener("DOMContentLoaded", () => setup());

function setup() {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then(res => res.json())
    .then(myJson => scatterplot(myJson));
}

function scatterplot(data) {
  console.log(data);
}
