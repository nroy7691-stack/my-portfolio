import { createClient } from '@supabase/supabase-js';

// Sanitize and validate URL input
function getValidSupabaseUrl(): string {
  const fallbackUrl = 'https://vgtvzesvjtioyvzbijfn.supabase.co';
  try {
    const envUrl = import.meta.env?.VITE_SUPABASE_URL;
    if (typeof envUrl === 'string') {
      const cleanUrl = envUrl.trim().replace(/^["']|["']$/g, '');
      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        return cleanUrl;
      }
    }
  } catch (e) {
    console.warn('Error reading VITE_SUPABASE_URL from env:', e);
  }
  return fallbackUrl;
}

function getValidSupabaseKey(): string {
  const fallbackKey = 'sb_publishable_lfpO-wDnJRLSu6r8B5LEWg_-O9ViZNJ';
  try {
    const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
    if (typeof envKey === 'string') {
      const cleanKey = envKey.trim().replace(/^["']|["']$/g, '');
      if (cleanKey.length > 0) {
        return cleanKey;
      }
    }
  } catch (e) {
    console.warn('Error reading VITE_SUPABASE_ANON_KEY from env:', e);
  }
  return fallbackKey;
}

const SUPABASE_URL = getValidSupabaseUrl();
const SUPABASE_ANON_KEY = getValidSupabaseKey();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface CustomerSubmission {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  message: string;
  status?: string;
}

/**
 * Saves customer inquiry to Supabase database ('submissions' table).
 */
export async function saveCustomerSubmission(data: {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}): Promise<{ success: boolean; error?: string; data?: any }> {
  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    project_type: data.projectType,
    message: data.message,
    created_at: new Date().toISOString(),
    status: 'new'
  };

  try {
    // Primary attempt without .select() so RLS SELECT restriction won't block unauthenticated INSERTs
    let response = await supabase.from('submissions').insert([payload]);

    if (response.error) {
      console.warn('First insert attempt into public.submissions warning:', response.error.message);
      // Secondary attempt with minimal fields in case optional defaults cause issues
      const minimalPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        project_type: data.projectType,
        message: data.message
      };
      response = await supabase.from('submissions').insert([minimalPayload]);
    }

    if (response.error) {
      console.error('Inserting into public.submissions error:', response.error.message);
      return {
        success: false,
        error: response.error.message
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (err: any) {
    console.error('Supabase submission exception:', err);
    return {
      success: false,
      error: err.message || 'Failed to save submission to Supabase'
    };
  }
}

/**
 * Retrieves stored customer submissions from Supabase.
 */
export async function getCustomerSubmissions(): Promise<CustomerSubmission[]> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions from public.submissions:', error.message);
      return [];
    }

    return (data as CustomerSubmission[]) || [];
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return [];
  }
}

/**
 * Updates status of an inquiry in Supabase.
 */
export async function updateInquiryStatus(id: string, newStatus: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating submission status:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error updating inquiry status:', err);
    return false;
  }
}

/**
 * Deletes an inquiry record from Supabase.
 */
export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting submission:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return false;
  }
}

export interface HeroConfig {
  id?: string;
  badge_text: string;
  title: string;
  subtitle: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  hero_image?: string;
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  id: 'default',
  badge_text: 'Modern Web Design & Strategy',
  title: 'Professional Websites That Help Your Business Grow',
  subtitle: 'I design fast, modern, and professional websites that help businesses build trust, attract customers, and grow online.',
  primary_button_text: 'Start Your Project',
  primary_button_link: '#contact',
  secondary_button_text: 'View My Work',
  secondary_button_link: '#portfolio',
  hero_image: ''
};

const HERO_STORAGE_KEY = 'enjel_hero_config';

export function getLocalHeroConfig(): HeroConfig {
  try {
    const saved = localStorage.getItem(HERO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.title) {
        return { ...DEFAULT_HERO_CONFIG, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Failed reading hero config from localStorage:', e);
  }
  return DEFAULT_HERO_CONFIG;
}

export async function getHeroConfig(): Promise<HeroConfig> {
  const local = getLocalHeroConfig();
  try {
    const { data, error } = await supabase
      .from('hero_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!error && data && data.title) {
      const remoteConfig: HeroConfig = {
        id: data.id || 'default',
        badge_text: data.badge_text || DEFAULT_HERO_CONFIG.badge_text,
        title: data.title || DEFAULT_HERO_CONFIG.title,
        subtitle: data.subtitle || DEFAULT_HERO_CONFIG.subtitle,
        primary_button_text: data.primary_button_text || DEFAULT_HERO_CONFIG.primary_button_text,
        primary_button_link: data.primary_button_link || DEFAULT_HERO_CONFIG.primary_button_link,
        secondary_button_text: data.secondary_button_text || DEFAULT_HERO_CONFIG.secondary_button_text,
        secondary_button_link: data.secondary_button_link || DEFAULT_HERO_CONFIG.secondary_button_link,
        hero_image: data.hero_image || ''
      };
      localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(remoteConfig));
      return remoteConfig;
    }
  } catch (err) {
    console.warn('Supabase hero_config fetch fallback to local:', err);
  }
  return local;
}

export async function saveHeroConfig(config: HeroConfig): Promise<{ success: boolean; error?: string }> {
  const fullConfig: HeroConfig = {
    id: 'default',
    ...config
  };

  try {
    localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(fullConfig));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hero_config_updated'));
    }
  } catch (e) {
    console.error('Failed to update localStorage for hero config:', e);
  }

  try {
    const payload = {
      id: 'default',
      badge_text: fullConfig.badge_text,
      title: fullConfig.title,
      subtitle: fullConfig.subtitle,
      primary_button_text: fullConfig.primary_button_text,
      primary_button_link: fullConfig.primary_button_link,
      secondary_button_text: fullConfig.secondary_button_text,
      secondary_button_link: fullConfig.secondary_button_link,
      hero_image: fullConfig.hero_image || '',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('hero_config')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert into hero_config warning:', error.message);
      return { success: true, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase hero_config save exception:', err);
    return { success: true };
  }
}

export interface AboutConfig {
  id?: string;
  tag_text: string;
  title: string;
  description: string;
  experience: string;
  speciality: string;
  target_clients: string;
  skills: string[];
  profile_image: string;
}

export const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  id: 'default',
  tag_text: 'About Me',
  title: 'Crafting Modern Websites That Build Trust & Elevate Brands',
  description: 'I am a professional web designer dedicated to creating clean, modern, and high-converting websites for businesses, professionals, and entrepreneurs.\n\nIn today\'s digital world, your website is often the very first impression potential clients have of your business. I help you make that first impression unforgettable with an elegant presentation that communicates credibility, quality, and clarity.',
  experience: '5+ Years of Experience building high-converting websites',
  speciality: 'Custom Web Design & Strategy',
  target_clients: 'Businesses & Entrepreneurs',
  skills: [
    'Clean & Minimalist Web Design',
    'Mobile Responsive Optimization',
    'User Experience & Funnel Strategy',
    'Conversion Rate Optimization',
    'SEO & Fast Page Load Performance'
  ],
  profile_image: ''
};

const ABOUT_STORAGE_KEY = 'enjel_about_config';

export function getLocalAboutConfig(): AboutConfig {
  try {
    const saved = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.title) {
        return {
          ...DEFAULT_ABOUT_CONFIG,
          ...parsed,
          skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_ABOUT_CONFIG.skills
        };
      }
    }
  } catch (e) {
    console.warn('Failed reading about config from localStorage:', e);
  }
  return DEFAULT_ABOUT_CONFIG;
}

export async function getAboutConfig(): Promise<AboutConfig> {
  const local = getLocalAboutConfig();
  try {
    const { data, error } = await supabase
      .from('about_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!error && data && data.title) {
      const parsedSkills = Array.isArray(data.skills) 
        ? data.skills 
        : typeof data.skills === 'string'
          ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : DEFAULT_ABOUT_CONFIG.skills;

      const remoteConfig: AboutConfig = {
        id: data.id || 'default',
        tag_text: data.tag_text || DEFAULT_ABOUT_CONFIG.tag_text,
        title: data.title || DEFAULT_ABOUT_CONFIG.title,
        description: data.description || DEFAULT_ABOUT_CONFIG.description,
        experience: data.experience || DEFAULT_ABOUT_CONFIG.experience,
        speciality: data.speciality || DEFAULT_ABOUT_CONFIG.speciality,
        target_clients: data.target_clients || DEFAULT_ABOUT_CONFIG.target_clients,
        skills: parsedSkills,
        profile_image: data.profile_image || ''
      };
      localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(remoteConfig));
      return remoteConfig;
    }
  } catch (err) {
    console.warn('Supabase about_config fetch fallback to local:', err);
  }
  return local;
}

export async function saveAboutConfig(config: AboutConfig): Promise<{ success: boolean; error?: string }> {
  const fullConfig: AboutConfig = {
    id: 'default',
    ...config
  };

  try {
    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(fullConfig));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('about_config_updated'));
    }
  } catch (e) {
    console.error('Failed to update localStorage for about config:', e);
  }

  try {
    const payload = {
      id: 'default',
      tag_text: fullConfig.tag_text,
      title: fullConfig.title,
      description: fullConfig.description,
      experience: fullConfig.experience,
      speciality: fullConfig.speciality,
      target_clients: fullConfig.target_clients,
      skills: fullConfig.skills,
      profile_image: fullConfig.profile_image || '',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('about_config')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert into about_config warning:', error.message);
      return { success: true, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase about_config save exception:', err);
    return { success: true };
  }
}

export interface ContactConfig {
  id?: string;
  whatsapp_number: string;
  phone: string;
  email: string;
  address: string;
  google_map_link: string;
}

export const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  id: 'default',
  whatsapp_number: '917098090109',
  phone: '+91 70980 90109',
  email: 'nroy7691@gmail.com',
  address: 'Available Worldwide / Remote',
  google_map_link: 'https://maps.google.com/?q=Worldwide'
};

const CONTACT_STORAGE_KEY = 'enjel_contact_config';

export function getLocalContactConfig(): ContactConfig {
  try {
    const saved = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.whatsapp_number || parsed.phone || parsed.email)) {
        return {
          ...DEFAULT_CONTACT_CONFIG,
          ...parsed
        };
      }
    }
  } catch (e) {
    console.warn('Failed reading contact config from localStorage:', e);
  }
  return DEFAULT_CONTACT_CONFIG;
}

export async function getContactConfig(): Promise<ContactConfig> {
  const local = getLocalContactConfig();
  try {
    const { data, error } = await supabase
      .from('contact_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!error && data && (data.whatsapp_number || data.phone || data.email)) {
      const remoteConfig: ContactConfig = {
        id: data.id || 'default',
        whatsapp_number: data.whatsapp_number || DEFAULT_CONTACT_CONFIG.whatsapp_number,
        phone: data.phone || DEFAULT_CONTACT_CONFIG.phone,
        email: data.email || DEFAULT_CONTACT_CONFIG.email,
        address: data.address || DEFAULT_CONTACT_CONFIG.address,
        google_map_link: data.google_map_link || DEFAULT_CONTACT_CONFIG.google_map_link
      };
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(remoteConfig));
      return remoteConfig;
    }
  } catch (err) {
    console.warn('Supabase contact_config fetch fallback to local:', err);
  }
  return local;
}

export async function saveContactConfig(config: ContactConfig): Promise<{ success: boolean; error?: string }> {
  const fullConfig: ContactConfig = {
    id: 'default',
    ...config
  };

  try {
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(fullConfig));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('contact_config_updated'));
    }
  } catch (e) {
    console.error('Failed to update localStorage for contact config:', e);
  }

  try {
    const payload = {
      id: 'default',
      whatsapp_number: fullConfig.whatsapp_number,
      phone: fullConfig.phone,
      email: fullConfig.email,
      address: fullConfig.address,
      google_map_link: fullConfig.google_map_link || '',
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('contact_config')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert into contact_config warning:', error.message);
      return { success: true, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase contact_config save exception:', err);
    return { success: true };
  }
}

export interface WebsiteConfig {
  id?: string;
  website_name: string;
  logo_text: string;
  logo_subtext: string;
  logo_initial: string;
  logo_image_url?: string;
  footer_text: string;
  copyright_text: string;
  social_links: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    dribbble?: string;
    youtube?: string;
    facebook?: string;
  };
}

export interface ThemeConfig {
  id?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  card_color: string;
  button_color: string;
  font_family: string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  id: 'default',
  primary_color: '#2563EB',
  secondary_color: '#0F172A',
  background_color: '#FFFFFF',
  card_color: '#FFFFFF',
  button_color: '#2563EB',
  font_family: 'Plus Jakarta Sans'
};

const THEME_STORAGE_KEY = 'enjel_theme_config';

export function applyThemeConfig(theme: ThemeConfig) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  if (theme.primary_color) {
    root.style.setProperty('--color-primary', theme.primary_color);
  }
  if (theme.secondary_color) {
    root.style.setProperty('--color-secondary', theme.secondary_color);
  }
  if (theme.background_color) {
    root.style.setProperty('--color-bg', theme.background_color);
    document.body.style.backgroundColor = theme.background_color;
  }
  if (theme.card_color) {
    root.style.setProperty('--color-[#FFFFFF]', theme.card_color);
    root.style.setProperty('--color-card', theme.card_color);
  }
  if (theme.button_color) {
    root.style.setProperty('--color-button', theme.button_color);
  }

  if (theme.font_family) {
    const font = theme.font_family;
    root.style.setProperty('--font-family', `'${font}', sans-serif`);
    document.body.style.fontFamily = `'${font}', sans-serif`;

    const linkId = 'dynamic-google-font';
    let linkElem = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!linkElem) {
      linkElem = document.createElement('link');
      linkElem.id = linkId;
      linkElem.rel = 'stylesheet';
      document.head.appendChild(linkElem);
    }
    const fontQuery = font.replace(/\s+/g, '+');
    linkElem.href = `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@300;400;500;600;700;800;900&display=swap`;
  }
}

export function getLocalThemeConfig(): ThemeConfig {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.primary_color || parsed.font_family)) {
        return {
          ...DEFAULT_THEME_CONFIG,
          ...parsed
        };
      }
    }
  } catch (e) {
    console.warn('Failed reading theme config from localStorage:', e);
  }
  return DEFAULT_THEME_CONFIG;
}

export async function getThemeConfig(): Promise<ThemeConfig> {
  const local = getLocalThemeConfig();
  applyThemeConfig(local);

  try {
    const { data, error } = await supabase
      .from('theme_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!error && data && (data.primary_color || data.font_family)) {
      const remoteConfig: ThemeConfig = {
        id: data.id || 'default',
        primary_color: data.primary_color || DEFAULT_THEME_CONFIG.primary_color,
        secondary_color: data.secondary_color || DEFAULT_THEME_CONFIG.secondary_color,
        background_color: data.background_color || DEFAULT_THEME_CONFIG.background_color,
        card_color: data.card_color || DEFAULT_THEME_CONFIG.card_color,
        button_color: data.button_color || DEFAULT_THEME_CONFIG.button_color,
        font_family: data.font_family || DEFAULT_THEME_CONFIG.font_family
      };
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(remoteConfig));
      applyThemeConfig(remoteConfig);
      return remoteConfig;
    }
  } catch (err) {
    console.warn('Supabase theme_config fetch fallback to local:', err);
  }
  return local;
}

export async function saveThemeConfig(config: ThemeConfig): Promise<{ success: boolean; error?: string }> {
  const fullConfig: ThemeConfig = {
    id: 'default',
    ...config
  };

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(fullConfig));
    applyThemeConfig(fullConfig);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('theme_config_updated'));
    }
  } catch (e) {
    console.error('Failed to update localStorage for theme config:', e);
  }

  try {
    const payload = {
      id: 'default',
      primary_color: fullConfig.primary_color,
      secondary_color: fullConfig.secondary_color,
      background_color: fullConfig.background_color,
      card_color: fullConfig.card_color,
      button_color: fullConfig.button_color,
      font_family: fullConfig.font_family,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('theme_config')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert into theme_config warning:', error.message);
      return { success: true, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase theme_config save exception:', err);
    return { success: true };
  }
}

export const DEFAULT_WEBSITE_CONFIG: WebsiteConfig = {
  id: 'default',
  website_name: 'MS WEB STUDIO',
  logo_text: 'MS WEB STUDIO',
  logo_subtext: 'MS WEB STUDIO',
  logo_initial: 'M',
  logo_image_url: '/logo.png',
  footer_text: 'Professional websites designed to help businesses grow online.',
  copyright_text: '© 2026 MS WEB STUDIO. All rights reserved.',
  social_links: {
    instagram: 'https://instagram.com/mswebstudio',
    linkedin: 'https://linkedin.com/company/mswebstudio',
    twitter: 'https://twitter.com/mswebstudio',
    github: 'https://github.com/mswebstudio',
    dribbble: 'https://dribbble.com/mswebstudio',
    youtube: '',
    facebook: ''
  }
};

const WEBSITE_STORAGE_KEY = 'ms_website_config';

export function getLocalWebsiteConfig(): WebsiteConfig {
  try {
    const saved = localStorage.getItem(WEBSITE_STORAGE_KEY) || localStorage.getItem('enjel_website_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.website_name || parsed.logo_text)) {
        if (parsed.website_name?.includes('ENJEL') || parsed.logo_text?.includes('ENJEL')) {
          return DEFAULT_WEBSITE_CONFIG;
        }
        return {
          ...DEFAULT_WEBSITE_CONFIG,
          ...parsed,
          social_links: {
            ...DEFAULT_WEBSITE_CONFIG.social_links,
            ...(parsed.social_links || {})
          }
        };
      }
    }
  } catch (e) {
    console.warn('Failed reading website config from localStorage:', e);
  }
  return DEFAULT_WEBSITE_CONFIG;
}

export async function getWebsiteConfig(): Promise<WebsiteConfig> {
  const local = getLocalWebsiteConfig();
  try {
    const { data, error } = await supabase
      .from('website_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!error && data && (data.website_name || data.logo_text)) {
      const remoteConfig: WebsiteConfig = {
        id: data.id || 'default',
        website_name: data.website_name || DEFAULT_WEBSITE_CONFIG.website_name,
        logo_text: data.logo_text || DEFAULT_WEBSITE_CONFIG.logo_text,
        logo_subtext: data.logo_subtext || DEFAULT_WEBSITE_CONFIG.logo_subtext,
        logo_initial: data.logo_initial || DEFAULT_WEBSITE_CONFIG.logo_initial,
        logo_image_url: data.logo_image_url || '',
        footer_text: data.footer_text || DEFAULT_WEBSITE_CONFIG.footer_text,
        copyright_text: data.copyright_text || DEFAULT_WEBSITE_CONFIG.copyright_text,
        social_links: typeof data.social_links === 'object' && data.social_links
          ? { ...DEFAULT_WEBSITE_CONFIG.social_links, ...data.social_links }
          : DEFAULT_WEBSITE_CONFIG.social_links
      };
      localStorage.setItem(WEBSITE_STORAGE_KEY, JSON.stringify(remoteConfig));
      return remoteConfig;
    }
  } catch (err) {
    console.warn('Supabase website_config fetch fallback to local:', err);
  }
  return local;
}

export async function saveWebsiteConfig(config: WebsiteConfig): Promise<{ success: boolean; error?: string }> {
  const fullConfig: WebsiteConfig = {
    id: 'default',
    ...config
  };

  try {
    localStorage.setItem(WEBSITE_STORAGE_KEY, JSON.stringify(fullConfig));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('website_config_updated'));
    }
  } catch (e) {
    console.error('Failed to update localStorage for website config:', e);
  }

  try {
    const payload = {
      id: 'default',
      website_name: fullConfig.website_name,
      logo_text: fullConfig.logo_text,
      logo_subtext: fullConfig.logo_subtext,
      logo_initial: fullConfig.logo_initial,
      logo_image_url: fullConfig.logo_image_url || '',
      footer_text: fullConfig.footer_text,
      copyright_text: fullConfig.copyright_text,
      social_links: fullConfig.social_links,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('website_config')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert into website_config warning:', error.message);
      return { success: true, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase website_config save exception:', err);
    return { success: true };
  }
}




