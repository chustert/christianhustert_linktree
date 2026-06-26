# Build A Simple Linktree Homepage With Next.js, TypeScript, Tailwind CSS, And Vercel

This tutorial walks through creating a super simple, one-page personal homepage for `christianhustert.com`.

The site will work like a small Linktree-style page:

- A centered avatar or logo
- Your name and short bio
- A list of large hoverable links
- Social links
- A dark/light mode toggle
- Deployment on Vercel

The stack:

- Next.js
- TypeScript
- Tailwind CSS
- Vercel

The visual direction is based on a playful, minimal layout with a warm yellow background, bold black outlines, pill-shaped buttons, image-based social icons, and a button hover effect where the button presses downward while the shadow collapses.

## 1. Install Node.js

First, install Node.js from:

https://nodejs.org

Use the current LTS version unless you have a specific reason to use another version.

After installation, open your terminal and check:

```bash
node -v
npm -v
```

Both commands should print version numbers.

## 2. Create A New Next.js Project

Navigate to the folder where you keep your projects.

```bash
cd ~/Projects/project-name
```

Create a new app:

```bash
npx create-next-app@latest .
```

or 

```bash
cd ~/Projects
```

Create a new app:

```bash
npx create-next-app@latest project-name
```
(e.g. christianhustert-linktree)

The setup wizard will ask a few questions. Choose:

```text
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
Would you like to use React Compiler? No
Would you like to use Tailwind CSS? Yes
Would you like your code inside a `src/` directory? No
Would you like to use App Router? Yes
Would you like to use Turbopack? Yes
Would you like to customize the import alias? No
```

Then enter the project:

```bash
cd christianhustert-linktree
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

You should see the default Next.js starter page.

## 3. Understand The Important Files

With the App Router, the files you will edit most are:

```text
app/
  components/
    theme-toggle.tsx
  globals.css
  layout.tsx
  page.tsx
public/
package.json
```

What each file does:

- `app/page.tsx` is the homepage.
- `app/components/theme-toggle.tsx` is the client-side dark/light mode toggle.
- `app/layout.tsx` wraps the whole app and defines metadata.
- `app/globals.css` contains global CSS and Tailwind setup.
- `public/` is where you put static assets like your logo, favicon, and images.
- `package.json` contains project scripts and dependencies.

## 4. Clean Up The Starter Page

Open `app/page.tsx`.

The default file contains starter content from Next.js. You can replace it entirely with your own homepage later in this tutorial.

Also open `app/globals.css`.

If you selected Tailwind during setup, it should already contain Tailwind setup. In recent Tailwind versions, this usually starts with:

```css
@import "tailwindcss";
```

## 5. Configure Tailwind Dark Mode

For a simple manual dark/light mode toggle, use a `.dark` class on the root `<html>` element.

Update `app/globals.css` to include:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

html {
  scroll-behavior: smooth;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  min-height: 100vh;
}

@layer base {
  h1 {
    @apply mt-5 mb-2.5 text-2xl font-bold leading-6 text-black;
  }
}
```

The important line is:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This allows Tailwind classes like:

```tsx
dark:bg-[#f3595a]
dark:bg-[#ffd166]
```

to respond when the `dark` class exists on the `<html>` element.

## 6. Add A Theme Toggle Component

Create a new file:

```text
app/components/theme-toggle.tsx
```

Add:

```tsx
"use client";

export function ThemeToggle() {
  function toggleTheme() {
    const nextIsDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="fixed right-4 top-4 z-50 h-8 w-16 cursor-pointer rounded-full border-2 border-black"
    >
      <span className="absolute inset-0.5 h-6 w-6 rounded-full bg-black transition-transform duration-[400ms] ease-in-out dark:translate-x-8" />
    </button>
  );
}
```

Why this file needs `"use client"`:

- It reads and writes `localStorage`.
- It modifies `document.documentElement`.

Those are browser-only features, so the component must be a Client Component.

The toggle does not need React state. The `<html>` element's `.dark` class is the source of truth, and Tailwind's `dark:` classes respond to that class.

## 7. Prevent Theme Flash On Page Load

If the user previously selected dark mode, you want the page to load in dark mode immediately.

Otherwise, the page can briefly flash in light mode before React loads.

Open `app/layout.tsx` and use this structure:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Ubuntu } from 'next/font/google'

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Christian Hustert",
  description: "Personal homepage of Christian Hustert.",
};

const themeScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

      document.documentElement.classList.toggle("dark", isDark);
    } catch {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${ubuntu.className} bg-[#ffd166] transition-colors duration-[400ms] dark:bg-[#f3595a]`}>{children}</body>
    </html>
  );
}
```

What this does:

- Checks `localStorage` for a saved theme.
- Falls back to the user's system preference.
- Adds `.dark` to the `<html>` element before the page visibly renders.
- Uses `suppressHydrationWarning` because the server-rendered HTML may not initially know whether the client prefers dark mode.
- Loads Ubuntu through `next/font/google` and applies it site-wide on `<body>`.
- Transitions the body background color over `400ms` when the theme changes.

## 8. Add Your Avatar Or Logo

Place your avatar or logo in the `public/` folder.

For example:

```text
public/ch-avatar.svg
```

Anything inside `public/` can be referenced from the site root:

```tsx
src="/ch-avatar.svg"
```

This project also uses image files for the social icons:

```text
public/github-logo.webp
public/linkedin-icon-black.webp
public/instagram-icon.webp
public/x-icon.webp
```

For a real personal homepage, you may also want:

```text
public/favicon.ico
public/apple-touch-icon.png
public/og-image.png
```

Those can be added later.

## 9. Build The Homepage

Replace `app/page.tsx` with:

```tsx
import Image from "next/image";
import { ThemeToggle } from "./components/theme-toggle";

const links = [
  {
    label: "Fixing website search for everyone",
    href: "https://www.flowsearch.io/",
  },
  {
    label: "Creating the ultimate video game release calendar",
    href: "https://newgameday.com/",
  },
  {
    label: "Building dope tech at Scanabull",
    href: "https://scanabull.com/",
  },
  {
    label: "Pretending to do networking on LinkedIn",
    href: "https://www.linkedin.com/in/christianhustert/",
  },
  {
    label: "Occasionally posting photos on Instagram",
    href: "https://www.instagram.com/chrishusi/",
  },
  {
    label: "Spreading doom and gloom on X",
    href: "https://x.com/chrishustert",
  },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/chustert",
    icon: "/github-logo.webp",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/christianhustert/",
    icon: "/linkedin-icon-black.webp",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/chrishusi/",
    icon: "/instagram-icon.webp",
  },
  {
    label: "X",
    href: "https://x.com/chrishustert",
    icon: "/x-icon.webp",
  },
];

export default function Home() {
  return (
    <>
      <main className="flex min-h-dvh items-start justify-center text-black">
        <ThemeToggle />

        <section className="flex w-full max-w-xl flex-col items-center py-16">
          <div className="mb-4 rounded-full border-7 border-white bg-[#f3595a] p-5 transition-colors duration-[400ms] dark:bg-[#ffd166]">
            <Image
              src="/ch-avatar.svg"
              alt="Christian Hustert logo"
              width={64}
              height={64}
              priority
              className="h-16 w-16"
            />
          </div>

          <h1 className="text-center">Christian Hustert</h1>

          <p className="mb-2.5 mt-4 text-center text-base font-medium leading-5">
            Full Stack Developer in Raglan, NZ.
          </p>

          <nav className="mt-16 flex w-full flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-2 border-black bg-white p-4 text-center text-xl font-medium leading-5 text-black shadow-[0_6px_0_0_#000] transition-all duration-200 hover:translate-y-1 hover:shadow-[0_0_0_0_#000]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-12 flex gap-6">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex items-center justify-center rounded-full bg-black p-3.5 text-sm font-bold text-white transition-transform hover:scale-110"
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain invert"
                />
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-4 text-center text-sm font-normal leading-5 text-black">
        © {new Date().getFullYear()} Christian Hustert. All rights reserved.
      </footer>
    </>
  );
}
```

The social images use an empty `alt` because each link already has an `aria-label`.

## 10. Understand The Button Hover Effect

This class creates the bold shadow:

```tsx
shadow-[0_6px_0_0_#000]
```

This class moves the button downward on hover:

```tsx
hover:translate-y-1
```

This class removes the shadow on hover:

```tsx
hover:shadow-[0_0_0_0_#000]
```

Together, they create the effect where the button feels like it is pressing down into the chunky black shadow.

The transition is handled by:

```tsx
transition-all duration-200
```

You can make the movement stronger by changing:

```tsx
hover:translate-y-1
```

to:

```tsx
hover:translate-y-2
```

You can make the resting shadow larger by changing:

```tsx
shadow-[0_6px_0_0_#000]
```

to:

```tsx
shadow-[0_8px_0_0_#000]
```

## 11. Improve Mobile Layout

The example already works well on mobile because it uses:

```tsx
w-full max-w-xl
```

This means:

- The content can shrink on small screens.
- The content will not become too wide on desktop.
- The content can stay centered and capped on larger screens.

If the button text feels too large on small screens, use responsive text classes:

```tsx
className="... text-base sm:text-lg ..."
```

## 12. Add Better Social Icons

This project uses local image assets instead of an icon package.

Put the icon files in `public/`:

```text
public/github-logo.webp
public/linkedin-icon-black.webp
public/instagram-icon.webp
public/x-icon.webp
```

Then reference them from the `socials` array:

```tsx
const socials = [
  {
    label: "GitHub",
    href: "https://github.com/chustert",
    icon: "/github-logo.webp",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/christianhustert/",
    icon: "/linkedin-icon-black.webp",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/chrishusi/",
    icon: "/instagram-icon.webp",
  },
  {
    label: "X",
    href: "https://x.com/chrishustert",
    icon: "/x-icon.webp",
  },
];
```

Render each icon with `next/image`:

```tsx
<Image
  src={social.icon}
  alt=""
  width={24}
  height={24}
  className="h-6 w-6 object-contain invert"
/>
```

The `invert` class applies `filter: invert(100%)`, which makes black icon files appear white on the black circular background.

## 13. Add SEO Metadata

In `app/layout.tsx`, expand the metadata:

```tsx
export const metadata: Metadata = {
  title: "Christian Hustert",
  description: "Personal homepage of Christian Hustert.",
  metadataBase: new URL("https://christianhustert.com"),
  openGraph: {
    title: "Christian Hustert",
    description: "Personal homepage of Christian Hustert.",
    url: "https://christianhustert.com",
    siteName: "Christian Hustert",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Christian Hustert homepage",
      },
    ],
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Hustert",
    description: "Personal homepage of Christian Hustert.",
    images: ["/og-image.png"],
  },
};
```

Then add:

```text
public/og-image.png
```

The recommended size for Open Graph images is:

```text
1200 x 630
```

## 14. Add A Favicon

Add a favicon file:

```text
public/favicon.ico
```

Next.js will usually pick this up automatically if the project was created with the default app structure.

You can also use App Router metadata files:

```text
app/icon.png
app/apple-icon.png
```

For the simplest setup, `public/favicon.ico` is fine.

## 15. Check The Site Locally

Run:

```bash
npm run dev
```

Check:

```text
http://localhost:3000
```

Test:

- The page loads.
- The avatar appears.
- Every link opens the correct URL.
- The hover shadow animation works.
- The dark/light toggle switches themes.
- The selected theme persists after refresh.
- The page looks good on mobile.

## 16. Run A Production Build

Before deploying, run:

```bash
npm run build
```

If the build succeeds, the site is ready to deploy.

You can also run:

```bash
npm run lint
```

If your generated project has a lint script.

## 17. Commit The Project To Git

Initialize Git if needed:

```bash
git init
```

Stage the files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial personal homepage"
```

Create a GitHub repository named something like:

```text
christianhustert-linktree
```

Then connect it:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/christianhustert-linktree.git
git push -u origin main
```

## 18. Deploy To Vercel

Go to:

https://vercel.com/new

Import your GitHub repository.

Vercel should detect Next.js automatically.

The defaults should be:

```text
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
Install Command: npm install
```

Click deploy.

After a successful deployment, Vercel will give you a temporary URL like:

```text
https://christianhustert-linktree.vercel.app
```

## 19. Connect `christianhustert.com`

In your Vercel project:

```text
Project Settings -> Domains
```

Add:

```text
christianhustert.com
```

You can also add:

```text
www.christianhustert.com
```

Vercel will show the DNS records you need.

Typical records are:

```text
A record:
@ -> 76.76.21.21

CNAME:
www -> cname.vercel-dns.com
```

Set those records wherever your domain is managed.

DNS can update quickly, but sometimes it takes a few hours.

## 20. Final Checklist

Before sharing the site, check:

- The site works at `https://christianhustert.com`.
- `www.christianhustert.com` redirects correctly.
- All external links are correct.
- The page title is correct.
- The meta description is correct.
- The Open Graph image works when sharing the URL.
- The site looks good on mobile and desktop.
- The dark/light toggle persists across refreshes.
- The Vercel deployment is connected to the GitHub repo.

## Optional Next Steps

Once the basic page is live, you can add:

- Additional social links or project links.
- Subtle entrance animations.
- Analytics with Vercel Analytics.
- A contact link.
- Project cards for your web applications.
- A custom Open Graph image.
- Better accessibility labels for all icon links.

For this kind of personal homepage, keep the site small and fast. The main goal is to make it obvious who you are, what you do, and where people should go next.
