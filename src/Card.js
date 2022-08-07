import React from "react";
import "./Card.css";

function Card({ image, zIndex, marginTop, rotateDeg }){

    return (
        <div className="Card">
            <div className="Card-div_card" style={{ marginTop: `${marginTop}px`,zIndex: zIndex }}>
                <img src={image} style={{ transform: `rotate(${rotateDeg}deg)` }} alt="" />
            </div>
        </div>
    );
}

export default Card;