import { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


const CharList = (props) => {

    // состояние массива персонажей
    const [charList, setCharList] = useState([]);
    // состояние спиннера загрузки новых персонажей
    const [moreLoading, setMoreLoading] = useState(false);
    // состояние запроса, с какого места получаем данные о персонажах
    const [offset, setOffset] = useState(200);
    // состояние конца массива персонажей
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllChars} = useMarvelService();


    useEffect(() => {
        // в кастом хуке принудительно задаем начальное состояние спиннера (setLoading(true)), поэтому необходимо внести корректировки
        // для этого добавляем переменную, которая определяет, какая это загрузка (true - первичная)
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])


    const onRequest = (offset, initial) => {
        // в случае, когда это первичная загрузка - включаем спиннер, если нет - не включаем
        initial ? setMoreLoading(false) : setMoreLoading(true);
        getAllChars(offset)
            .then(onCharListLoaded)
    }

    // выполняется shouldComponentUpdate, так как меняем state
    const onCharListLoaded = (newCharList) => {

        let ended = false;
        if (newCharList.length < 9){
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setMoreLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended)

    }

    // пустой массив значений для Ref карточек персонажей
    const charRefs = useRef([]);

    // управляем css активной карточки, выделяем активную
    const setFocusOnChar = (id) => {
        charRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        charRefs.current[id].classList.add('char__item_selected');
        charRefs.current[id].focus();
    }
    // рендер карточек персонажей
    const renderChars = (arr) => {
        const items = arr.map((item, index) => {
            let objectFitStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
                objectFitStyle = {'objectFit': 'contain'};
            }
            return (
                <li 
                    className="char__item"
                    ref={el => charRefs.current[index] = el}
                    key={item.id}
                    tabIndex={0}
                    onClick={()=> {
                        props.onCharSelected(item.id);
                        setFocusOnChar(index);
                    }}
                    // управление с клавиатуры
                    onKeyDown={e => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            setFocusOnChar(index);
                        }
                    }}
                >
                    <img src={item.thumbnail} alt={item.name} style={objectFitStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // в рендер идет:
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderChars(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    // меняем логику: крутим спиннер тогда когда есть загрузка, но это не загрузка новых персонажей
    const spinner = loading && !moreLoading ? <Spinner/> : null;
    
    // const content = !(loading || error) ? items : null;

    // состояние charList и loading каждый раз меняются и перерендеривают интерфейс. В функциональных компонентах при изменении каждый раз content новый.
    // В классовых компонентах переменная добавляла значение, поэтому content не прыгал
    // Чтобы content не прыгал в ФК, необходимо убрать это условие (null вызывает изменение верстки и интефейс прыгает). 
     
    
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {/* Просто рендерим пустой char__grid, если контент не загрузился */}
            {items}
            <button 
                onClick={() => onRequest(offset)}
                className="button button__main button__long"
                disabled={moreLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )

    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;