import game from './game.js'
import Constant from './constants.js'

let init = (results) =>{
    jQuery(()=>{
        //init position and visibility
        $("#endModal").css("left", "100%")
        $("#endModal").show(0)

        //slide in (delayed)
        let delay = Constant.animationDelay/3 //in ms
        $("#endModal").animate({left: "100%"}, delay, ()=>{
            $("#endModal").animate({left: "0%"}, Constant.animationDelay)
        })

        //Fill in money labels
        $("#burger-price-title").text(`$${(results.price).toFixed(2)} ${results.orderName}`)
        $("#order-tip-label").text(`$${(results.tip).toFixed(2)}`)
        $("#order-total-label").text(`$${(results.total).toFixed(2)}`)


        //Fill in topping labels
        //format - $00.00 - 00 x Lettuce
        let m = new Map(results.toppings)
        let idx = 0;
        m.forEach( (v,k) =>{
            $(`#pb-${idx++}`).text(`$${(v.cost).toFixed(2)} - ${v.count} x ${k}`);
        })
        for(let i = m.size; i < 6; i++){
            $(`#pb-${i}`).text("")
        }

        //slide out and start game
        $("#continue-btn-end").on("click", ()=>{
            $("#continue-btn-end").off("click")
            $("#endModal").animate({left: "100%"}, Constant.animationDelay, ()=>{
                $("#endModal").hide(0, ()=>{
                    game.init()
                })
            })
        })
    })
}

export default { init }
