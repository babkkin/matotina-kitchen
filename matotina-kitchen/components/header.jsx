"use client";

import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 13) {
      setClickCount(0);
      window.location.href = "/admin-13/login";
    }
  };

  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <h1
          className="text-xl text-slate-800 font-bold cursor-pointer select-none"
          onClick={handleTitleClick}
        >
          Matotina&apos;s Kitchen
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-slate-800 font-bold">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden mt-4 flex flex-col gap-4">
          <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#services" onClick={() => setIsOpen(false)}>Services</a>
          <a href="#menu" onClick={() => setIsOpen(false)}>Menu</a>
          <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
        </nav>
      )}
    </header>
  );
}