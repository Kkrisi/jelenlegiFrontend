import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from "./contexts/AuthContext"; 
import { AsyncRequestProvider } from './contexts/AsyncRequestContext';
import { ButtonProvider } from './contexts/ButtonContext';






const root = ReactDOM.createRoot(document.getElementById("root"));  // program belépési pontja
root.render(

  <React.StrictMode>  {/*fejlesztesi mod, kapnuk infot a problémakrol*/}

    <BrowserRouter>   {/*útvonal kezelés: dinamikusan*/}

        <ButtonProvider>    {/*ezek kulonbozo kompenensek amik kontextusokat biztositanak a többi komponensnek*/}
          <AuthProvider>
            <AsyncRequestProvider>
              <App />     {/*ezt látja a felhasználó*/}
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


