function toggleTheme() {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

function toggleSidebar() {
  document.body.classList.toggle("sidebar-open");
}

/** let x = document.getElementById("searchbar");
x.style.display = "none";
x.style.transition = "all 2s ease-in";
function toggleSearchBar() {
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
console.log("Theme:", localStorage.getItem(theme)) */
