import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import { Route, Routes } from "react-router-dom";
import EmailSend from './pages/EmailSend';
import UploadDatabase from './pages/UploadDatabase';
import ResetPassword from './pages/ResetPassword';
import UsersManagement from './pages/UsersManagement';
import StudentsManagement from './pages/StudentsManagement';
import Logs from './pages/Logs';
import AdminPage from './pages/AdminPage';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthContext from './contexts/AuthContext'; // Import the custom hook

export default function App() {
  const { user } = useAuthContext(); // Use the custom hook to get the user object
  const userRole = user ? user.role : null; // Assuming `role` is a property of the user object

  return (
    <Routes>

      {/* mindenki számára elérhető */}
      <Route path="/" element={<Login />} />
      <Route path="/bejelentkezes" element={<Login />} />
      <Route path="/regisztracio" element={<Register />} />
      <Route path="/elfelejtJelszo" element={<ForgotPassword />} />
      <Route path="/password-reset/:token" element={<ResetPassword />} />

      {/* bejelentkezett felhasználók */}
      <Route element={<ProtectedRoute userRole={userRole}/>}>
        <Route element={<Layout />}>
          <Route path="/emailKuldes" element={<EmailSend />} />
          <Route path="/naplozas" element={<Logs />} />
          <Route path="/diakKezeles" element={<StudentsManagement />} />
          <Route path="/abFeltoltes" element={<UploadDatabase />} />
        </Route>
      </Route>

      {/* csak az admin */}
      <Route element={<ProtectedRoute userRole={userRole}/>}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/felhKezeles" element={<UsersManagement />} />
        </Route>
      </Route>

    </Routes>
  );
}
