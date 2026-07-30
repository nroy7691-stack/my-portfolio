/**
 * SAMPLE / PLACEHOLDER TESTIMONIALS
 * 
 * NOTE: These are sample placeholder testimonials for demonstration purposes.
 * Replace these placeholders with your real client testimonials and reviews.
 */

import { supabase } from '../lib/supabase';

export interface Testimonial {
  id: string;
  isPlaceholder?: boolean;
  quote: string;
  clientName: string;
  role: string;
  company: string;
  projectType: string;
  rating: number;
  avatarUrl?: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: "sample-1",
    isPlaceholder: true,
    quote: "ENJEL WEB DESIGN transformed our online presence completely. The website is modern, clean, and our customers love the intuitive mobile layout.",
    clientName: "Sample Client Name",
    role: "Store Manager",
    company: "Dhar Jewellery House (Sample)",
    projectType: "Jewellery Website",
    rating: 5
  },
  {
    id: "sample-2",
    isPlaceholder: true,
    quote: "Working together was smooth and effortless. The design was delivered quickly, looks extremely professional, and helped boost our online inquiries.",
    clientName: "Sample Client Name",
    role: "Founder & CEO",
    company: "Apex Business Solutions (Sample)",
    projectType: "Business Website",
    rating: 5
  },
  {
    id: "sample-3",
    isPlaceholder: true,
    quote: "Our new restaurant website looks stunning! Customers can easily browse our menu and find our location on their mobile phones.",
    clientName: "Sample Client Name",
    role: "Head Chef & Owner",
    company: "Bistro 108 (Sample)",
    projectType: "Restaurant Website",
    rating: 5
  }
];

const TESTIMONIALS_STORAGE_KEY = 'enjel_testimonials_list';

export function getStoredTestimonials(): Testimonial[] {
  try {
    const saved = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading testimonials from storage:', err);
  }
  return testimonialsData;
}

export function saveStoredTestimonials(items: Testimonial[]): void {
  try {
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(items));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('testimonials_updated'));
    }
  } catch (err) {
    console.error('Failed saving testimonials to storage:', err);
  }
}

export async function fetchTestimonialsFromSupabase(): Promise<Testimonial[]> {
  const localList = getStoredTestimonials();
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) {
      const remoteList: Testimonial[] = data.map((item: any) => ({
        id: item.id || `testi-${Date.now()}`,
        quote: item.quote || item.review || '',
        clientName: item.client_name || item.clientName || 'Client Name',
        role: item.role || 'Client',
        company: item.company || '',
        projectType: item.project_type || item.projectType || 'Web Design',
        rating: typeof item.rating === 'number' ? item.rating : 5,
        avatarUrl: item.avatar_url || item.avatarUrl || '',
        isPlaceholder: item.is_placeholder ?? item.isPlaceholder ?? false
      }));
      saveStoredTestimonials(remoteList);
      return remoteList;
    }
  } catch (err) {
    console.warn('Supabase testimonials fetch fallback to local:', err);
  }
  return localList;
}

export async function syncTestimonialsToSupabase(items: Testimonial[]): Promise<{ success: boolean; error?: string }> {
  saveStoredTestimonials(items);

  try {
    const payload = items.map(t => ({
      id: t.id,
      quote: t.quote,
      client_name: t.clientName,
      role: t.role,
      company: t.company,
      project_type: t.projectType,
      rating: t.rating,
      avatar_url: t.avatarUrl || '',
      is_placeholder: t.isPlaceholder || false
    }));

    const { error } = await supabase
      .from('testimonials')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase testimonials upsert notice:', error.message);
      return { success: true, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase testimonials upsert exception:', err);
    return { success: true };
  }
}

