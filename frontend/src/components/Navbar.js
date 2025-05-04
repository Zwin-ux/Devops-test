import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/products" className="font-bold text-2xl tracking-tight">☁️ CloudShop</Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/products" className="hover:text-blue-200 transition duration-200 font-medium">Products</Link>
            <Link to="/orders" className="hover:text-blue-200 transition duration-200 font-medium">Orders</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-blue-700 transition duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </Link>
          <div className="border-l border-blue-500 h-8 mx-2"></div>
          <Link to="/login" className="hover:text-blue-200 transition duration-200 font-medium">Login</Link>
          <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition duration-200">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
