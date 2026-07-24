/**
 * SAMPLE / PLACEHOLDER TESTIMONIALS
 * 
 * NOTE: These are sample placeholder testimonials for demonstration purposes.
 * Replace these placeholders with your real client testimonials and reviews.
 */

export interface Testimonial {
  id: string;
  isPlaceholder: true; // Clearly marked as placeholder
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
