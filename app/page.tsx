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
    label: "CV, XP & WWW-Log on CH1337",
    href: "https://ch1337.com/",
  },
  {
    label: "Building dope tech at Scanabull",
    href: "https://scanabull.com/",
  },
  // {
  //   label: "Showing off my coding skills on GitHub",
  //   href: "https://github.com/chustert",
  // },
  // {
  //   label: "Pretending to do networking on LinkedIn",
  //   href: "https://www.linkedin.com/in/christianhustert/",
  // },
  // {
  //   label: "Occasionally posting photos on Instagram",
  //   href: "https://www.instagram.com/chrishusi/",
  // },
  // {
  //   label: "Spreading doom and gloom on X",
  //   href: "https://x.com/chrishustert",
  // }
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
    <main className="flex flex-1 items-start justify-center text-black">
      <ThemeToggle />

      <section className="py-16 flex w-full max-w-xl flex-col items-center">
        <div className="flex flex-col items-center px-4">
          <div className="rounded-full border-7 border-white bg-[#f3595a] transition-colors duration-[400ms] dark:bg-[#ffd166] p-5 mb-4">
            <Image
              src="/ch-avatar.svg"
              alt="Christian Hustert logo"
              width={64}
              height={64}
              priority
              className="w-16 h-16"
            />
          </div>

          <h1 className=" text-center">
            Christian Hustert
          </h1>

          <p className="mt-4 mb-2.5 font-medium text-center text-base leading-5">
            Full Stack Developer in Raglan, NZ.
          </p>

          <nav className="mt-16 flex w-full flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-2 border-black bg-white py-4 px-8 text-center text-xl leading-5 font-medium text-black shadow-[0_6px_0_0_#000] transition-all duration-200 hover:translate-y-1 hover:shadow-[0_0_0_0_#000]"
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
                className="flex p-3.5 items-center justify-center rounded-full bg-black text-sm font-bold text-white transition-transform hover:scale-110"
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
        </div>
      </section>
    </main>
    <footer className="py-4 text-center text-sm font-normal leading-5 text-black">
      © {new Date().getFullYear()} Christian Hustert. All rights reserved.
    </footer>
    </>
  );
}