import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./store/store";
import App from './App';
import Loading from './components/Loading';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Suspense fallback={<Loading />}>
                <App />
            </Suspense>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
