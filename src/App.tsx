import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from '@/components/Navbar';
import Cursor from '@/components/Cursor';
import HomePage from '@/pages/HomePage';
import GalleryPage from '@/pages/GalleryPage';

type Page = 'home' | 'gallery';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TooltipProvider>
      <Toaster />
      <div className="bg-noir min-h-screen">
        <Cursor />
        <Navbar currentPage={currentPage} onNavigate={navigate} />
        {currentPage === 'home' && <HomePage onNavigate={navigate} />}
        {currentPage === 'gallery' && <GalleryPage />}
      </div>
    </TooltipProvider>
  );
};

export default App;
