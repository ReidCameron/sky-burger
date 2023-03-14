import Constants from './constants.js';
const types = ["Patty", "Cheese", "Lettuce", "Pickle", "Onion", "Tomato", "Topbun"]

const levels = [
    { name: "Cruncher", objectives: [1,0,3,0,3,0] },
    { name: "Canadian", objectives: [2,2,1,0,1,0] },
    { name: "Tomaintno", objectives: [2,1,1,1,1,0] },
    { name: "Buttercrunch", objectives: [1,1,4,0,0,0] },
    { name: "Extra Lettuce", objectives: [1,0,2,1,1,1] },
    { name: "Green Machine", objectives: [0,0,3,3,0,0] },
    { name: "Salad Burger", objectives: [0,0,3,0,1,2] },
    { name: "Kyperger", objectives: [2,2,0,2,0,0] },
    { name: "Extra Pickles", objectives: [1,1,1,2,1,0] },
    { name: "Extra Onion", objectives: [1,1,1,1,2,0] },
    { name: "Veg n Out", objectives: [0,0,2,1,1,2] },
    { name: "Salsaburger", objectives: [2,0,0,0,2,2] },
    { name: "BLOOP", objectives: [2,0,1,1,2,0] },
    { name: "Big Cheese", objectives: [2,3,1,0,0,0] },
    { name: "Stiff Upper Lip", objectives: [2,1,1,1,0,1] },
    { name: "Chumburger", objectives: [3,1,0,0,0,3] },
    { name: "Danwich", objectives: [2,2,1,0,0,1] },
    { name: "Awfulburger", objectives: [1,2,0,2,1,0] },
    { name: "Pickles Please", objectives: [4,2,0,1,0,0] },
    { name: "Extra Tomato", objectives: [1,1,1,0,1,2] },
    { name: "Conestopper", objectives: [2,0,0,0,2,2] },
    { name: "Behemoth", objectives: [2,1,1,1,1,1] },
    { name: "Mad Cow", objectives: [3,1,0,0,1,1] },
    { name: "Prizeburger", objectives: [1,3,0,0,1,1] },
    { name: "Crybaby", objectives: [2,0,1,0,3,0] },
    { name: "Arcade", objectives: [2,2,2,0,0,0] },
    { name: "Wailer", objectives: [1,2,2,0,0,2] },
    { name: "Red Baron", objectives: [1,3,0,0,0,3] },
    { name: "TOPPL", objectives: [0,0,1,2,1,1] },
    { name: "PLOT", objectives: [3,0,1,1,1,1] },
    { name: "Bumblebee", objectives: [3,3,0,0,0,0] },
    { name: "Le Fromage", objectives: [2,3,0,0,1,0] },
    { name: "Titanic", objectives: [1,0,2,0,0,0] },
    { name: "Pick-less", objectives: [2,1,1,0,1,1] },
    { name: "Meat Ship", objectives: [4,0,1,0,0,1] },
    { name: "Brineburger", objectives: [1,1,0,3,0,1] },
    { name: "Extra Cheese", objectives: [1,2,1,1,0,1] },
    { name: "Maxburger", objectives: [2,2,2,2,2,2] },
]

let getRandomLevel = orderNum => {
    if(orderNum <= 0 || typeof(orderNum) != typeof(0)) {
        throw RangeError("The input to getRandomLevel() is either NaN or non positive.")
    }
    let lvlIdx = Math.round(Math.random()*(levels.length-1))
    let objectives = levels[lvlIdx].objectives.map( (v, i) =>{
        if(v > 0){
            return {
                name: Constants.types[i],
                count: v * orderNum
            }
        }
    }).filter( v => { return v != undefined});
    return {levelName: levels[lvlIdx].name, objectives: objectives, orderNum: orderNum}
}

// { name: "name", objectives: [0,0,0,0,0,0] }, //Template

export default {levels, getRandomLevel}
