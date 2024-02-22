# Genetic Algorithm Text Guess Demo JS
Genetic Algorithm to guess a text provided by the user 🌱🖥

A seguinte demo utiliza dos fundamentos do algorithm genético para fazer com que o computador descubra um texto escrito pelo usuário.<p>
Esse tipo de algoritmo se baseia nas ideias evolucionistas de Darwin para simular a evolução natural de uma espécie (no caso de PC, dados) e tem como objetivo buscar possíveis soluções para problemas complexos.<p>
O algoritmo começa gerando uma população de indivíduos com características (genes, que no meu caso é cada letrinha do texto) aleatórias, depois analisa a aptidão deles (o quão próximo está do texto), extingue os não-inaptos e seleciona (utilizei o método de ranking) os melhores para a reprodução (crossover). Na reprodução, são selecionados 2 indivíduos que, aleatoriamente, tem seus genes combinados para gerar um "filhote" e repovoar a população com uma nova geração. Fica nesse ciclo até encontrar um indivíduo com a aptidão de 100% (que é a solução/texto digitado pelo usuário).

![screen](https://github.com/davidbenlf/Genetic-Algorithm-Text-Guess-Demo-JS/assets/120199611/77e0ce84-c1a3-4893-a7bf-47891d8d10e1)<p>
Agradeço a minha amiga designer <a target="_blank" href="https://www.instagram.com/anys.drafts/">@anys.drafts</a> que escolheu a paleta de cores <3

# População Inicial
A população inicial é feita pegando o tamanho do texto orignal e gerando N individuos/cromossomos (textos) com o mesmo comprimento, preenchendo cada espaço com letras e simbolos aleatórios. O tamanho da população, por padrão, é 200, mas esse valor pode ser alterado pelo usuário.

# Fitness Function
A aptidão de cada indivíduo é calculada pela função <b>fitnessFunction()</b> que recebe como argumento o indivíduo. Ela compara a letra/simbolo de cada gene com o texto original. A cada letra letra certa na posição certa, é incrementado em 1 a variável <b>score</b>. No final, <b>score</b> é dividido pelo tamanho do texto original * vezes ele mesmo para exponenciar + 0.01 para evitar de uma fitness ser igual a 0. O valor é salvo na propriedade <b>fitness</b> de cada cromossomo.
```javascript
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
```

# Seleção dos melhores
Depois de calcular a fitness de cada indivíduo, a população é ordenada do menor fitness para o melhor e depois calculada a probalidade para aquele cromossomo ser escolhida pela equação:<p>
```javascript
for(let i = 0; i < population.length; i++)
    population[i].prob = (i + 1) / population.length
```
O valor é salvo na propriedade <b>prob</b>. Depois a população é ordenada novamente porém dessa vez de maneira decrescente.<p>
Roda então a função <b>mattingPool()</b> que recebe como argumento a população no qual seleciona de maneira aleatória os cromossomos, porém aqueles que estão no topo obviamente terão uma chance melhor de serem escolhidos. É feito isso e não apenas um elitismo para manter a diversidade de dados.<p>
A seleção é feita da seguinte maneira:<p>
```javascript
function mattingPool(pop){
    const newGen = [] // array com os escolhidos
    let indexSearch = 0 // início de quando começar a procurar
    while(newGen.length < MATTING_POOL_SIZE){ // MATTING_POOL_SIZE = Math.floor(POPULATION_SIZE / 5).
        const random = Math.random() 
        if(random < pop[indexSearch].prob)
        // quando random for menor que a probalidade do indivíduo, aquele indíviduo vai ser escolhido.
        // Os indivíduos no topo vão ter uma probalidade BEM maior,
        // porém ainda será possível do random acabar ser um número maior (mesmo que pequena)
            newGen.push(pop[indexSearch])
        indexSearch++ // incrementar indexSearch para procurar na próxima posição
        if(indexSearch > pop.length) // evitar que o index se torne maior que o tamanho da array origal de população
            indexSearch = 0
    }
    return newGen
}
```
Tendo uma array com os melhores, a seleção dos pais é feita selecionando aleatoriamente um index dessa array
```javascript
const parentA = newGeneration[getRandomInt(0, newGeneration.length)]
const parentB = newGeneration[getRandomInt(0, newGeneration.length)]
const child = crossover(parentA, parentB)
```

# Crossover
O crossover é feito através da troca de genes entre 2 indivíduos. Existem vários métodos de crossover, optei por um corte usando 2 pontos (começo e final do corte) e trocando os genes.<p>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/TwoPointCrossover.svg/226px-TwoPointCrossover.svg.png">
```javascript
function crossover(parentA, parentB){
    let childA = {string: ''}
    const crossingPointMin = getRandomInt(0, target.length / 2) // definir o começo do ponto de corte. Fiz com que o tamanho máximo fosse a metade do comprimento para preservar a diversidade dos pais
    const crossingPointMax = getRandomInt(crossingPointMin, target.length) // definir o ponto final de corte
    for(let i = 0; i < target.length; i++){
        if(i >= crossingPointMin && i < crossingPointMax){ // quando essa condição acontece significa que i está dentro dos pontos de corte
            childA.string += parentA.string[i]
        }
        else{
            childA.string += parentB.string[i]
        }
    }
    mutation(childA) // rodar um mutação para diversificar os filhos
    return childA
}
```

# Mutation
A mutação tem uma lógica parecida com a do crossover pois aqui também há pontos de corte, porém sem a limitação do corte minimo ter só metade do comprimento, pois assim teremos mais diversidade. Além disso, quando <b>i</b> está dentro do ponto de corte, invés de acontecer troca de genes, genes aleatórios são gerados.
```javascript
function mutation(chromossome){
    const rate = getRandomDouble(1, 100)
    if(MUTATION_RATE >= rate){
        let newString = [] // nova string
        const randomPosition = getRandomInt(0, chromossome.string.length)
        const crossingPointMin = getRandomInt(0, target.length - 2)
        const crossingPointMax = getRandomInt(crossingPointMin, target.length)
        for(let i = 0; i < target.length; i++){ // esse loop serve para deixar a array da string com o mesmo tamanho do comprimento do texto original, evitando erros de acessar um index não disponível
            newString.push("x")
        }
        for(let i = 0; i < target.length; i++){
            if(i >= crossingPointMin && i < crossingPointMax){ // quando essa condição acontece significa que i está dentro dos pontos de corte
                const randomChar = charOptions[getRandomInt(0, charOptions.length)]
                newString[i] = randomChar
            }
            else{
                newString[i] = chromossome.string[i]
            }
        }
        chromossome.string = newString.join('') // join() pra concatenar toda a array em uma string
    }
}
```
