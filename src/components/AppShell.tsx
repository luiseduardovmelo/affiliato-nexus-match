
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AppShell = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default AppShell;
