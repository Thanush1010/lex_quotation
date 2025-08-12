import React from 'react';

const Footer = () => (
  <footer className="bg-black text-white py-8 mt-16 w-full">
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold mb-2">Lextria</h2>
        <div className="mb-2 text-base">Effortless Patent Document Automation</div>
        <div className="text-sm flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          <span>© {new Date().getFullYear()} Lextria. All rights reserved.</span>
          <span className="hidden md:inline">|</span>
          <a href="#contact" className="underline hover:text-white">Contact Us</a>
        </div>
      </div>
    </footer>
  );

export default Footer;
