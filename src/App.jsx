import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Header from './components/Header';
import Projects from './pages/Projects';
import Footer from './components/Footer';
import Page404 from './pages/Page404';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import NewProject from './pages/NewPoject';
import { AuthProvider } from './contexts/Auth';

function App() {

  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path='project' element={<NewProject />} />
        <Route path='projects' element={<Projects />} />
        <Route path='login' element={<Login />} />
        <Route path='logout' element={<Logout />} />
        <Route path='register' element={<Register />} />

        <Route path='*' element={<Page404 />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App