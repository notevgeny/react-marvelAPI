import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {loading, error, getCurrentChar, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId){
            return;
        }
        clearError();
        getCurrentChar(charId)
            .then(onCharLoaded)

    }

    const onCharLoaded = (char) => {       
        setChar(char);
    }


    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(error || loading || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ( {char} ) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    let objectFitStyle = {'objectFit': 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
        objectFitStyle = {'objectFit': 'contain'};
    }
    // выводим не более 10 комиксов на карточку
    const getComicsList = () => {
        const comicsList = [];
        for (let i = 0; i < comics.length; i++){
            if (i > 9){
                break;
            }
            // получаем id из ссылки
            let comicId = comics[i].resourceURI.split('/').slice(-1);
            comicsList.push(
                <Link key={i + 1} to={`/comics/${comicId}`}>
                    <li className="char__comics-item">{comics[i].name}</li>
                </Link>
            )
        }
        return comicsList
    }
    
    
    return(
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={objectFitStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? `There is no comics about this character` : null}
                {getComicsList()}
                                
                {/* {comics.map((item, index) => {
                    if (index > 9) return // плохая производительность при больших данных, лучше использовать for с break
                    return(
                        <li 
                            key={index}
                            className="char__comics-item"
                        >
                            {item.name}
                        </li>
                    )
                })} */}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;