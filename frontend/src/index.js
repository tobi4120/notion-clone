import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app';

// Good guide on how to publish react + django to heroku: https://dev.to/mdrhmn/deploying-react-django-app-using-heroku-2gfa

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={createStore(reducers, composeEnhancers(applyMiddleware(thunk)))}>
    <App />
  </Provider>
); 