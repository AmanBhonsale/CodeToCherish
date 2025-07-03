import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming Navbar is in the same directory

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet /> {/* Child routes will render here */}
      </main>
      <footer className="bg-background border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ScreenRx. All rights reserved.
      </footer>
    </div>
  );
};

export default RootLayout;
