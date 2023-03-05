import "./mynav.js";

const navBar = document.createElement("my-nav");
document.querySelector("main").insertBefore(navBar,document.querySelector("#prenav"));
if(window.location.pathname == '/documentation.html')
{
    navBar.setActivepage(2);
}
else if(window.location.pathname == '/home.html')
{
    navBar.setActivepage(0);
}
