/**
 * ENJEL WEB DESIGN / NJs WEB DESIGN
 * Site Configuration & Contact Settings
 * 
 * You can easily edit your business details, contact information, and WhatsApp number here.
 */

export interface SiteConfig {
  brandName: string;
  logoText: string;
  tagline: string;
  whatsappNumber: string; // International format without '+' or spaces, e.g. "919876543210" or "YOUR_WHATSAPP_NUMBER"
  phone: string;
  email: string;
  location: string;
  socialLinks: {
    whatsapp?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    dribbble?: string;
  };
}

export const siteConfig: SiteConfig = {
  // Brand details
  brandName: "NJs WEB DESIGN",
  logoText: "ENJEL WEB DESIGN",
  tagline: "Professional Websites That Help Your Business Grow",

  // Contact Information
  // IMPORTANT: Set WHATSAPP_NUMBER to your WhatsApp number in international format without '+' or spaces.
  // Example: "919876543210"
  whatsappNumber: "YOUR_WHATSAPP_NUMBER", // Replace with your real WhatsApp number e.g. "919876543210"
  
  phone: "+1 (555) 019-2834", // Replace with your phone number
  email: "contact@enjelwebdesign.com", // Replace with your email address
  location: "Available Worldwide / Remote",

  socialLinks: {
    instagram: "https://instagram.com/enjelwebdesign",
    linkedin: "https://linkedin.com/company/enjelwebdesign",
    twitter: "https://twitter.com/enjelwebdesign",
    github: "https://github.com/enjelwebdesign",
    dribbble: "https://dribbble.com/enjelwebdesign",
  },
};
