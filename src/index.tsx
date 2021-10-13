import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import '@laravel-streams/core';

import App from './components/App';

import reportWebVitals from './reportWebVitals';

let app = window.streams.core.app;

    app
        .initialize({
            providers: [
                window.streams.core.HttpServiceProvider,
                window.streams.core.StreamsServiceProvider,
                //window.app.AppServiceProvider
            ],
            config: {
                http: {
                    //baseURL: this.env.get('APP_URL', 'http://localhost') + '/' + this.env.get('STREAMS_API_PREFIX', 'api'),
                    baseURL: 'http://127.0.0.1:8000/api',
                }
            },
        })
        .then(app => {

            app.boot.bind(app);

            console.log('Initialized');

            return app;
        })
        .then(app => {

            app.start();

            console.log('Started');

            return app;

        })
        .then(app => {
            // Something else.
        });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
