import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import * as splitsterRedux from "splitster-redux";

import config from "./config";

import reducers from "./store/reducers";
import Root from "./app/Root";

const initState = JSON.parse(document.body.getAttribute("data-redux-state"));

const store = createStore(reducers, initState);
store.dispatch(splitsterRedux.initClient(config));

window.splitsterRedux = splitsterRedux;
window.store = store;

render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById("app")
);
