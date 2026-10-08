import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';
import { ToastContainer } from '@/components/ui/Toast';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FFFFFF] text-[#1F2937] font-sans antialiased overflow-x-hidden selection:bg-[#C2410C] selection:text-white">
        <AppRoutes />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
