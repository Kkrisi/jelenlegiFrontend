
import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import VendegLayout from './layouts/VendegLayout';
import { Route, Routes } from "react-router-dom";
import EmailSend from './pages/EmailSend';
import UploadDatabase from './pages/UploadDatabase';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './pages/ResetPassword';
import UsersManagement from './pages/UsersManagement';
import StudentsManagement from './pages/StudentsManagement';




export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
      
            <Route path="bejelentkezes" element={<Login />} />
            
            <Route path="regisztracio" element={<Register />} />
            <Route path="elfelejtJelszo" element={<ForgotPassword />} />


            <Route path="password-reset/:token" element={<ResetPassword/>} />
            <Route path="felhKezeles" element={<UsersManagement />}/>
            <Route path="diakKezeles" element={<StudentsManagement />}/>
            <Route path="emailKuldes" element={<EmailSend />}/>
            <Route path="abFeltoltes" element={ <UploadDatabase />}/>
            <Route path="kezdolap" element={<HomePage />}/>


            {/* EZEKET NE TÖRÖLD KI!*/}
            {/* csak a bejelentkezett felhasználók érhessék el azokat az oldalakat, 
            amelyekhez autentikáció szükséges (pl. adminoldal, főoldal). 
            Ezzel egy vendég automatikusan visszairányításra kerül a bejelentkezési oldalra, 
            ha próbál hozzáférni egy privát oldalhoz. */}
            {/*<Route path="adminOldal" element={<PrivateRoute> <AdminPage /> </PrivateRoute>} />
            <Route path="emailKuldes" element={<PrivateRoute> <EmailSend /> </PrivateRoute>} />
            <Route path="abFeltoltes" element={<PrivateRoute> <UploadDatabase /> </PrivateRoute>} />
            <Route path="kezdolap" element={<PrivateRoute> <HomePage /> </PrivateRoute>} />*/}

    </Routes>
  );
}