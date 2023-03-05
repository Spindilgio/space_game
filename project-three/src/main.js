import {getMouse} from './utilities.js';
import{createImageSprites} from './helpers.js';
import Interactable from './interactable.js';
import Ship from './Ship.js';
export default init;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const screenWidth = 800;
const screenHeight = 650;

// fake enum
const GameState = Object.freeze({
    START:   		Symbol("START"),
    MAIN:  			Symbol("MAIN"),
    LEVELOVER: 	Symbol("LEVELOVER"),
    GAMEOVER: 	Symbol("GAMEOVER")
});

const MyErrors = Object.freeze({
    drawHUDswitch:  "Invalid value in drawHUD switch",
    mousedownSwitch: "Invalid value in mousedown switch",
    loadLevelSwitch: "Invalid value in loadLevel switch"
});


let gameState = GameState.START;
let imageData;
let preData;
let colorCtrl;
let sprites = [];
let obstacles = [];
let oBenchmark = 5;
let cores = [];
let cBenchmark = 10;
let score = 0;
//let coreCollect, asteroidHit, coreSpawn, asteroidSpawn;

let startTime;
let pauseStart;
let newPause = true;
let totalPause;
let nowPause = 0;
let myTime = 0;
let paused = true;
let cTime;


let ship;
let mouseX = 0;
let mouseY = 0;


let gradient;



function init(argImageData, colorControl){
	imageData = argImageData;
	colorCtrl = colorControl;
	ship = new Ship(0,0,50,50,imageData.ship, imageData.shipTwo);
	pause();
	/*coreCollect = new Howl({
		src:[],
		volume: 0.2
	});

	asteroidHit = new Howl({
		src:[],
		volume: 0.2
	});

	coreSpawn = new Howl({
		src:[],
		volume: 0.2
	});

	asteroidSpawn = new Howl({
		src:[],
		volume: 0.2
	});*/
	
														
	// hook up events
	canvas.onmousedown = doMousedown;
	
	//https://stackoverflow.com/questions/43061417/how-to-listen-for-custom-events-defined-web-component
	colorCtrl.shadowRoot.addEventListener("change", getColorData);
	getColorData();
	loop();
}

function loop(currentTime){
	// schedule a call to loop() in 1/60th of a second
	//if(paused == true)logTimes(currentTime);
	//else{console.log(newPause)};

	requestAnimationFrame(loop);
	cTime = currentTime;
	if (!startTime) startTime = currentTime;
	if(!myTime) myTime = currentTime;
	if(!nowPause) nowPause = 0;
	if(!totalPause) totalPause = 0;
	if(!pauseStart) pauseStart = currentTime;

	if(paused == true)
	{
		if(newPause==true){
			pauseStart = currentTime;
			newPause = false;
		}
		nowPause = currentTime-pauseStart;
	}
	else{
		if(newPause == false){ //this would mean the END of a new pause
			totalPause +=nowPause;
		}
		newPause = true;
	}

	//start of drawing; needed for later
	if(gameState == GameState.START)
	{
		ctx.drawImage(imageData.back, 0, 0, 800, 650, 0, 0, screenWidth, screenHeight);
	}
	ctx.globalAlpha = 1.0;

	if(paused == false && gameState == GameState.MAIN)
	{
		myTime = (currentTime-totalPause)/1000;
		ctx.fillRect(0,0,screenWidth,screenHeight);
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0,800,650);
		preData = ctx.getImageData(0,0,800,650);
		if(myTime>=180) {
			ctx.drawImage(imageData.back, 0 + ((180*80)/9), 0, 800, 650, 0,0, screenWidth, screenHeight);
			if(score >=10){
				pause(currentTime);
				canvas.style.cursor = "default";
				gameState = GameState.LEVELOVER;
			}
			else if(score<0)
			{
				pause(currentTime);
				canvas.style.cursor = "default";
				gameState = GameState.GAMEOVER;
			}
		}
		else ctx.drawImage(imageData.back, 0 + ((myTime*80)/9), 0, 800, 650, 0,0, screenWidth, screenHeight);
		
		
		if(myTime > oBenchmark){
			obstacles.push(
				new Interactable(
					840,
					(Math.random() * 250) + 250,
					20,
					20,
					imageData.asteroid,
					140 + (oBenchmark * 1.5),
					0.7));
			oBenchmark+=5;
		}

		if(myTime > cBenchmark){
			cores.push(
				new Interactable(
					840,
					(Math.random() * 250) + 250,
					30,
					30,
					imageData.core,
					70 + (cBenchmark/2),
					2.4));
			cBenchmark +=10;
		}
		

		for(let h = obstacles.length; h > 0; h--){

			obstacles[h-1].iMove();
			
			if(obstacles[h-1].outOfBounds()){
				if(obstacles.length > 13)
				{
					obstacles[h-1].delete();
					obstacles.splice(h-1,1);
					continue;
				}else{
					obstacles[h-1].reset(850,650);
				}
			}
			
			if(ship.checkCollision(obstacles[h-1].getRect()) == true)
			{
				
				if(score!=0)score--;
				obstacles[h-1].delete();
				obstacles.splice(h-1,1);
			}
		}

		for(let i = cores.length; i > 0; i--){
			cores[i-1].iMove();

			if(cores[i-1].outOfBounds()){
				cores[i-1].delete();
				cores.splice(i-1,1);
				continue;
			}

			if(ship.checkCollision(cores[i-1].getRect()) == true)
			{
				score++;
				cores[i-1].delete();
				cores.splice(i-1,1);
			}
		}

	}
	

	// draw game sprites
	if (gameState == GameState.MAIN){
		if(paused == false)
		{
			for (let s of sprites){
				s.move();
				if(s.x <= 0){
					s.reset(screenWidth + Math.random() * 50, screenHeight);
					s.move();
				}
				//"sprites" doesn't need a y-check since they move straight
				
				ctx.globalAlpha = 1.0;
				s.draw(ctx);
			} // end for

			ship.drawShip(mouseX, mouseY, ctx);

			for(let c of cores){
				c.draw(ctx);
			}

			for(let o of obstacles){
				o.draw(ctx);
			}
		}
		
		//color tinting the screen; BEFORE the UI gets added
		if(paused ==  false)
		{
			let imageData = ctx.getImageData(0, 0, 800, 650);
			let data = imageData.data;
			let length = data.length;

			for( let i = 0; i < length; i +=4) {
				if(data[i]>=10 && data[i+1] >=10 && data[i+2] >=10)
				{
					data[i+0] = ((preData.data[i+0] * (myTime*2/360)) + data[i])/(1 + (myTime*2/360));
					data[i+1] = ((preData.data[i+1] * (myTime*2/360)) + data[i+1])/(1 + (myTime*2/360));
					data[i+2] = ((preData.data[i+2] * (myTime*2/360)) + data[i+2])/(1 + (myTime*2/360));
				}
			}

			ctx.putImageData(imageData, 0, 0);
		}
		
	} // end if


	drawHUD(ctx);

} // end loop()

function drawHUD(ctx){
	ctx.save();
		switch(gameState){
			case GameState.START:
			ctx.save();

			// Draw background
			ctx.translate(screenWidth/2,screenHeight/2);
			ctx.scale(6,6);
			ctx.globalAlpha = 0.5;
			ctx.restore();
		
			// Draw Text
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			fillText(ctx,"Slipstream", screenWidth/2, screenHeight/2-100, "36pt Orbitron", "rgb(0,209,178)");

			fillText(ctx,"- Move with Mouse", screenWidth/2 - 100, screenHeight/2-30, "20pt Orbitron", "rgb(0,209,178)");

			fillText(ctx,"- Collect 10 Fuel cores", screenWidth/2 - 75, screenHeight/2 + 10, "20pt Orbitron", "rgb(0,209,178)");

			fillText(ctx,"- Click to Pause, and to start", screenWidth/2 - 33, screenHeight/2+50, "20pt Orbitron", "rgb(0,209,178)");

			break;
			
			case GameState.MAIN:
			ctx.globalAlpha = 1.0;
			ctx.strokeStyle = "white";
			ctx.strokeRect(0,0,screenWidth, 30);
			fillText(ctx,'I',-12 + ((myTime*2/316) * screenWidth) ,30,"38pt Courier", "white");

			if(paused == true){
				ctx.globalAlpha = 1;
				ctx.save();//for the pause menu
				ctx.fillStyle = 'black';
				ctx.fillRect(0, screenHeight/3, screenWidth, screenHeight/3);
				ctx.strokeStyle = 'white';
				ctx.strokeRect(0, screenHeight/3, screenWidth, screenHeight/3);
				ctx.restore();

				ctx.save();
				fillText(ctx,"PAUSED",screenWidth/2 - 90, screenHeight/2,"28pt Orbitron","white");
				fillText(ctx,"Click your Ship to resume",screenWidth/2 - 180, 70 + screenHeight/2,"22pt Orbitron","white");
				ctx.restore();

				ship.shipFinder(ctx);
			}
			

			ctx.save();
			ctx.fillStyle = 'black';
			ctx.fillRect(screenWidth - 200, screenHeight - 50, 200, 50);
			ctx.strokeStyle = 'white';
			ctx.strokeRect(screenWidth - 200, screenHeight - 50, 200, 50);
			ctx.restore();
			fillText(ctx,`Time: ${Math.trunc(myTime * 10)/10}s`, screenWidth-190, screenHeight-20, "22pt Orbitron", /*red*/"rgb(0,200,200)");

			ctx.save();
			ctx.fillStyle = 'black';
			ctx.fillRect(0, screenHeight - 50, 350, 50);
			ctx.strokeStyle = 'white';
			ctx.strokeRect(0, screenHeight - 50, 350, 50);
			ctx.restore();
			fillText(ctx,`Net warp power : ${score}`, 10, screenHeight-20, "22pt Orbitron", `rgb(${255 - ((score-5)*51)},${(score) * 51},0)`,9);
			break;
			
			case GameState.LEVELOVER:
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				fillText(ctx,`Success! Time taken: ${Math.trunc(myTime * 10)/10}`, screenWidth/2, screenHeight/2, "26pt Orbitron", "white", 2);
				fillText(ctx,`Score: ${score} of 10 needed.`, screenWidth/2, screenHeight/2 + 50, "26pt Orbitron", "white", 2);
				fillText(ctx,"Click to play again!", screenWidth/2, screenHeight/2 + 150, "12pt Orbitron", /*red*/"rgb(0,200,200)");
			break;
			
			case GameState.GAMEOVER:
			// draw game results
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			fillText(ctx,"Game Over!", screenWidth/2, screenHeight/2 - 65, "38pt Orbitron", /*red*/"rgb(0,200,200)");
			fillText(ctx,`Total Score: ${score} out of 10 needed`, screenWidth/2, screenHeight/2, "26pt Orbitron", "white");
			fillText(ctx,"Click to play again!", screenWidth/2, screenHeight/2 + 55, "20pt Orbitron", /*red*/"rgb(0,200,200)");
			break;
			
			default:
			throw new Error(MyErrors.drawHUDswitch);
		
		}
		
		ctx.restore();
		
}
	
function loadLevel(){
	score = 0;
	let margin = 50;

	let rect = {
		left: margin, 
		top: margin, 
		width: screenWidth - margin*2, 
		height: screenHeight-margin*3}
	sprites = [];
	sprites = sprites.concat(
		createImageSprites(100,1,1,imageData.star,rect)
	);
	
	startTime = performance.now();
	/*myTime = 0;
	pauseStart;
	newPause = true;
	totalPause = 0;
	nowPause = 0;
	paused = true;*/
}

	
function doMousedown(e){
	let mouse=getMouse(e);
	switch(gameState){
		case GameState.START:
			score = 0;
			gameState = GameState.MAIN;
			canvas.onmousemove = updateMousePos;
			loadLevel();
			canvas.style.cursor = "none";
			resume();
			break;
			
		case GameState.MAIN:
		if(paused == false){
			pause();
			//gameState = GameState.LEVELOVER;
			break;
		}
		if(paused == true && ship.getRect().containsPoint(mouse)){
			canvas.style.cursor = "none";
			resume();
		}
		break;
			
		case GameState.LEVELOVER:	
			gameState = GameState.START;
			myTime = 0;
			totalPause = 0;
			canvas.removeEventListener("onmousemove",canvas, false);
			canvas.removeEventListener("pause",canvas, false);
			canvas.removeEventListener("resume",canvas, false);
		break;
			
		case GameState.GAMEOVER:
			canvas.removeEventListener("onmousemove",canvas, false);
			canvas.removeEventListener("pause",canvas, false);
			canvas.removeEventListener("resume",canvas, false);
			myTime = 0;
			totalPause = 0;
			gameState = GameState.START;
		break;
			
		default:
		throw new Error(MyErrors.mousedownSwitch);
	}
}


function fillText(ctx,string, x, y, css, color) {
	ctx.save();
	ctx.font = css;
	ctx.fillStyle = color;
	ctx.fillText(string, x, y);
	ctx.restore();
}

function strokeText(ctx,string, x, y, css, color,lineWidth) {
	ctx.save();
	ctx.font = css;
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.strokeText(string, x, y);
	ctx.restore();
}

function updateMousePos(e){
	let mouse = getMouse(e);
	mouseX = mouse.x;
	mouseY = mouse.y;
	ship.shipMove(mouseX, mouseY);
}

function pause(){
	canvas.style.cursor = "default";
	if(paused == false)paused = true;
}

function resume(){
	if(paused == true){
		paused = false;
	}
	canvas.style.cursor = "none";
}

function getColorData(){
	gradient = colorCtrl.giveColorData(ctx);
}

function logTimes(){
	console.log(`StartTime: ${startTime}`);
	console.log(`CurrentTime: ${cTime}`);
	console.log(`PauseStart: ${pauseStart}`);
	console.log(`totalPause: ${totalPause}`);
	console.log(`nowPause: ${nowPause}`);
	console.log(`Paused: ${paused}`);
	console.log(`Newause: ${newPause}`);
}