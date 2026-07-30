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

