/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class", '[data-theme="dark"]'],
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				primary: "hsl(var(--primary))",
				"primary-content": "hsl(var(--primary-content))",
				secondary: "hsl(var(--secondary))",
				"secondary-focus": "hsl(var(--secondary-focus))",
				"secondary-content": "hsl(var(--secondary-content))",
				neutral: "hsl(var(--neutral))",
				"neutral-focus": "hsl(var(--neutral-focus))",
				"neutral-content": "hsl(var(--neutral-content))",
				"base-100": "hsl(var(--base-100))",
				"base-200": "hsl(var(--base-200))",
				"base-300": "hsl(var(--base-300))",
				"base-content": "hsl(var(--base-content))",
				error: "hsl(var(--error))",
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
};

