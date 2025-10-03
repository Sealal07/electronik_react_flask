import React from 'react';

function ColorHistory({ history, onDelete }) {
    return (
        <div>
            <h2>История цветов</h2>
            {/* если история пуста */}
            {history.length === 0 ? (
                <p>История цветов пуста</p>
            ) : (
                <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '15px' }}>
                    {history.map((color, index) => (
                        <div key={color + index}
                        style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                         justifyContent: 'center'}}>
                            <div style={{
                                    backgroundColor: color,
                                    width: '100px',
                                    height: '100px',
                                }}>
                                <span style={{fontWeight: '700'}}>
                                    {color}
                                </span>
                            </div>
                            <button type='button' onClick={() => onDelete(color)}>
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default React.memo(ColorHistory);