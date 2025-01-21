
import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import VendegLayout from './layouts/VendegLayout';
import { Route, Routes } from "react-router-dom";
import AdminPage from './pages/AdminPage';
import EmailSend from './pages/EmailSend';
import UploadDatabase from './pages/UploadDatabase';
import PrivateRoute from './components/PrivateRoute';




export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
      
            <Route path="bejelentkezes" element={<Login />} />
            
            <Route path="regisztracio" element={<Register />} />
            <Route path="elfelejtJelszo" element={<ForgotPassword />} />


            {/* csak a bejelentkezett felhasználók érhessék el azokat az oldalakat, 
            amelyekhez autentikáció szükséges (pl. adminoldal, főoldal). 
            Ezzel egy vendég automatikusan visszairányításra kerül a bejelentkezési oldalra, 
            ha próbál hozzáférni egy privát oldalhoz. */}
            <Route path="adminOldal" element={<PrivateRoute> <AdminPage /> </PrivateRoute>} />
            <Route path="emailKuldes" element={<PrivateRoute> <EmailSend /> </PrivateRoute>} />
            <Route path="abFeltoltes" element={<PrivateRoute> <UploadDatabase /> </PrivateRoute>} />
            <Route path="kezdolap" element={<PrivateRoute> <HomePage /> </PrivateRoute>} />

    </Routes>
  );
}