import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloClient,InMemoryCache,ApolloProvider,} from "@apollo/client";
import Schedule from "./Components/Schedule/Schedule";
import Error from "./Components/Error/Error";

const client = new ApolloClient({
  uri: 'https://localhost:3002/graphql',
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
        <ApolloProvider client={client}>
          <BrowserRouter>
          <App>
            <Routes>
              <Route exact path='/' component={Schedule} />
              <Route path='/schedule' component={Schedule} />
              <Route path='*' component={Error} />
            </Routes>
            </App>
        </BrowserRouter>
      </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
