import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DeckCards.css";
import Card from "./Card";

function DeckCards(){
    const [deck, setDeck] = useState({ deck_id: "", remaining: 0 });
    const [deckCards, setDeckCards] = useState([]);
    const getCardButton = useRef();

    useEffect(function fetchGetNewDeck() {
        async function newDeck() {
          const response = await axios.get("http://deckofcardsapi.com/api/deck/new/shuffle/");
          setDeck({ deck_id: response.data.deck_id, remaining: response.data.remaining });
        }
        newDeck();
    }, []);

    async function handleGetCard(){
        if(deck.remaining === 0){
            getCardButton.current.style.visibility = "hidden";
            return alert("Error: no cards remaining!");
        }

        const response = await axios.get(`http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
        const newCard = {
            image: response.data.cards[0].image,
            code: response.data.cards[0].code,
            z_index: deckCards.length + 1,
            margin_top: Math.floor(Math.random() * 50),
            rotate_deg: Math.floor((Math.random() * (45 - (-45) + 1)) + (-45))
        };
        setDeckCards(cards => [...cards, newCard]);
        setDeck({ deck_id: response.data.deck_id, remaining: response.data.remaining });
    }
    
    return (
        <div className="DeckCards">
            <h1>Deck of Cards</h1>
            <button onClick={handleGetCard} className="DeckCards-button" ref={getCardButton}>gimme a card!</button>
            <div className="DeckCards-deck">
                { deckCards.map(card => <Card image={card.image} zIndex={card.z_index} marginTop={card.margin_top} rotateDeg={card.rotate_deg} id={card.code} key={card.code} /> )}
            </div>
        </div>
    );
}

export default DeckCards;