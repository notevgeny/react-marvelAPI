
class MarvelService {

  _apiURI = 'https://gateway.marvel.com:443/v1/public/';
  // _apiKey = '885e5f95f9a1ca1edbc88e5b43b08c46';
  _baseOffset = 200;

  getData = async (url) => {
    let res = await fetch(url);
  
    if (!res.ok){
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
  
    return await res.json();
  }

  getAllChars = async (offset = this._baseOffset) => {
    const res = await this.getData(`${this._apiURI}characters?limit=9&offset=${offset}&apikey=${process.env.REACT_APP_API_KEY}`);
    return res.data.results.map(this._transformChar);
  }

  getCurrentChar = async (id) => {
    const res = await this.getData(`${this._apiURI}characters/${id}?apikey=${process.env.REACT_APP_API_KEY}`);
    return this._transformChar(res.data.results[0]);
  }

  _transformChar = (char) => {
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
}


export default MarvelService;