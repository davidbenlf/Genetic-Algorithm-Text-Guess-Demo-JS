let target = ""
let POPULATION_SIZE = 200
let MUTATION_RATE = 10
const MATTING_POOL_SIZE = Math.floor(POPULATION_SIZE / 5)
const charOptions = ['a', 'à', 'á', 'ã', 'â', 'b', 'c', 'ç', 'd', 'e', 'é', 'ê', 'f', 'g', 'h', 'i', 'í', 'ì', 'j', 'k', 'l', 'm', 'n', 'o', 'ô', 'ó', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'û', 'ù', 'v', 'w', 'x', 'y', 'z', ' ',
                     'A', 'À', 'Á', 'Ã', 'Â', 'B', 'C', 'Ç', 'D', 'E', 'É', 'Ê', 'F', 'G', 'H', 'I', 'Í', 'ì', 'J', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ó', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ú', 'Û', 'Ù', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                     ',', '.']
let population = []
let continueLoop = false
let best_text = document.querySelector('h1#best_text')

function getRandomInt(min, max){
    return Math.abs(Math.floor(Math.random() * (max - min) + min))
}
function getRandomDouble(min, max){
    return Math.abs(Math.random() * (max - min) + min)
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, Math.abs(ms)));
}  
/////////////////////////////////////
//start()
async function start(){
    target = document.querySelector('input#target').value.replace(/\s+/g, ' ')
    POPULATION_SIZE = document.querySelector("input#initial_population").value
    MUTATION_RATE = document.querySelector("input#mutation_rate").value
    population = []

    for(let i = 0; i < POPULATION_SIZE; i++){
        const choromossome = generateGene()
        population.push({string: choromossome})
    }
    continueLoop = false
    continueLoop = true
    await mainLoop()
}

async function mainLoop(){
    let best_fitness = 0
    let generation = 1
    best_text.classList.add("not_find");
    best_text.classList.remove("find");

    while(continueLoop = true){
        // break
        //loop
        population.forEach(element => {
            element.fitness = fitnessFunction(element)
        });
        population.sort((a, b) => {return a.fitness - b.fitness})
        population = population.filter((chromossome) => chromossome.fitness > 0)
        for(let i = 0; i < population.length; i++)
            population[i].prob = (i + 1) / population.length
        population.sort((a, b) => {return b.fitness - a.fitness})
        const newGeneration = mattingPool(population)
        for(let i = 0; i < population.length; i++){
            const parentA = newGeneration[getRandomInt(0, newGeneration.length)]
            const parentB = newGeneration[getRandomInt(0, newGeneration.length)]
            const child = crossover(parentA, parentB)
            population[i] = child
        }
        population.forEach(element => {
            mutation(element)
            element.fitness = fitnessFunction(element)
        });
        
        population.sort((a, b) => {return b.fitness - a.fitness})
        best_fitness = population[0].fitness
        generation++

        best_text = document.querySelector('h1#best_text')
        best_text.innerHTML = population[0].string
        document.querySelector('span#best_fitness').innerHTML = "Best fitness: " + best_fitness
        document.querySelector('h3#generation').innerHTML = "Generation: " + generation
        await sleep(100)
        //console.log("Geração: " + generation)
        if(best_fitness >= 1){
            console.log("ACABOU!")
            best_text.classList.remove("not_find");
            best_text.classList.add("find");
            continueLoop = false
            break
        }
    }
}

function generateGene(){
    let newString = ''
    for(let i = 0; i < target.length; i++){
        newString += charOptions[getRandomInt(0, charOptions.length)]
    }
    return newString
}

function fitnessFunction(chromossome){
    let score = 0
    for(let i = 0; i < target.length; i++){
        if( chromossome.string[i] === target[i] ){
            score++
        }
    }
    score = Math.pow(score / target.length, 2) + 0.01
    return score
}

function mutation(chromossome){

    const rate = getRandomDouble(1, 100)
    if(MUTATION_RATE >= rate){
        let newString = []
        //console.log("MUTAÇÃO")
        //console.log("antes:  " + chromossome.string)
        const randomPosition = getRandomInt(0, chromossome.string.length)
        const crossingPointMin = getRandomInt(0, target.length - 2)
        const crossingPointMax = getRandomInt(crossingPointMin, target.length)
        //console.log("ponto de corte: " + crossingPointMin + " - " + crossingPointMax)
        for(let i = 0; i < target.length; i++){
            newString.push("x")
        }
        for(let i = 0; i < target.length; i++){
            if(i >= crossingPointMin && i < crossingPointMax){
                const randomChar = charOptions[getRandomInt(0, charOptions.length)]
                newString[i] = randomChar
                //console.log(`position: ${i} \nnew: ${newString[i]} \nchar: ${randomChar}`)
            }
            else{
                newString[i] = chromossome.string[i]
                //console.log(`position: ${i} \nnew: ${newString[i]} \nchromo: ${chromossome.string[i]}`)
            }
        }
        chromossome.string = newString.join('')
        //console.log("depois: " + chromossome.string)
    }
}

function mattingPool(pop){
    const newGen = []
    let indexSearch = 0
    while(newGen.length < MATTING_POOL_SIZE){

        // const rate = getRandomDouble(1, 100)
        // const diference = pop.length - indexSearch
        // if((MUTATION_RATE / 10) >= rate)
        //     indexSearch += getRandomInt(0, diference - 1)

        const random = Math.random()
        if(random < pop[indexSearch].prob)
            newGen.push(pop[indexSearch])
        indexSearch++
        if(indexSearch > pop.length)
            indexSearch = 0
    }
    return newGen
}


function crossover(parentA, parentB){
    let childA = {string: ''}
    const crossingPointMin = getRandomInt(0, target.length / 2)
    const crossingPointMax = getRandomInt(crossingPointMin, target.length)
    // console.log(`Cross point: ${crossingPointMin} - ${crossingPointMax}`)
    // console.log("parent A: " + parentA.string)
    // console.log("parent B: " + parentB.string)
    for(let i = 0; i < target.length; i++){
        if(i >= crossingPointMin && i < crossingPointMax){
            childA.string += parentA.string[i]
        }
        else{
            childA.string += parentB.string[i]
        }
    }
    mutation(childA)
    //console.log(childA.string)
    // console.log("child A: " + childA)
    // console.log("child B: " + childB)
    return childA
}