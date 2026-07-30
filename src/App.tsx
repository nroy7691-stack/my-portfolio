import React, { useState, useEffect } from 'react';
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
import { AdminPanel } from './components/AdminPanel';
import { ShieldCheck } from 'lucide-react';
import { getThemeConfig, applyThemeConfig, getLocalThemeConfig } from './lib/supabase';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Apply local stored theme immediately for zero flash
    applyThemeConfig(getLocalThemeConfig());

    // Fetch latest theme from Supabase
    getThemeConfig().then((config) => {
      applyThemeConfig(config);
    });

    const handleThemeUpdate = () => {
      applyThemeConfig(getLocalThemeConfig());
    };

    window.addEventListener('theme_config_updated', handleThemeUpdate);
    return () => window.removeEventListener('theme_config_updated', handleThemeUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white relative">
      {/* Sticky Navigation */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

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
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Admin Quick Access Badge */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white border border-slate-700 shadow-xl flex items-center gap-2 text-xs font-semibold transition-all duration-200 hover:scale-105 group"
        title="Open Supabase Admin Panel (Default Passcode: admin123)"
      >
        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
        <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
        <span>Admin Panel</span>
      </button>

      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </div>
  );
}

