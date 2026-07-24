/**
 * PORTFOLIO PROJECTS DATA
 * 
 * Central static configuration array for all portfolio projects.
 * You can easily ADD, EDIT, or DELETE projects here.
 * 
 * Instructions to replace placeholder images:
 * 1. Place your project screenshot image into the /public/images/ directory (e.g., /public/images/project1.png)
 * 2. Update the `image` field below with the relative path or full URL.
 */

export type ProjectCategory = 
  | 'All' 
  | 'Business' 
  | 'Restaurant' 
  | 'Jewellery' 
  | 'Portfolio' 
  | 'Landing Page' 
  | 'Other';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  image: string; // URL, path, or PLACEHOLDER_PROJECT_IMAGE_X
  url: string; // Live project link
  technologies: string[];
  featured?: boolean;
}

export const portfolioCategories: ProjectCategory[] = [
  'All',
  'Business',
  'Restaurant',
  'Jewellery',
  'Portfolio',
  'Landing Page',
  'Other'
];

export const portfolioProjects: Project[] = [
  {
    id: "dhar-jewellery-house",
    title: "Dhar Jewellery House",
    category: "Jewellery",
    description: "A premium jewellery business website designed with a modern and professional user experience.",
    image: "PLACEHOLDER_PROJECT_IMAGE_1",
    url: "https://dhar-jewellery-house.ai.studio/",
    technologies: ["React", "Tailwind CSS", "TypeScript", "E-Commerce Experience"],
    featured: true
  },
  {
    id: "next-business-project",
    title: "My Next Project",
    category: "Business",
    description: "Professional business website project.",
    image: "PLACEHOLDER_PROJECT_IMAGE_2",
    url: "#",
    technologies: ["React", "Vite", "Tailwind CSS"],
    featured: true
  },
  {
    id: "next-restaurant-project",
    title: "My Next Project",
    category: "Restaurant",
    description: "Modern restaurant website project.",
    image: "PLACEHOLDER_PROJECT_IMAGE_3",
    url: "#",
    technologies: ["React", "TypeScript", "UI/UX Design"],
    featured: true
  },
  {
    id: "creative-portfolio-project",
    title: "Executive Portfolio Showcase",
    category: "Portfolio",
    description: "High-impact personal portfolio website designed to highlight leadership skills, case studies, and achievements.",
    image: "PLACEHOLDER_PROJECT_IMAGE_4",
    url: "#",
    technologies: ["React", "Framer Motion", "Tailwind CSS"],
    featured: false
  },
  {
    id: "saas-landing-page",
    title: "SaaS Launchpad Landing Page",
    category: "Landing Page",
    description: "High-converting landing page optimized for email signups, product feature demos, and customer conversions.",
    image: "PLACEHOLDER_PROJECT_IMAGE_5",
    url: "#",
    technologies: ["React", "TypeScript", "Conversion Optimization"],
    featured: false
  },
  {
    id: "artisan-bakery-redesign",
    title: "Artisan Bakery Redesign",
    category: "Other",
    description: "Comprehensive website redesign enhancing mobile navigation, menu layout, and brand storytelling.",
    image: "PLACEHOLDER_PROJECT_IMAGE_6",
    url: "#",
    technologies: ["UI/UX Redesign", "Mobile First", "Tailwind CSS"],
    featured: false
  }
];
