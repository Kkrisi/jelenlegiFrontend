import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EmailSend from './pages/EmailSend';
import UploadDatabase from './pages/UploadDatabase';
import ResetPassword from './pages/ResetPassword';
import UsersManagement from './pages/UsersManagement';
import StudentsManagement from './pages/StudentsManagement';
import Logs from './pages/Logs';
import PermissionDenied from './pages/PermissionDenied';
import Layout from './layouts/Layout';
//import ProtectedRoute from './components/ProtectedRoute';
import useAuthContext from './contexts/AuthContext';



export default function App() {
  const { user, loading } = useAuthContext();

  // Ha nincs bejelentkezett felhasználó, akkor nem jelenik meg a loading
  //console.log("lodaing és user", loading, user)
  /*if (loading && user !== null) {
    // Ha még töltődnek az adatok, mutathatunk egy loader-t
    return <div>Oldal betöltése... ⚙🛠🔄</div>;
  }*/



  // amig toltodik az oldal
  if (loading) {
    return (
      <div className='loading-body'>
        <div className="center-loader">
          Oldal betöltése... ⚙🛠🔄
        </div>
      </div>
    );
  }


  return (
    <Routes>
      {/* Vendégek számára elérhető oldalak */}
      {!user ? (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/bejelentkezes" element={<Login />} />
          <Route path="/regisztracio" element={<Register />} />
          <Route path="/elfelejtJelszo" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
          {/* Ha valaki egy védett oldalra próbál menni, átdobjuk a bejelentkezésre */}
          <Route path="*" element={<Navigate to="/bejelentkezes" />} />
        </>
      ) : (
        /* Bejelentkezett felhasználók, Layout kezeli az admin/user szerepkört */
        <Route element={<Layout />}>
          <Route path="/emailKuldes" element={<EmailSend />} />
          <Route path="/naplozas" element={<Logs />} />
          <Route path="/diakKezeles" element={<StudentsManagement />} />
          <Route path="/abFeltoltes" element={<UploadDatabase />} />

          {/* Csak admin számára elérhető oldal */}
          {user.jogosultsag_azon === 2 ? (
            <Route path="/felhKezeles" element={<UsersManagement />} />
          ) : (
            <Route path="/felhKezeles" element={<Navigate to="/permissiondenied" />} />
          )}

          {/* Ha egy érvénytelen útvonalra próbál menni, dobjuk az email oldalra */}
          <Route path="*" element={<Navigate to="/emailKuldes" />} />
        </Route>
      )}

      {/* Jogosultság nélküli hozzáférés esetén */}
      <Route path="/permissiondenied" element={<PermissionDenied />} />
    </Routes>
  );
}


/*

<Routes>
      <Route path="/" element={<Login />} />
      <Route path="/bejelentkezes" element={<Login />} />
      <Route path="/regisztracio" element={<Register />} />
      <Route path="/elfelejtJelszo" element={<ForgotPassword />} />
      <Route path="/password-reset/:token" element={<ResetPassword />} />
  
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/emailKuldes" element={<EmailSend />} />
          <Route path="/naplozas" element={<Logs />} />
          <Route path="/diakKezeles" element={<StudentsManagement />} />
          <Route path="/abFeltoltes" element={<UploadDatabase />} />
        </Route>
      </Route>
  
      <Route element={<ProtectedRoute roleRequired={2} />}>
        <Route element={<Layout />}>
          <Route path="/felhKezeles" element={<UsersManagement />} />
        </Route>
      </Route>

      <Route path="/permissiondenied" element={<PermissionDenied />} />
    </Routes>

*/
