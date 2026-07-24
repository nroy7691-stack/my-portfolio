import { 
  Building2, 
  UtensilsCrossed, 
  Gem, 
  Briefcase, 
  Layout, 
  RefreshCw 
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  icon: any;
  features: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'business-website',
    title: 'Business Website',
    description: 'Professional websites for businesses that want to build credibility and attract customers online.',
    iconName: 'Building2',
    icon: Building2,
    features: [
      'Custom Corporate Branding',
      'Lead Generation Forms',
      'Service Showcase Pages',
      'SEO & Speed Optimized'
    ]
  },
  {
    id: 'restaurant-website',
    title: 'Restaurant Website',
    description: 'Modern restaurant websites with menu presentation, location information and customer contact options.',
    iconName: 'UtensilsCrossed',
    icon: UtensilsCrossed,
    features: [
      'Interactive Digital Menus',
      'Table Reservation Links',
      'Google Maps Integration',
      'Mobile-Friendly View'
    ]
  },
  {
    id: 'jewellery-website',
    title: 'Jewellery Website',
    description: 'Premium jewellery websites designed to showcase products and build customer trust.',
    iconName: 'Gem',
    icon: Gem,
    features: [
      'High-Resolution Gallery',
      'Elegant Product Displays',
      'Trust Badges & Testimonials',
      'Direct WhatsApp Inquiry'
    ]
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'Personal and professional portfolio websites designed to showcase skills, services and previous work.',
    iconName: 'Briefcase',
    icon: Briefcase,
    features: [
      'Interactive Project Showcase',
      'Skills & Resume Integration',
      'Client Inquiry Form',
      'Fast Static Deployment'
    ]
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'High-converting landing pages designed for products, services, campaigns and promotions.',
    iconName: 'Layout',
    icon: Layout,
    features: [
      'Clear Call-To-Actions',
      'A/B Structure Optimization',
      'Mobile Touch Ready',
      'Fast Load Time'
    ]
  },
  {
    id: 'website-redesign',
    title: 'Website Redesign',
    description: 'Modern redesigns that improve the visual appearance, user experience and mobile responsiveness of existing websites.',
    iconName: 'RefreshCw',
    icon: RefreshCw,
    features: [
      'Modern Visual Overhaul',
      'Improved Mobile Layout',
      'Faster Page Speed',
      'Better User Flow'
    ]
  }
];
