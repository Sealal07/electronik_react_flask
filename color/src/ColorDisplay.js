import React from 'react';

function ColorDisplay({color}) {
//    на основе пропса
    const displayStyle = {
    backgroundColor: color,
    width: '200px',
    height: '200px'
    };
    return (
        <div style={displayStyle}>
            <p>{color}</p>
        </div>
    );
};
export default ColorDisplay;