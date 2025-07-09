
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Users, Star, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CreditBalance from '@/components/CreditBalance';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    console.log('🚪 Header: Starting logout process...');
    const { error } = await logout();
    
    if (error) {
      console.error('❌ Logout error:', error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    } else {
      console.log('✅ Logout successful');
      toast({
        title: "Logout realizado!",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/home');
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-primary">
              iGaming Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/')
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Parceiros</span>
            </Link>

            <Link
              to="/destaques"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/destaques')
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Destaques</span>
            </Link>

            <Link
              to="/perfil"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/perfil')
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </Link>

            <div className="px-3 py-2">
              <CreditBalance compact />
            </div>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/')
                    ? 'text-brand-primary bg-brand-primary/10'
                    : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                <span>Parceiros</span>
              </Link>

              <Link
                to="/destaques"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/destaques')
                    ? 'text-brand-primary bg-brand-primary/10'
                    : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="w-4 h-4" />
                <span>Destaques</span>
              </Link>

              <Link
                to="/perfil"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/perfil')
                    ? 'text-brand-primary bg-brand-primary/10'
                    : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Perfil</span>
              </Link>

              <div className="px-3 py-2">
                <CreditBalance compact />
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
