import game from './game.js'
import Constant from './constants.js'

const States = {
    MainMenu: 'MainMenu',
    Game: 'Game',
} 
const ZHIGH = 2000
const ZLOW = 1000
let acceptActions = true;

// Career: 2,
// Settings: 3,
// Help: 4,
// SignIn: 5,
// Loading: 6,
let currentState = States.MainMenu
// setState(States.MainMenu);

jQuery(() =>{
    jQuery.easing.def = 'linear'
    //Main Menu
    $("#MM-btn-play").on("click", () =>{
        // $("#MM-btn-play").off("click")
        setState(States.Game)
    })
    // $("#MM-btn-career").on("click", () =>{
        // $("#MM-btn-career").off("click")
    //     setState(State.Career)
    // })
    // $("#MM-btn-settings").on("click", () =>{
        // $("#MM-btn-settings").off("click")
    //     setState(State.Settings)
    // })
    // $("#MM-btn-help").on("click", () =>{
        // $("#MM-btn-help").off("click")
    //     setState(State.Help)
    // })
    // $("#MM-btn-back").on("click", () =>{
        // $("#MM-btn-back").off("click")
    //     setState(State.SignIn)
    // })
})
let init = () =>{
    
}

//State Manager
let setState = (state) =>{
    if(!acceptActions) return;
    acceptActions = false;
    //Raise Z-index of current state
    $(`#${States[currentState]}`).css({"z-index" : `${ZHIGH}`})

    //Enable and Fade in Next state
    $(`#${States[state]}`)
        .css({"opacity":"0%"})
        .show(0)
        .animate({opacity: '100%'}, Constant.animationDelay/2)

    //Hide Current State and Reset Z-index after animation
    $(`#${States[currentState]}`).animate({left: "-50%"}, Constant.animationDelay/2, ()=>{
        $(`#${States[currentState]}`).animate({left: "-100%", opacity: '0%'}, Constant.animationDelay/2, ()=>{
            $(`#${States[currentState]}`)
                .hide(0)
                .css({"z-index" : `${ZLOW}`,"left": "0%", 'opacity': '100%'})
            currentState = state;//Set next state to current state
            acceptActions = true;
        })
    })
    
    //state logic
    switch(state){
        case States.MainMenu:
            break
        case States.LevelMenu:
            break
        case States.Game:
            game.init()
            break
        case States.EndGameMenu:
            break
        case States.PauseMenu:
            break
        default:
            break
    }
}

export default { States, setState }
