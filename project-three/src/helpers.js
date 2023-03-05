import ImageSprite from './ImageSprite.js';
export {loadImages};
export {createImageSprites};

function loadImages(imageSources,callback) {
		let numImages = Object.keys(imageSources).length
		let numLoadedImages = 0;
		
		// load images
		console.log("... start loading images ...");
		for(let imageName in imageSources) {
			console.log("... trying to load '" + imageName + "'"); //this is literally just getting the images
			let img = new Image();
			img.src = imageSources[imageName];
			imageSources[imageName] = img;
			img.onload = function() {
				console.log("SUCCESS: Image named '" + imageName + "' at " + this.src + " loaded!");
				if(++numLoadedImages >= numImages){
					console.log("... done loading images ...");
					callback(imageSources);
				}
			}
			img.onerror = function(){
				console.log("ERROR: image named '" + imageName + "' at " + this.src + " did not load!");
			}
		}
}

function createImageSprites(num = 10, width = 50, height = 50, image, rect = {left:0, top:0, width:300,height:300}){
	let sprites = [];
	let spd = 2500;
	for(let i=0;i<num;i++){
		let s = new ImageSprite(   Math.random() * rect.width + rect.left,//this function is for many things which appear all at once,
								   Math.random() * rect.height + rect.top,//  and are destroyed. we CAN revamp this
								   width,
								   height,
								   image,
								   spd);
		sprites.push(s);
	}

	return sprites;
}

