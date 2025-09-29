import React, {useState, useReducer, useEffect, useMemo, useCallback} from 'react';
import './App.css';
import ColorDisplay from './ColorDisplay';
import ColorHistory from './ColorHistory';

const historyReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_COLOR':
            return [action.payload, ...state].slice(0, 5);
        case 'DELETE_COLOR':
            return state.filter(color => color !== action.payload);
        default:
            return state;
    }
};

function App() {
// управление текущим цветом
    const [currentColor, setCurrentColor] = useState('#1e90ff');
//    управление историей цветов
    const [colorHistory, dispatch] = useReducer(historyReducer, []);
//отображение истории (условный рендеринг)
    const [showHistory, setShowHistory] = useState(true);
//обновление истории при изменении currentColor
    useEffect(()=> {
        dispatch({ type: 'ADD_COLOR', payload: currentColor });
// обновление заголовка страницы
    document.title = `Color: ${currentColor}`;
    }, [currentColor]);
//будет передана ColorHistory (мемоизация)
   const handleDeleteFromHistory = useCallback((colorToDelete)=>{
    dispatch({ type: 'DELETE_COLOR', payload: colorToDelete });
   }, []); // зависимостей нет
// useMemo - мемоизация вычислений (сколько цветов в истории)
    const isHistoryFull = useMemo(()=>{
        console.log('useMemo: проверка заполненности истории');
        return colorHistory.length >= 5;
    }, [colorHistory]); //перерасчет только при изменении истории

// обработка измения цвета
    const handleColorChange = (e) => {
        setCurrentColor(e.target.value);
    };
// кнопка для переключения отображения истории
    const handleToggleHistory = () => {
        setShowHistory(prev => !prev);
    }

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto',
    textAlign: 'center' }}>
    <h1>Выбор цвета (с историей)</h1>
    {/*пропсы: передача текущего цвета компоненту */}
    <ColorDisplay color={currentColor} />

    <div style={{margin: '20px 0' }}>
        <label htmlFor='colorPicker' style={{ marginRight: '10px'}}>
         Выберите цвет:
        </label>
        <input id='colorPicker' type='color'
        value={currentColor}
        onChange={handleColorChange}
        style={{ width: '50px', height: '50px', border: 'none' }}
        />
    </div>
    <button onClick={handleToggleHistory}>
        {showHistory ? 'Скрыть историю' : 'Показать историю'}
    </button>
    {/*условный рендеринг*/}
    <p>
        {isHistoryFull
            ? <strong>история заполнена</strong>
            : `в истории ${colorHistory.length}`
        }
    </p>
    <hr style={{ margin: '30px 0'}} />
    {showHistory && (
        <ColorHistory history={colorHistory}
        onDelete={handleDeleteFromHistory}  />
    )}
</div>
);
}

export default App;
