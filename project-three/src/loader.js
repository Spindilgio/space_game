import init from './main.js';
import {loadImages} from './helpers.js';
import "./mynav.js";
import "./mysound.js";
import "./mycolor.js";
//     ^^^^^     I think I have to put this in main? Or can I just pass it in?

const imageSources = {
	ship: 'images/ship.png',
	shipTwo: 'images/ship-not.png',
	star: 'images/star.png',
	asteroid: 'images/hit.png',
	core: 'images/fuel_core.png',
	back: 'images/scroll-bckgrnd.png'
};


const navBar = document.createElement("my-nav");
document.querySelector("main").insertBefore(navBar,document.querySelector("canvas"));
navBar.setActivepage(1);

const soundControl = document.createElement("my-sound");
document.querySelector("#columns").appendChild(soundControl);

const colorControl = document.createElement("my-color");
document.querySelector("#columns").appendChild(colorControl);

loadImages(imageSources,startGame);
//init();

function startGame(imageData){
	init(imageData, colorControl);
}

