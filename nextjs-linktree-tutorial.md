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

The visual direction is based on a playful, minimal layout with a warm yellow background, bold black outlines, pill-shaped buttons, and a button hover effect where the button appears to move upward while the shadow collapses.

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
cd ~/Projects
```

Create a new app:

```bash
npx create-next-app@latest christianhustert-linktree
```

The setup wizard will ask a few questions. Choose:

```text
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
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
  globals.css
  layout.tsx
  page.tsx
public/
package.json
```

What each file does:

- `app/page.tsx` is the homepage.
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
  min-height: 100vh;
}
```

The important line is:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This allows Tailwind classes like:

```tsx
dark:bg-neutral-950
dark:text-white
```

to respond when the `dark` class exists on the `<html>` element.

## 6. Add A Theme Toggle Component

Create a new file:

```text
app/theme-toggle.tsx
```

Add:

```tsx
"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const nextIsDark = !isDark;

    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");

    setIsDark(nextIsDark);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="fixed right-5 top-5 z-10 flex h-8 w-14 items-center rounded-full border-2 border-black bg-[#ffd46b] p-1 transition-colors dark:border-white dark:bg-neutral-800"
    >
      <span
        className={`h-5 w-5 rounded-full bg-black transition-transform dark:bg-white ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
```

Why this file needs `"use client"`:

- The toggle uses `useState`.
- It reads and writes `localStorage`.
- It modifies `document.documentElement`.

Those are browser-only features, so the component must be a Client Component.

## 7. Prevent Theme Flash On Page Load

If the user previously selected dark mode, you want the page to load in dark mode immediately.

Otherwise, the page can briefly flash in light mode before React loads.

Open `app/layout.tsx` and use this structure:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Christian Hustert",
  description: "Personal homepage of Christian Hustert.",
};

const themeScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (_) {}
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
      <body>{children}</body>
    </html>
  );
}
```

What this does:

- Checks `localStorage` for a saved theme.
- Falls back to the user's system preference.
- Adds `.dark` to the `<html>` element before the page visibly renders.
- Uses `suppressHydrationWarning` because the server-rendered HTML may not initially know whether the client prefers dark mode.

## 8. Add Your Avatar Or Logo

Place your avatar or logo in the `public/` folder.

For example:

```text
public/avatar.png
```

Anything inside `public/` can be referenced from the site root:

```tsx
src="/avatar.png"
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
import { ThemeToggle } from "./theme-toggle";

const links = [
  {
    label: "Spreading doom and gloom on X",
    href: "https://x.com/your-handle",
  },
  {
    label: "Becoming a tech authority on Medium",
    href: "https://medium.com/@your-handle",
  },
  {
    label: "Occasionally posting photos on Instagram",
    href: "https://instagram.com/your-handle",
  },
  {
    label: "Trying to do networking on LinkedIn",
    href: "https://linkedin.com/in/your-handle",
  },
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/your-handle",
    text: "IG",
  },
  {
    label: "X",
    href: "https://x.com/your-handle",
    text: "X",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/your-handle",
    text: "in",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh items-start justify-center bg-[#ffd46b] px-6 py-16 text-black transition-colors dark:bg-neutral-950 dark:text-white">
      <ThemeToggle />

      <section className="flex w-full max-w-xl flex-col items-center">
        <div className="rounded-full border-4 border-white bg-[#ff4d5a] p-3 shadow-sm">
          <Image
            src="/avatar.png"
            alt="Christian Hustert logo"
            width={88}
            height={88}
            priority
            className="rounded-full"
          />
        </div>

        <h1 className="mt-8 text-center text-2xl font-black">
          Christian Hustert
        </h1>

        <p className="mt-4 text-center text-sm font-bold">
          Webflow Developer in Raglan, NZ.
        </p>

        <nav className="mt-16 flex w-full flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-2 border-black bg-white px-6 py-4 text-center text-lg font-medium text-black shadow-[0_8px_0_0_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_0_0_#000] focus:outline-none focus-visible:ring-4 focus-visible:ring-black/30 dark:border-white dark:bg-neutral-100 dark:text-black dark:shadow-[0_8px_0_0_#fff]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-12 flex gap-5">
          {socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-bold text-white transition-transform hover:-translate-y-1 dark:bg-white dark:text-black"
            >
              {social.text}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
```

Then replace every placeholder URL with your real links.

## 10. Understand The Button Hover Effect

This class creates the bold shadow:

```tsx
shadow-[0_8px_0_0_#000]
```

This class moves the button upward on hover:

```tsx
hover:-translate-y-1
```

This class removes the shadow on hover:

```tsx
hover:shadow-[0_0_0_0_#000]
```

Together, they create the effect where the button feels like it is moving upward from a chunky black shadow.

The transition is handled by:

```tsx
transition-all duration-200
```

You can make the movement stronger by changing:

```tsx
hover:-translate-y-1
```

to:

```tsx
hover:-translate-y-2
```

You can make the resting shadow larger by changing:

```tsx
shadow-[0_8px_0_0_#000]
```

to:

```tsx
shadow-[0_10px_0_0_#000]
```

## 11. Improve Mobile Layout

The example already works well on mobile because it uses:

```tsx
w-full max-w-xl px-6
```

This means:

- The content can shrink on small screens.
- The content will not become too wide on desktop.
- The page keeps padding on the left and right.

If the button text feels too large on small screens, use responsive text classes:

```tsx
className="... text-base sm:text-lg ..."
```

## 12. Add Better Social Icons

The tutorial uses simple text labels like `IG`, `X`, and `in`.

For nicer icons, install Lucide React:

```bash
npm install lucide-react
```

Then you can import icons:

```tsx
import { Instagram, Linkedin } from "lucide-react";
```

Lucide may not include every brand icon. For full brand coverage, use:

```bash
npm install react-icons
```

Then:

```tsx
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
```

For a very small personal site, `react-icons` is convenient.

## 13. Add SEO Metadata

In `app/layout.tsx`, expand the metadata:

```tsx
export const metadata: Metadata = {
  title: "Christian Hustert",
  description: "Webflow Developer in Raglan, New Zealand.",
  metadataBase: new URL("https://christianhustert.com"),
  openGraph: {
    title: "Christian Hustert",
    description: "Webflow Developer in Raglan, New Zealand.",
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
    description: "Webflow Developer in Raglan, New Zealand.",
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

- Real brand icons instead of text social labels.
- Subtle entrance animations.
- Analytics with Vercel Analytics.
- A contact link.
- Project cards for your web applications.
- A custom Open Graph image.
- Better accessibility labels for all icon links.

For this kind of personal homepage, keep the site small and fast. The main goal is to make it obvious who you are, what you do, and where people should go next.
