import { useLocation } from "react-router";
import { HIDE_FOOTER_PATHS } from '../constants/main';

function Footer() {

  const { pathname } = useLocation();

  if (HIDE_FOOTER_PATHS.includes(pathname)) {
    return null;
  }
  
  return (
    <footer className='footer'>
      <p>&copy; 2025 KindSpark Fake Website</p>
    </footer>
  );
}

export default Footer;
