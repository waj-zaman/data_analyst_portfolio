import React, { useState } from "react";
import { Link } from "react-router-dom";
import dataAnalytics from "../assets/monitor.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-base-200 shadow-md px-6 py-0">
      <div className="navbar flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold text-primary">
            <img className="w-12" src={dataAnalytics} alt="Logo" />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-xl gap-10 font-lato font-bold">
            <li><Link to="/projects">Dashboards</Link></li>
            <li><Link to="/websites">Websites</Link></li>
            <li><Link to="/blogs">Blog</Link></li>
            <li><Link to="/">Home</Link></li>
          </ul>
        </div>

        {/* Mobile Burger Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost btn-square"
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-base-100 shadow-lg z-50">
          <ul className="menu p-4 space-y-2 text-lg font-lato font-bold">
            <li>
              <Link to="/projects" onClick={() => setIsOpen(false)}>Projects</Link>
            </li>
            <li>
              <Link to="/blogs" onClick={() => setIsOpen(false)}>Blog</Link>
            </li>
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
