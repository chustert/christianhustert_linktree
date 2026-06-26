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