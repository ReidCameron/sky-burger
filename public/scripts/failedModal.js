import game from './game.js'
import Constant from './constants.js'

let init = (levelData) =>{

    jQuery(()=>{
        //init position and visibility
        $("#failedModal").css("left", "100%")
        $("#failedModal").show(0)

        //slide in (delayed)
        let delay = Constant.animationDelay/3 //in ms
        $("#failedModal").animate({left: "100%"}, delay, ()=>{
            $("#failedModal").animate({left: "0%"}, Constant.animationDelay)
        })

        //slide out and start game
        $("#failedModal").on("click", ()=>{
            $("#failedModal").off("click")
            $("#failedModal").animate({left: "100%"}, Constant.animationDelay, ()=>{
                $("#failedModal").hide(0, ()=>{
                    game.init()
                })
            })
        })
    })
}

export default { init }
