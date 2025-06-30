
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Simulating authenticated user - in real app this would come from auth context
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Lista', path: '/lista' },
    { label: 'Perfil', path: '/perfil' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  // Header para usuário não logado - apenas logo
  if (!isLoggedIn) {
    return (
      <header className="bg-brand-primary shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            {/* Logo centralizado */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-accent to-brand-success rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">iG</span>
              </div>
              <span className="text-white font-bold text-xl">
                iGaming Connect
              </span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Header para usuário logado (com navegação completa)
  return (
    <header className="bg-brand-primary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-accent to-brand-success rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">iG</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              iGaming Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-white transition-all duration-200 hover:text-brand-accent relative py-2 ${
                  isActivePath(item.path)
                    ? 'text-brand-accent border-b-2 border-brand-accent'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Button & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleAuthClick}
              className="bg-brand-success hover:bg-brand-accent text-white transition-colors duration-200"
            >
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-2"
              aria-label="Toggle mobile menu"
            >
              <div className="space-y-1">
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <div
                  className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-primary border-t border-brand-accent/20 animate-slide-down">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-white transition-all duration-200 hover:bg-brand-accent/10 hover:text-brand-accent ${
                    isActivePath(item.path)
                      ? 'text-brand-accent bg-brand-accent/10 border-l-4 border-brand-accent'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
