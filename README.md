# ENJEL WEB DESIGN (NJs WEB DESIGN) - Professional Portfolio Website

A clean, modern, and high-converting professional web design portfolio built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**. Designed to help web designers, agencies, and freelancers showcase their work and convert visitors into clients via direct WhatsApp inquiry.

---

## 🚀 1. How to Run the Project Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Steps
1. Clone or download this repository.
2. Open terminal in the project root folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your web browser.

---

## 📱 2. Where to Change WhatsApp Number

All contact configuration settings are located in a central file:
**`/src/config/siteConfig.ts`**

Find the `whatsappNumber` field:
```typescript
export const siteConfig: SiteConfig = {
  // Set your WhatsApp number in international format without '+' or spaces.
  // Example for India: "919876543210", USA: "15550192834"
  whatsappNumber: "919876543210",
  ...
};
```

---

## 📞 3. Where to Change Phone Number

In the same configuration file:
**`/src/config/siteConfig.ts`**

Update the `phone` field:
```typescript
phone: "+1 (555) 019-2834",
```

---

## ✉️ 4. Where to Change Email Address

In the same configuration file:
**`/src/config/siteConfig.ts`**

Update the `email` field:
```typescript
email: "contact@enjelwebdesign.com",
```

---

## 📁 5. Where to Add, Edit, or Delete Portfolio Projects

All portfolio projects are stored in a central static array:
**`/src/data/portfolioData.ts`**

### To Add a New Project:
Add an object to the `portfolioProjects` array:
```typescript
{
  id: "my-custom-project",
  title: "My Custom Business Website",
  category: "Business", // Options: 'All' | 'Business' | 'Restaurant' | 'Jewellery' | 'Portfolio' | 'Landing Page' | 'Other'
  description: "A sleek corporate website built for an enterprise client.",
  image: "/images/my-project.png",
  url: "https://my-client-website.com",
  technologies: ["React", "Tailwind CSS", "TypeScript"],
  featured: true
}
```

### To Delete a Project:
Simply remove its object entry from `portfolioProjects` in `portfolioData.ts`.

---

## 🖼️ 6. Where to Replace Project Screenshots

1. Save your real website screenshot or image file inside the **`/public/images/`** directory (e.g. `/public/images/dhar-jewellery.png`).
2. Open **`/src/data/portfolioData.ts`**.
3. Replace the placeholder string in the `image` field with your image path:
   ```typescript
   // Before:
   image: "PLACEHOLDER_PROJECT_IMAGE_1",

   // After:
   image: "/images/dhar-jewellery.png",
   ```

---

## 🌐 7. How to Configure Vite Base Path for GitHub Pages

This project uses the environment variable `VITE_BASE_PATH` in `vite.config.ts` to ensure all assets work under subpaths on static hosting (such as GitHub Pages).

### Deploying to GitHub Pages (Subpath repository):
If your repository URL is `https://username.github.io/my-portfolio/`:

1. Build the project specifying `VITE_BASE_PATH`:
   ```bash
   VITE_BASE_PATH=/my-portfolio/ npm run build
   ```
2. Deploy the generated contents of the `dist/` folder to your `gh-pages` branch.

### Deploying to Custom Domain / Root Domain:
If deploying to a root domain (e.g. `https://enjelwebdesign.com`):
```bash
npm run build
```
*(Default base path is `/`)*.

---

## 🛠️ Built With
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vite 6**
- **Lucide React Icons**
- **Motion (Framer)**
