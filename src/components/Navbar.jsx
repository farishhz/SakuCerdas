export default function Navbar({ routes, currentPage, onCommandOpen }) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a className="brand" href="#/">
          Future-Ready
        </a>
        <nav className="nav-links">
          {routes.map((route) => (
            <a
              key={route.key}
              href={route.path}
              className={currentPage === route.key ? 'active' : ''}
            >
              {route.label}
            </a>
          ))}
        </nav>
        <button className="cmd-button" onClick={onCommandOpen}>
          Ctrl+K
        </button>
      </div>
    </header>
  );
}
