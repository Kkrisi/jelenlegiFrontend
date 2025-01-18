import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from "./contexts/AuthContext"; 






const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <React.StrictMode>

    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>

  </React.StrictMode>

);

// npm install react-bootstrap bootstrap
// npm install axios
// npm install react-router-dom


