import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

  const { loading, request, error, clearError } = useHttp();

  const _apiURI = 'https://gateway.marvel.com:443/v1/public/';
  // _apiKey = '885e5f95f9a1ca1edbc88e5b43b08c46';
  const _baseOffset = 200;

  const getAllChars = async (offset = _baseOffset) => {
    const res = await request(`${_apiURI}characters?limit=9&offset=${offset}&apikey=${process.env.REACT_APP_API_KEY}`);
    return res.data.results.map(_transformChar);
  }

  const getCurrentChar = async (id) => {
    const res = await request(`${_apiURI}characters/${id}?apikey=${process.env.REACT_APP_API_KEY}`);
    return _transformChar(res.data.results[0]);
  }

  const getAllComics = async (offset = 0) => {
    const res = await request(`${_apiURI}comics?orderBy=issueNumber&limit=8&offset=${offset}&apikey=${process.env.REACT_APP_API_KEY}`);
    return res.data.results.map(_transformComics);
  }

  const getCurrentComic = async (id) => {
    const res = await request(`${_apiURI}comics/${id}?apikey=${process.env.REACT_APP_API_KEY}`);
    return _transformComics(res.data.results[0]);
  }

  const getCharByName = async (name) => {
    const res = await request(`${_apiURI}characters?name=${name}&apikey=${process.env.REACT_APP_API_KEY}`);
    return res.data.results.map(_transformChar);
  }

  const _transformChar = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 200)}...` : `There is no data about this character`,
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: `${char.urls[0].url}`,
      wiki: `${char.urls[1].url}`,
      comics: char.comics.items
    }
  }

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description ? `${comics.description.slice(0, 200)}...` : `There is no data about this character`,
      pageCount: comics.pageCount ? `${comics.pageCount} pages` : 'There is no data about number of pages',
      language: comics.textObjects.language || 'en-us',
      thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
      price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
    }
  }

  return {loading, error, clearError, getAllChars, getCurrentChar, getAllComics, getCurrentComic, getCharByName}
}


export default useMarvelService;