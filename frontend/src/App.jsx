import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './landing_page/home/HomePage';
import Navbar from './landing_page/Navbar';
import AboutPage from './landing_page/about/AboutPage';
import SignupPage from './landing_page/signup/SignupPage';
import ProductsPage from './landing_page/products/ProductsPage';
import PricingPage from './landing_page/pricing/PricingPage';
import SupportPage from './landing_page/support/SupportPage';
import Footer from './landing_page/Footer';
import NotFound from './landing_page/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/pricing' element={<PricingPage />} />
        <Route path='/support' element={<SupportPage />} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
