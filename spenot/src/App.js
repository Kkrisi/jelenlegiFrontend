import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EmailSend from './pages/EmailSend';
import UploadDatabase from './pages/UploadDatabase';
import ResetPassword from './pages/ResetPassword';
import UsersManagement from './pages/UsersManagement';
import StudentsManagement from './pages/StudentsManagement';
import Logs from './pages/Logs';
import AdminPage from './pages/AdminPage';
import PermissionDenied from './pages/PermissionDenied';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* mindenki számára elérhető */}
      <Route path="/" element={<Login />} />
      <Route path="/bejelentkezes" element={<Login />} />
      <Route path="/regisztracio" element={<Register />} />
      <Route path="/elfelejtJelszo" element={<ForgotPassword />} />
      <Route path="/password-reset/:token" element={<ResetPassword />} />
  
      {/* bejelentkezett felhasználók */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/emailKuldes" element={<EmailSend />} />
          <Route path="/naplozas" element={<Logs />} />
          <Route path="/diakKezeles" element={<StudentsManagement />} />
          <Route path="/abFeltoltes" element={<UploadDatabase />} />
        </Route>
      </Route>
  
      {/* csak az admin */}
      <Route element={<ProtectedRoute roleRequired={2} />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/felhKezeles" element={<UsersManagement />} />
        </Route>
      </Route>

      {/* Permission Denied */}
      <Route path="/permissiondenied" element={<PermissionDenied />} />
    </Routes>
  );
}
