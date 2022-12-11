import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import './style/style.scss';


// console.log(process.env.REACT_APP_API_KEY)

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <App/>
);