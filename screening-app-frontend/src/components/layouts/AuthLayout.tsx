import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="text-3xl font-bold">
            ScreenRx
          </Link>
        </div>
        <Outlet /> {/* Login/Signup form will render here */}
      </div>
      <footer className="py-4 text-center text-sm text-muted-foreground mt-8">
        © {new Date().getFullYear()} ScreenRx. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
