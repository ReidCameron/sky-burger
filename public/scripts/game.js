import script from './script.js';
import levelModal from './levelModal.js';
import Levels from './levels.js';
import endModal from './endModal.js';
import Constants from './constants.js';
import failedModal from './failedModal.js';

// let frameCtr = 0 //frame counter
const CLOCK_DELAY = 1000;//1000 //ms
const types = ["Patty", "Cheese", "Lettuce", "Pickle", "Onion", "Tomato", "Topbun"]
const costs = [0.75, 0.60, 0.50,0.50,0.60,0.60,0.00]

let paused = false; //halts gameloop when true
let lastTime = 0 //tracker for game loop
let playerPos = {x:0,y:0}//tracks position of player finger
let setPlayerPos = (x,y) =>{playerPos.x = x;playerPos.y = y;}
let fallingToppings = [];//tracks unplaced falling toppings
let idCtr = 0;//id counter for new toppings
let toppingSize = {x: 0, y: 0}; //tracks size of toppings
let toppings = []; //tracks placed toppings
let yOffset = 0; //tracks offset for all toppings when stack gets too high
let score = 0;
let tip = 0;
let mObjs = [];
let objectives = []
let nextToppings = [];
let orderNum = 1;
let level = {};

let init = () => {
    //load level
    // objectives = JSON.parse(JSON.stringify(levels.slice(0,1)[0]));//copy level data
    level = Levels.getRandomLevel(orderNum);
    objectives = JSON.parse(JSON.stringify(level.objectives));//copy level data
    mObjs = JSON.parse(JSON.stringify(level.objectives));
    //init modals
    $("#endModal").hide();
    $("#failedModal").hide();
    levelModal.init(level);
    restart();

    // init game
    jQuery.ready(()=>{
        console.log("document ready (JQUERY)")
    })
    if(document.readyState === 'complete'){
        console.log("document ready (readystate)")
        //Set topping sizes based on phone dimensions&resolution
        const img_ratio = 371/286;
        toppingSize.x = Math.round(screen.width*0.25);
        toppingSize.y = Math.round(screen.width*0.25*(1/img_ratio));

        
    
        //add global style to html head
        $('head').append(
            `<style>
                div.topping{
                    width: ${toppingSize.x}px;
                    height: ${toppingSize.y}px;
                }
            </style>`
        )
    
        //send data to DOM labels or disable
        for(let i = 0; i < 6; i++){
            if (i < objectives.length){
                $(`#label-${i}`)
                    .text(`${objectives[i].count}`)
                $(`#img-${i}`)
                    .removeClass()
                    .addClass(`images ${objectives[i].name}`)
                    // .text(objectives[i].name.substring(0,3))
                $(`#to-${i}`).show();
            } else {
                $(`#to-${i}`).hide();
            }
        }
        //add bottom bun //TODO: may need to figure out better y positioning
        toppings.push(
            {
                type: "Bottombun",
                x: screen.width/2,
                y: Math.min(screen.height*0.90,screen.height*.90 - toppingSize.y),
                a: 0,
                tilt: 0,
                id:`tracker`
            }
        )

        //Draw bottom bun in correct spot
        $(`#${toppings[0].id}`)[0].style.top = `${toppings[0].y}px`;
        $(`#${toppings[0].id}`)[0].style.left = `${toppings[0].x}px`;
        
        //Set position of bottom bun to center
        setPlayerPos(toppings[0].x, toppings[0].y)

        //set objectives menu
        $("#objective-menu").css("top", "-12%")
    }
}
function restart(){
    //Delete all toppings to clear dom
    toppings.forEach( (v,i) => {if(i!==0) $(`#${v.id}`).remove()})

    //reset variables
    // lastTime = 0;
    paused = false;
    fallingToppings = []
    toppings = [];
    yOffset = 0;
    idCtr = 0;
    score = 0;
    tip = 0;
    $(`#subtotal-label`).text(`$${score.toFixed(2)}`)
    $(`#tip-label`).text(`${tip}% tip`)
    // mObjs = [];
    // objectives = []
}
let start = () => {
    //animate objectives
    $("#objective-menu")
        .animate({top: "0%"}, Constants.animationDelay, ()=>{
            //start game loop
            window.requestAnimationFrame(gameLoop);
        }
    );

    
}

function createTopping(){
    //randomize new topping type list (and inc counter)
    if(nextToppings.length <= 0){
        //Bag Radomizer
        nextToppings = JSON.parse(JSON.stringify(types));
        // console.log(arr);
        for(let i = nextToppings.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (nextToppings.length));
            let temp = nextToppings[i];
            nextToppings[i] = nextToppings[j];
            nextToppings[j] = temp;
        }
        // console.log(arr);
        // nextToppings.(arr);
        // console.log(nextToppings);
    }

    //create next topping
    let topping = {
        type: nextToppings.pop(),
        x: toppingSize.x/2 + Math.random()*(screen.width - toppingSize.x),
        y: -toppingSize.y - yOffset,
        a: 0,
        tilt: 0,
        id: idCtr++
    }

    //create element and add to dom
    $("#Game").append(
        $("<div/>")
        .addClass(`topping ${topping.type}`)
        .attr('id', `${topping.id}`)
        // .append(`<p>${topping.type}</p>`)
    );

    //save element ref to local array
    fallingToppings.push(topping)

    //update DOM element x position
    $(`#${topping.id}`)[0].style.left = `${topping.x}px`;
}

function deleteTopping(topping){
    //Remove Dom Element
    $(`#${topping.id}`).remove()

    //Remove topping ref
    fallingToppings.splice(fallingToppings.indexOf(topping),1);
    
}
function addTopping(topping){
    //move topping ref from falling to placed array
    toppings.push(topping);
    toppings[toppings.length - 1].y = toppings[toppings.length - 2].y - 25;
    toppings[toppings.length - 1].x = toppings[toppings.length - 2].x;

    //erase topping from falling array
    fallingToppings.splice(fallingToppings.indexOf(topping),1)
}
//Game Loop
function gameLoop(timeStamp) {
    if(timeStamp - lastTime >= CLOCK_DELAY){
        //Reset Timer Variable
        lastTime = timeStamp
        createTopping();
    }
    //Inc frame counter
    // frameCtr++; 
    //Game Logic Loop
    loop() 
    //Draw Loop
    draw() 

    //continue game loop
    if(!paused) window.requestAnimationFrame(gameLoop)
}

//Game Loop
function loop(){
    //set position of placed toppings (move toppings with bottom bun)
    const wobbleCoeff = 0.45;//between 0.0(more wobble) - 1.0(less wobble)
    const tiltCoeff = 0.20//between 0.0(less tilt) - 1.0(more tilt)
    toppings.forEach((v,i)=>{
        if(i==0){
            v.x = Math.round(playerPos.x);
        } else {
            //Topping Shift and Rotation
            //move topping {coeff}% of diff between it and prev topping 
            //values are min/max so toppings always reach steady state
            let diff = toppings[i-1].x - v.x;
            v.a = -diff*tiltCoeff;
            if(diff < -.75){
                v.x+= Math.min(Math.round(wobbleCoeff*diff),-1);
            } else if(diff > .75){
                v.x+= Math.max(Math.round(wobbleCoeff*diff),1);
            } else {
                v.x = toppings[i-1].x;
                v.a = 0;
            }
        }
        //Border Boundaries Check
        if(v.x > screen.width - toppingSize.x/2){
            v.x = screen.width - toppingSize.x/2;
        } else if (v.x < toppingSize.x/2){
            v.x = toppingSize.x/2;
        }
    })

    //falling toppings logic
    let speed = 5; //1(slowest) to 10(fastest) , 5(default) 
    let top = toppings[toppings.length-1]; //topmost topping
    let toppingAdded = false;
    fallingToppings.forEach((v,i)=>{
        //drop falling toppings
        v.y+=speed;

        //rotate tilted toppings
        const tiltVel = 5; //tilt velocity
        if(v.tilt == 1) v.a+=tiltVel
        else if(v.tilt == -1) v.a-=tiltVel
        

        //check if toppings are on top of burger
        let dy = top.y - v.y + yOffset;
        let dx = top.x - v.x;
        if(dy >= 0 &&  dy <= toppingSize.y/2){
            //tilt or place depending on closeness
            if(Math.abs(dx) < toppingSize.x*0.4){
                addTopping(v);
                toppingAdded = true;
            } else if(Math.abs(dx) < toppingSize.x*0.65){
                v.tilt = -Math.sign(dx)
            }
        }

        //check if toppings are off screen
        if(v.y > screen.height){
            deleteTopping(v);
        }
    })

    //Reset latest topping ref
    top = toppings[toppings.length-1]; 

    //move screen up if needed
    let scrollCoeff = 0.12; //0(slower) - 1.0(faster)
    let target = screen.height*0.55
    if(top.y + yOffset <= target){
        yOffset += Math.max(Math.round(scrollCoeff*(target - (top.y + yOffset))),1)
    }

    //logic if topping was added
    if(toppingAdded && top.type !== "Topbun"){
        //check objective of placed topping
        let correctTopping = false //true if topping was part of objectives
        objectives.map((v,i) =>{
            if(v.name == top.type && v.count > 0){
                $(`#label-${i}`).text(`${objectives[i].count - 1}`)
                correctTopping = true;
                return v.count--;
            } else {
                return v.count;
            }
        })
        //update score
        //TODO: Decrease tip when correct topping is missed(goes below top)
        if(correctTopping){
            score+=costs[types.indexOf(top.type)]
            tip+=1;
        } else {
            tip = (tip <= 0)? 0:tip-1;
        }
        //display score
        $(`#subtotal-label`).text(`$${score.toFixed(2)}`)
        $(`#tip-label`).text(`${tip}% tip`)
    }

    //check end condition
    if(toppings[toppings.length-1].type === "Topbun"){
        gameOver();
    }

}

function gameOver(){
    //Delete all falling toppings
    fallingToppings.forEach( (v,i) => $(`#${v.id}`).remove())
    fallingToppings = [];
    let passed = true;
    objectives.forEach( (v,i) =>{
        if(v.count > 0){
            passed = false;
        }
    })

    //stop progressing game
    paused = true;

    if(passed){
        //count toppings by type and calc price
        let m = new Map();
        mObjs.forEach( (v,i) => {
            let cost = costs[types.indexOf(v.name)];
            m.set(v.name,{count: v.count, cost: v.count*cost})
        })
        $("#objective-menu").animate({top: "-12%"}, Constants.animationDelay)
        endModal.init(
            {
                price: score,
                tip: score * tip/100,
                total: score * (1 + tip/100),
                toppings : m,
                orderName: level.levelName
            }
        );
        orderNum++;
    } else {
        $("#objective-menu").animate({top: "-12%"}, Constants.animationDelay)
        failedModal.init()
    }
    //load menu
    // script.setState(script.States.MainMenu);
}

//Draw Loop
function draw(){
    //Draw falling toppings
    fallingToppings.forEach((v,i)=>{
        $(`#${v.id}`)[0].style.top = `${v.y}px`;
        $(`#${v.id}`)[0].style.rotate = `${v.a}deg`;
    })
    //Draw placed toppings
    toppings.forEach((v,i)=>{
        $(`#${v.id}`)[0].style.top = `${v.y + yOffset}px`;
        $(`#${v.id}`)[0].style.left = `${v.x}px`;
        $(`#${v.id}`)[0].style.rotate = `${v.a}deg`;
    })
}

//player controls
window.addEventListener("touchmove", (event) =>{
    setPlayerPos(event.touches[0].pageX,event.touches[0].pageY)
})

export default { init, start };
