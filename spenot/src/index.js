import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from "./contexts/AuthContext"; 
import { AsyncRequestProvider } from './contexts/AsyncRequestContext';
import { ButtonProvider } from './contexts/ButtonContext';






const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <React.StrictMode>

    <BrowserRouter>

        <ButtonProvider>
          <AuthProvider>
            <AsyncRequestProvider>
              <App />
            </AsyncRequestProvider>
          </AuthProvider>
        </ButtonProvider>

    </BrowserRouter>

  </React.StrictMode>

);

// npm install react-bootstrap bootstrap
// npm install axios
// npm install react-router-dom
// npm install js-cookie



/*
 további fejlesztések

 - a logs- oldalra szűrő hogy diákra és dátumra is rá tudjunk keresni
 - csoport szerinti listázása



 */