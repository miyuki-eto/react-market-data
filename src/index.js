import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {ThemeProvider} from './components/structure/themeContext';
import Background from './components/structure/background';
// import Toggle from './components/themeToggle';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider>
            <Background>
                <main>
                    <App/>
                </main>
            </Background>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();