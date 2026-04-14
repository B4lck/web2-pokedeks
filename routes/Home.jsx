import {useEffect, useState} from "react";
import "./Home.css"

export default function Home() {
    const [currentPokemons, setCurrentPokemons] = useState([])
    const [page, setPage] = useState(0);
    const [hightlightedPokemon, setHighlightedPokemon] = useState(null)

    function incrementPage() {
        setPage(page + 1)
    }

    function decrementPage() {
        if (page > 0) setPage(page - 1)
    }

    function closeHighlight() {
        setHighlightedPokemon(null)
    }

    function openHighlight(pokemon) {
        setHighlightedPokemon(pokemon)
    }

    function getPokemons() {
        const pageSize = 20;

        fetch("https://pokeapi.co/api/v2/pokemon?limit="+pageSize+"&offset=" + pageSize * page)
            .then(res => res.json())
            .then(async (res) => {
                // Henter alle 20 detaljer parallelt
                const detailedPokemons = await Promise.all(
                    res.results.map(async (pokemon) => {
                        const res = await fetch(pokemon.url);
                        return res.json();
                    })
                );
                setCurrentPokemons(detailedPokemons);
            })
            .catch(res => {
                console.error("Der skete en fejl ved ");
                setCurrentPokemons([]);
            })
    }

    // Opdatere pokemons hver gang page ændrer sig
    useEffect(() => {
        getPokemons()
    }, [page]);

    return <>
        <div className={"pokemon-container"}>
            {currentPokemons.map((pokemon, index) => (
                <div onClick={() => openHighlight(pokemon)} className={"pokemon " + pokemon.types[0].type.name} key={index}>
                    <div className={"pokemon-info"}>
                        <p>#{pokemon.id}</p>
                        <p>{pokemon.name}</p>
                    </div>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                </div>
            ))}
        </div>
        <div className={"page-container"}>
            <button onClick={() => decrementPage()}>Prev</button>
            <span>page: {page + 1}</span>
            <button onClick={() => incrementPage()}>Next</button>
        </div>
        { hightlightedPokemon && (
            <div id={"highlighted-pokemon"} className={`highlighted-pokemon ${hightlightedPokemon.types[0].type.name}`}>
                <div className={"top-bar"}>
                    <button onClick={() => closeHighlight()}>x</button>
                </div>
                <h1>{hightlightedPokemon.name}</h1>
                <div className={"hp-info"}>
                    <div className={"hp-left"}>
                        <ul className={"hp-info-list"}>
                            <h3>Info</h3>
                            <li>Types: {hightlightedPokemon.types.map((type) => (<span style={{marginRight: 10 + "px"}}
                                                                                       className={type.type.name}>{type.type.name}</span>))}</li>
                            <li>Height: {hightlightedPokemon.height / 10}m</li>
                            <li>Weight: {hightlightedPokemon.weight / 10}kg</li>
                        </ul>
                        <ul className={"hp-info-list"}>
                            <h3>Base Stats</h3>
                            {hightlightedPokemon.stats.map((stat) => (
                                <li>{stat.stat.name}: {stat.base_stat}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={"hp-right"}>
                        <img src={hightlightedPokemon.sprites.front_default} alt={hightlightedPokemon.name}/>
                    </div>
                </div>
            </div>
        )}
    </>
}

