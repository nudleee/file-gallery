import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider/AuthProvider';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<HomePage></HomePage>} />
            <Route path="login" element={<LoginPage></LoginPage>} />
            <Route path="register" element={<RegisterPage></RegisterPage>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
