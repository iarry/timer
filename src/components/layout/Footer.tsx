import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {year} HIIT Timer App</p>
      </div>
    </footer>
  );
};

export default Footer;
