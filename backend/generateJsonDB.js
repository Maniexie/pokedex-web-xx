const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

async function fetchPokemonData() {
  try {
    const response = await axios.get(dotenv.FETCH_POKEMON_URI);
    const pokemonList = response.data.results;

    const detailedPokemonList = await Promise.all(
      pokemonList.map(async (pokemon, index) => {
        const pokemonDetails = await getPokemonDetails(pokemon.url);

        return {
          id: index + 1,
          name: pokemonDetails.name,
          url: pokemonDetails.url,
          types: pokemonDetails.types,
          abilities: pokemonDetails.abilities,
          height: pokemonDetails.height,
          weight: pokemonDetails.weight,
          cries: {
            latest: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${
              index + 1
            }.ogg`,
            legacy: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${
              index + 1
            }.ogg`,
          },
          evolutionChains: await getEvolutionChain(pokemonDetails.speciesUrl),
        };
      })
    );

    fs.writeFileSync("db.json", JSON.stringify(detailedPokemonList, null, 2));
    console.log("Data berhasil disimpan ke db.json");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getPokemonDetails(url) {
  try {
    const response = await axios.get(url);
    const pokemon = response.data;

    const types = pokemon.types.map((type) => type.type.name);
    const abilities = pokemon.abilities.map((ability) => ability.ability.name);

    return {
      name: pokemon.name,
      url: pokemon.url,
      types: types,
      abilities: abilities,
      height: pokemon.height,
      weight: pokemon.weight,
      speciesUrl: pokemon.species.url,
    };
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    return {};
  }
}

async function getEvolutionChain(speciesUrl) {
  try {
    const speciesResponse = await axios.get(speciesUrl);
    const evolutionUrl = speciesResponse.data.evolution_chain.url;

    const evolutionResponse = await axios.get(evolutionUrl);
    const evolutionChain = extractEvolutionChain(evolutionResponse.data.chain);

    return evolutionChain;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return [];
  }
}

function extractEvolutionChain(chain) {
  let evolutionNames = [];

  let currentChain = chain;
  while (currentChain) {
    evolutionNames.push(currentChain.species.name);
    currentChain = currentChain.evolves_to[0];
  }

  return evolutionNames;
}

fetchPokemonData();
