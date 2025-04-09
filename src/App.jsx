import { Route, Routes, Navigate } from 'react-router';
import { useContext } from 'react';
import Home from './pages/Home';
import Header from './components/Header';
import Projects from './pages/Projects';
import Footer from './components/Footer';
import Page404 from './pages/Page404';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Admin from './pages/Admin';
import { AuthContext, AuthProvider } from './contexts/Auth';
import NewProject from './pages/NewProject';

function AppRoutes() {
  const { user } = useContext(AuthContext);
  
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path='project' element={<NewProject />} />
      <Route path='projects' element={<Projects />} />
      <Route path='login' element={<Login />} />
      <Route path='logout' element={<Logout />} />
      <Route path='register' element={<Register />} />
      <Route path='admin' element={
        user?.role === 'admin' ? <Admin /> : <Navigate to="/login" />
      } />
      <Route path='*' element={<Page404 />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Header />
      <AppRoutes />
      <Footer />
    </AuthProvider>
  );
}

export default App;