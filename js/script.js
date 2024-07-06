const app = document.getElementById("app");
const searchBtn = document.getElementById("searchBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
let currentPage = 0

const callPokemon = async (offset) => {
    try{
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset * 10}`)
        if(!res.ok){
            throw new Error("Error Linea 9")
        }
        const data = await res.json()
        const dataResults = data.results
        printListPokemon(dataResults)
    }
    catch (err) {
        console.error("Linea 12", err)
    }
} 

const printListPokemon = (pokemonList) => {
    const promesas = [] 
    pokemonList.forEach(element => {
        promesas.push(fetch(element.url))
    });
    Promise.all(promesas).then(res => {
        const allPokeomJson = res.map(response => response.json())
        Promise.all(allPokeomJson).then( (res) =>{
            console.log(res)
            printPokemonApp(res)
        })
    })
}

const printPokemonApp = (pokemonList) => {
    pokemonList.forEach(element => {
        console.log(element)
         fetch(`https://pokeapi.co/api/v2/pokemon/${element.id}`)
         .then(res => res.json())
         .then(data => {
              template = `
              <div class="cardPokemon">
                  <img src="${data.sprites.other.home.front_default}"/>
                  <h2><b>${element.name.toUpperCase()}<b/></h2>
              </div>
          `
         app.innerHTML += template;
     })
})}

prevBtn.addEventListener("click", () => {
    if(currentPage > 0){
        currentPage --;
        app.innerHTML = ""
        callPokemon(currentPage);
    }
})

nextBtn.addEventListener("click", () => {
    if(currentPage < 132){
        currentPage ++;
        app.innerHTML = ""
        callPokemon(currentPage)
    }
})

resetBtn.addEventListener("click", () => {
    currentPage = 0;
    app.innerHTML = ""
    callPokemon(currentPage)
})

callPokemon(currentPage)

searchBtn.addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput").value;
    findOnePokemon(searchInput)
})

const findOnePokemon = async (pokemon) => {
    try{
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
        const data = await res.json()
        const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.id}`)
        const data2 = await res2.json()
        const template = `
        <div class="pokemonInfo">
            <h2>${data.name.toUpperCase()}</h2>
                <div class="imagesPokemon">
                    <img src=${data2.sprites.other.home.front_default} alt=${data.name} />
                    <img src=${data2.sprites.other.home.front_shiny} alt=${data.name} />
                </div>
            <p><span>Height: </span>${data2.height}</p>
            <p><span>Weight: </span>${data2.weight}</p>
            <p><span>Type/s: </span> ${data2.types.map(typeInfo => typeInfo.type.name).join(', ').toUpperCase()}</p>
        </div>
        `
        app.innerHTML = template
    }
    catch{
        alert("Pokemon no encontrado, escribe bien por favor")
    }
}