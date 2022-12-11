import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        moreLoading: false,
        offset: 200,
        charEnded: false
    }

    marvelService = new MarvelService();

    // выполняется после первичного рендеринга, там пока пустой массив charList
    // после чего выполняем onRequest и запрашиваем данные с API, на основе них формируем новый массив newCharList
    // далее меняем state в onCharListLoaded и выполняем shouldComponentUpdate
    componentDidMount(){
        this.onRequest();
    }

    
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllChars(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    // выполняется shouldComponentUpdate, так как меняем state
    onCharListLoading = () => {
        this.setState({
            moreLoading: true
        })
    }

    // выполняется shouldComponentUpdate, так как меняем state
    onCharListLoaded = (newCharList) => {

        let ended = false;
        if (newCharList.length < 9){
            ended = true;
        }
        this.setState(({offset, charList}) => (
            {
                charList: [...charList, ...newCharList], 
                loading: false,
                moreLoading: false,
                offset: offset + 9,
                charEnded: ended
            }
        ))
    }

    // выполняется shouldComponentUpdate, так как меняем state
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    // пустой массив значений для Ref карточек персонажей
    charRefs = [];
    // создаем все ссылки на карточки
    setRef = (ref) => {
        this.charRefs.push(ref);
    }
    // управляем css активной карточки, выделяем активную
    setFocusOnChar = (id) => {
        this.charRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.charRefs[id].classList.add('char__item_selected');
        this.charRefs[id].focus();
    }

    renderChars = (arr) => {
        const items = arr.map((item, index) => {
            let objectFitStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
                objectFitStyle = {'objectFit': 'contain'};
            }
            return (
                <li 
                    className="char__item"
                    ref={this.setRef}
                    key={item.id}
                    tabIndex={0}
                    onClick={()=> {
                        this.props.onCharSelected(item.id);
                        this.setFocusOnChar(index);
                    }}
                    // управление с клавиатуры
                    onKeyDown={e => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.setFocusOnChar(index);
                        }
                    }}
                >
                    <img src={item.thumbnail} alt={item.name} style={objectFitStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render(){
        const { charList, loading, error, moreLoading, offset, charEnded } = this.state;

        const items = this.renderChars(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    onClick={() => this.onRequest(offset)}
                    className="button button__main button__long"
                    disabled={moreLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                >
                        <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;