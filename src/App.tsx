import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';
import { ToastContainer } from '@/components/ui/Toast';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0B0B0F] text-[#F5F5F7] font-sans antialiased overflow-x-hidden selection:bg-[#FF6B00] selection:text-white">
        <AppRoutes />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
