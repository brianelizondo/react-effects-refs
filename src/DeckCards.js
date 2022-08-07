import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DeckCards.css";
import Card from "./Card";

function DeckCards(){
    const [deck, setDeck] = useState({ deck_id: "", remaining: 0 });
    const [deckCards, setDeckCards] = useState([]);
    const [drawingCards, setDrawingCards] = useState(false);
    const [drawingButton, setDrawingButton] = useState("Start drawing!");
    
    const getCardButton = useRef();
    const drawingCardsButton = useRef();
    let timerID = useRef(false);

    useEffect(function fetchGetNewDeck() {
        async function newDeck() {
          const response = await axios.get("http://deckofcardsapi.com/api/deck/new/shuffle/");
          setDeck({ deck_id: response.data.deck_id, remaining: response.data.remaining });
        }
        newDeck();
    }, []);

    async function handleGetCard(){
        const response = await axios.get(`http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
        const cardData = {
            image: response.data.cards[0].image,
            code: response.data.cards[0].code,
            z_index: deckCards.length + 1,
            margin_top: Math.floor(Math.random() * 50),
            rotate_deg: Math.floor((Math.random() * (45 - (-45) + 1)) + (-45))
        };
        setDeckCards(cards => [...cards, cardData]);
        setDeck({ deck_id: response.data.deck_id, remaining: response.data.remaining });

        if(response.data.remaining === 45){
            getCardButton.current.style.visibility = "hidden";
            drawingCardsButton.current.style.visibility = "hidden";
            clearInterval(timerID.current);
            setDrawingCards(false);
            return alert("Error: no cards remaining!");
        }
    }

    const handleDrawingCards = () => {
        if(drawingCards === false){
            setDrawingButton("Stop drawing!");
            timerID.current = setInterval(async () => {
                await handleGetCard();
            }, 1000);
        }else{
            setDrawingButton("Start drawing!");
            clearInterval(timerID.current);
        }
        setDrawingCards(!drawingCards);
    }
    
    return (
        <div className="DeckCards">
            <h1>Deck of Cards</h1>
            <div style={{margin:"10px 0px"}}><button onClick={handleGetCard} className="DeckCards-button" ref={getCardButton}>gimme a card!</button></div>
            <div><button onClick={handleDrawingCards} className="DeckCards-button" ref={drawingCardsButton}>{ drawingButton }</button></div>
            <div className="DeckCards-deck">
                { deckCards.map(card => <Card image={card.image} zIndex={card.z_index} marginTop={card.margin_top} rotateDeg={card.rotate_deg} id={card.code} key={card.code} /> )}
            </div>
        </div>
    );
}

export default DeckCards;