import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Wordmark } from './Wordmark';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/tours', label: 'Tours' },
  { to: '/#destinations', label: 'Destinations' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goToTours = () => {
    setMenuOpen(false);
    navigate('/tours');
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Wordmark />

        <nav className="site-nav" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="site-nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <Button type="primary" shape="round" size="large" onClick={goToTours}>
            Browse tours
          </Button>
        </div>

        <Button
          className="site-header__menu"
          type="text"
          size="large"
          icon={<MenuOutlined />}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        />
      </div>

      <Drawer
        title="Menu"
        placement="right"
        width={320}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <nav className="mobile-nav" aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="mobile-nav__link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/tours" className="mobile-nav__link" onClick={() => setMenuOpen(false)}>
            Browse all tours
          </Link>
        </nav>
      </Drawer>
    </header>
  );
}
