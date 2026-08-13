import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from './ChatWidget';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default AppLayout;
