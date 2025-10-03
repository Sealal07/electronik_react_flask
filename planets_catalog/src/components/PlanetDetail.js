import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PLANETS } from '../data/planets';

const PlanetDetail = () => {
    const { name: urlName } = useParams();
    const planetName = decodeURIComponent(urlName);
    const planet = PLANETS.find(p => p.name === planetName);
    if (!planet) {
        return (
            <div style={{ padding: '20px'}}>
                <h2>Планета {planetName} не найдена</h2>
                <Link to='/planets'>Вернуться к списку</Link>
            </div>
        );
    }
    return (
        <div style={detailStyle}>
            <h1>{planet.name}</h1>
            <p><strong>Тип</strong>: {planet.type}</p>
            <p><strong>Масса</strong>: {planet.mass}</p>
            <p><strong>Кол-во спутников</strong>: {planet.moons}</p>
            <p><strong>Описание</strong></p>
            <p>{planet.description}</p>
            <hr />
            <Link to='/planets'>Вернуться к списку</Link>
        </div>
    );
};
const detailStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #666',
    borderRadius: '10px',
    marginTop: '20px',
};
export default PlanetDetail;