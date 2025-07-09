
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/hooks/useAuth';

const AppShell = () => {
  const { user, loading } = useAuth();
  
  console.log('🏠 AppShell: Checking authentication', { 
    hasUser: !!user, 
    userEmail: user?.email, 
    loading 
  });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log('🚫 AppShell: No user found, redirecting to home');
    return <Navigate to="/home" replace />;
  }
  
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
