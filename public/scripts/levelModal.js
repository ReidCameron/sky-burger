import game from './game.js'
import Constant from './constants.js'

let init = (levelData) =>{

    let objectives = levelData.objectives.reverse();
    jQuery(()=>{
        // Set Order Number and name
        $("#order-number-label").text(`order #${levelData.orderNum}`)
        $("#order-name-label").text(`"${levelData.levelName}"`)

        //Configure Topping Items and Labels
        $("#burger-grid").empty();
        let gta = '"Topbun ."' //grid-template-areas temp variable
        $("#burger-grid").append(
            $("<div/>")
            .addClass(`preview-topping Topbun`)
            .css("grid-area", "Topbun")
            .css("z-index",`${objectives.length + 1}`)
        )
        const offset = 20; //offset to overlay/stagger the toppings
        let i;
        for(i = 0; i < objectives.length; i++){
            //create dom element for topping
            $("#burger-grid").append(
                $("<div/>")
                .addClass(`preview-topping ${objectives[i].name}`)
                .css("grid-area", objectives[i].name)
                .css("translate", `0 -${(i+1)*offset}px`)
                .css("z-index",`${objectives.length - i}`)
                // .text(objectives[i].name.substring(0,3))
            )
            
            //create dom element for topping count
            $("#burger-grid").append(
                $("<div/>")
                .addClass(`preview-topping-count`)
                .css("grid-area" , `${objectives[i].name}-ct`)
                .css("translate", `0 -${(i+1)*offset}px`)
                .text("x" + objectives[i].count)
            )

            //set template areas string
            gta += `"${objectives[i].name} ${objectives[i].name}-ct"`
        }

        $("#burger-grid").append(
            $("<div/>")
            .addClass(`preview-topping Bottombun`)
            .css("grid-area", "Bun")
            .css("translate", `0 -${(i+1)*offset}px`)
        )

        //set template areas
        $("#burger-grid").css("grid-template-areas", gta + '"Bun ."')

        //init position and visibility
        $("#levelModal").css("left", "100%")
        $("#levelModal").show(0)

        //slide in (delayed)
        let delay = Constant.animationDelay/3 //in ms
        $("#levelModal").animate({left: "100%"}, delay, ()=>{
            $("#levelModal").animate({left: "0%"}, Constant.animationDelay)
        })

        //slide out and start game
        $("#continue-btn").on("click", ()=>{
            $("#continue-btn").off("click")
            $("#levelModal").animate({left: "100%"}, Constant.animationDelay, ()=>{
                $("#levelModal").hide(0, ()=>{
                    game.start()
                })
            })
        })
    })
}

export default { init }
