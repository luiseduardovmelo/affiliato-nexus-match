
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Lista from "./pages/Lista";
import Destaques from "./pages/Destaques";
import Perfil from "./pages/Perfil";
import ProfilePage from "./pages/ProfilePage";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/" element={<AppShell />}>
                <Route index element={<Lista />} />
                <Route path="destaques" element={<Destaques />} />
                <Route path="lista" element={<Lista />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="profile/:id" element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
);

export default App;
