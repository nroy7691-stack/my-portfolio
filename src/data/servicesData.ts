import { 
  Building2, 
  UtensilsCrossed, 
  Gem, 
  Briefcase, 
  Layout, 
  RefreshCw,
  ShoppingBag,
  Smartphone,
  Globe,
  ShieldCheck,
  Zap,
  Code,
  Layers,
  Sparkles,
  Palette,
  Rocket,
  BarChart3,
  Search,
  MessageSquare,
  CheckCircle2,
  Cpu,
  Server,
  Wrench,
  Monitor
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  icon?: any;
  features: string[];
}

export const SERVICE_ICONS: Record<string, any> = {
  Building2,
  UtensilsCrossed,
  Gem,
  Briefcase,
  Layout,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  Globe,
  ShieldCheck,
  Zap,
  Code,
  Layers,
  Sparkles,
  Palette,
  Rocket,
  BarChart3,
  Search,
  MessageSquare,
  CheckCircle2,
  Cpu,
  Server,
  Wrench,
  Monitor
};

export const AVAILABLE_ICON_NAMES = Object.keys(SERVICE_ICONS);

export function getServiceIcon(iconName: string) {
  return SERVICE_ICONS[iconName] || Building2;
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

const SERVICES_STORAGE_KEY = 'enjel_services_list';

export function getStoredServices(): ServiceItem[] {
  try {
    const saved = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => ({
          ...item,
          icon: getServiceIcon(item.iconName)
        }));
      }
    }
  } catch (err) {
    console.error('Failed reading services from storage:', err);
  }
  return servicesData;
}

export function saveStoredServices(services: ServiceItem[]): void {
  try {
    const cleanList = services.map(({ icon, ...rest }) => rest);
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(cleanList));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('services_updated'));
    }
  } catch (err) {
    console.error('Failed saving services to storage:', err);
  }
}

export async function fetchServicesFromSupabase(): Promise<ServiceItem[]> {
  const localServices = getStoredServices();
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      const remoteServices: ServiceItem[] = data.map((item: any) => ({
        id: item.id || `service-${Date.now()}`,
        title: item.title || 'Untitled Service',
        description: item.description || '',
        iconName: item.icon_name || item.iconName || 'Building2',
        icon: getServiceIcon(item.icon_name || item.iconName || 'Building2'),
        features: Array.isArray(item.features) 
          ? item.features 
          : typeof item.features === 'string' 
            ? item.features.split(',').map((f: string) => f.trim()) 
            : []
      }));
      saveStoredServices(remoteServices);
      return remoteServices;
    }
  } catch (err) {
    console.warn('Supabase services fetch fallback to local:', err);
  }
  return localServices;
}

export async function syncServicesToSupabase(services: ServiceItem[]): Promise<{ success: boolean; error?: string }> {
  // Always update local state first for immediate UI updates
  saveStoredServices(services);

  try {
    const payload = services.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon_name: s.iconName,
      features: s.features
    }));

    const { error } = await supabase
      .from('services')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase services upsert notice:', error.message);
      return { success: true, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase services upsert exception:', err);
    return { success: true };
  }
}

