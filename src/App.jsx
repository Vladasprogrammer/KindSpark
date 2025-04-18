import { Route, Routes, Navigate } from 'react-router';
import { AuthProvider } from './contexts/Auth';

import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Page404 from './pages/Page404';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Stories from './pages/Stories';
import NewStory from './pages/NewStory';
import { DataProvider } from './contexts/Data';

export default function App() {

  return (
    <AuthProvider>
      <DataProvider>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='new-story' element={<NewStory />} />
          <Route path='stories' element={<Stories />} />
          <Route path='login' element={<Login />} />
          <Route path='logout' element={<Logout />} />
          <Route path='register' element={<Register />} />
          {/* <Route path='admin' element={
          user?.role === 'admin' ? <Admin /> : <Navigate to="/login" />
        } /> */}
          <Route path='*' element={<Page404 />} />
        </Routes>
        <Footer />
      </DataProvider>
    </AuthProvider>
  );
}