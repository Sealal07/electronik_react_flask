import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { PLANETS } from './data/planets';
import PlanetCard from './components/PlanetCard';
import PlanetDetail from './components/PlanetDetail';

// компонент для маршрута /planets
const PlanetList = ({ planets, activeFilter, setActiveFilter,
filteredPlanets}) => {
    const planetTypes = ['Все', ...new Set(planets.map(p=>p.type))];
    return (
        <div style={{ padding: '20px' }}>
            <h1>Каталог планет</h1>
            {/*блок фильтрации*/}
            <div style={filterContainerStyle}>
                <select id='planet-filter'
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        style={selectStyle}
                >
                {planetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
                </select>
            </div>
            <hr />
            <div>
                {filteredPlanets.map(planet =>(
                    <PlanetCard key='planet.name' planet={planet} />
                ))}
            </div>
        </div>
    );
};

const  App = () => {
    const [planets, setPlanets ] = useState([]);
    const [activeFilter, setActiveFilter] = useState('Все');
    const [filteredPlanets, setFilteredPlanets] = useState([]);

    useEffect(()=>{
        setPlanets(PLANETS);
        setFilteredPlanets(PLANETS);
    }, []);

    useEffect(() => {
        if (activeFilter === 'Все'){
            setFilteredPlanets(planets);
        }
        else{
            const newFiltered = planets.filter(p => p.type === activeFilter);
            setFilteredPlanets(newFiltered);
        }
    }, [activeFilter, planets]);

  return (
  <>
    <Router>
        <Routes>
            <Route path='/planets' element={
                <PlanetList
                    planets={planets}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    filteredPlanets={filteredPlanets} />
                                            }
            />
            <Route path='/planet/:name' element={<PlanetDetail />} />
            <Route path='/' element={
                <div style={{padding: '20px'}}>
                    <p>Добро пожаловать в каталог планет!</p>
                    <Link to='/planets'>Начать просмотр</Link>
                </div>
                                    }
            />
        </Routes>
    </Router>
</>
  );
};
const filterContainerStyle = {};
const selectStyle = {};

export default App;
