import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Schedule from "./Components/Schedule/Schedule";
import Error from "./Components/Error/Error";
import Cathedra from "./Components/Cathedra/Cathedra";
import Audience from "./Components/Audience/Audience";
import Specialty from "./Components/Specialty/Specialty";
import Discipline from "./Components/Discipline/Discipline";
import Class from "./Components/Class/Class";
import Group from "./Components/Group/Group";
import Teacher from "./Components/Teacher/Teacher";
import AuthProvider from "./Components/Authorization/AuthProvider";
import "react-notifications/lib/notifications.css";

const client = new ApolloClient({
  uri: "http://localhost:3002/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <App>
            <Routes>
              <Route exact path="/" element={<Schedule></Schedule>} />
              <Route path="/schedules" element={<Schedule></Schedule>} />
              <Route path="/cathedras" element={<Cathedra></Cathedra>} />
              <Route path="/audiences" element={<Audience></Audience>} />
              <Route path="/specialties" element={<Specialty></Specialty>} />
              <Route path="/disciplines" element={<Discipline></Discipline>} />
              <Route path="/classes" element={<Class></Class>} />
              <Route path="/groups" element={<Group></Group>} />
              <Route path="/teachers" element={<Teacher></Teacher>} />
              <Route path="*" element={<Error></Error>} />
            </Routes>
          </App>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
