import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home/Home';
import Register from './pages/Auth/Register/Register';
import Login from './pages/Auth/Login/Login';
import Welcome from './pages/Welcome/Welcome';
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword';
import VerifyCode from './pages/Auth/VerifyCode/VerifyCode';
import NewPassword from './pages/Auth/NewPassword/NewPassword';
import RegisterVerify from './pages/Auth/RegisterVerify/RegisterVerify';
import './App.scss';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userData');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-verify" element={<RegisterVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/new-password" element={<NewPassword />} />
      </Routes>
    </div>
  );
}

export default App;
