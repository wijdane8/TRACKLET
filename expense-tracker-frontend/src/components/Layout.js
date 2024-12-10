import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="app-container">

      <main className="main-content">
        {children} {/* This will render the specific page content */}
      </main>
    </div>
  );
};

export default Layout;
