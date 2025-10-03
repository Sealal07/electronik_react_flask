import React from 'react';
import {Link} from 'react-router-dom';

const PlanetCard = ({ planet }) => {
    const detailLink = `/planet/${encodeURIComponent(planet.name)}`;
    return (
        <div style={cardStyle}>
            <h3>{planet.name}</h3>
            <p>Тип: <strong>{planet.type}</strong></p>
            <Link to={detailLink} style={linkStyle}>
                Посмотреть детали
            </Link>
        </div>
    );
};
const cardStyle = {
    border: '1px solid #ccc',
    padding: '15px',
    margin: '10px',
    borderRadius: '10px',
    width: '200px',
    display: 'inline-block',
    textAlign: 'center',
};

const linkStyle = {
    display: 'block',
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: 'purple',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px'
};
export default PlanetCard;