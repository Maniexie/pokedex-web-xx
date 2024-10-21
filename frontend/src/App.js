import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=100"
        );
        setPokemonList(response.data.results);
        setLoading(false);
      } catch (error) {
        setError("Error fetching Pokemon data");
        setLoading(false);
      }
    };

    getPokemon();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center">
      <header className="App-header py-10">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-8">
          Pokemon DEX
        </h1>
        <div className="pokemon-list flex flex-wrap justify-center container mx-auto">
          {pokemonList.map((pokemon, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 dark:bg-gray-800 dark:border-gray-700">
                <img
                  className="rounded-t-lg w-full h-48 object-cover"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    index + 1
                  }.png`}
                  alt={pokemon.name}
                />
                <div className="p-5">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
                    {pokemon.name}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <span className="font-semibold">Character Name:</span>{" "}
                    {pokemon.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
