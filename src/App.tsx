import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Process } from './components/Process';
import { WhyChooseMe } from './components/WhyChooseMe';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <WhyChooseMe />
        <Testimonials />
        <Contact />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
