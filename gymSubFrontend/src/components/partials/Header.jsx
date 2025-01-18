const Header = ({ links }) => {
    return (
      <header className="main-header">
        <div className="logo">
          <a href="/home">Home</a>
        </div>
        <nav className="main-nav">
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <a href={link.path}>{link.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    );
  };

  export default Header