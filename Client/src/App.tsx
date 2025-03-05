import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './Pages/SignIn/signIn';
import Register from './Pages/Register/register';
import NotFound from './Pages/Notfound/notFound';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Pages/Home/home';
import ForgotPassword from './Pages/Forgotpassword/forgotPassword';
import AdminPortalHome from './Pages/AdminPortalHome/adminPortalHome';
import theme from './Themes/theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <ToastContainer 
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path='/' element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-portal" element={<AdminPortalHome />} />
        <Route path='/home' element={<Home />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default App;
