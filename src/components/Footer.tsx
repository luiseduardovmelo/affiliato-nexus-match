
const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-brand-accent to-brand-success rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">iG</span>
            </div>
            <span className="text-sm">iGaming Connect</span>
          </div>
          
          <div className="text-sm text-gray-300">
            <p>&copy; 2024 iGaming Connect. Todos os direitos reservados.</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-gray-400">
              Conectando Operadores e Afiliados
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
