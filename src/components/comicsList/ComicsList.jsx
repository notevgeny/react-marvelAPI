import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [moreLoading, setMoreLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();


    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setMoreLoading(false) : setMoreLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }


    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.ended < 8){
            ended = true;
        }
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setMoreLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }


    const renderComics = (arr) => {
        const items = arr.map((item, index) => {
            return (
                <li 
                    className="comics__item" 
                    key={index}
                    tabIndex={0}
                >
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }


    const items = renderComics(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !moreLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                onClick={() => onRequest(offset)}
                disabled={moreLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

// ComicsList.propTypes = {
//     onComicsSelected: PropTypes.func.isRequired
// }

export default ComicsList;