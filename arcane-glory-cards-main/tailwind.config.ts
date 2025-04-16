
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				game: {
					'deep-purple': '#1A1235',
					'midnight-blue': '#0A1930',
					'neon-teal': '#00FFCC',
					'neon-violet': '#8A2BE2',
					'neon-gold': '#FFD700',
					'card-border': '#834DE2',
					'mana-blue': '#1E90FF',
					'health-red': '#FF4136',
				}
			},
			fontFamily: {
				sans: ["Inter", ...fontFamily.sans],
				cinzel: ["Cinzel", ...fontFamily.serif],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				},
				"fade-out": {
					"0%": { opacity: "1", transform: "translateY(0)" },
					"100%": { opacity: "0", transform: "translateY(10px)" }
				},
				"scale-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" }
				},
				"scale-out": {
					from: { transform: "scale(1)", opacity: "1" },
					to: { transform: "scale(0.95)", opacity: "0" }
				},
				"slide-in": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" }
				},
				"slide-out": {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-100%)" }
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"pulse-glow": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.6" }
				},
				"spin-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" }
				},
				"card-flip": {
					"0%": { transform: "rotateY(0deg)" },
					"100%": { transform: "rotateY(180deg)" }
				},
				"particle-float": {
					"0%": { transform: "translate(0, 0)", opacity: "0" },
					"50%": { opacity: "1" },
					"100%": { transform: "translate(var(--random-x), var(--random-y))", opacity: "0" }
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"scale-in": "scale-in 0.2s ease-out",
				"scale-out": "scale-out 0.2s ease-out",
				"slide-in": "slide-in 0.3s ease-out",
				"slide-out": "slide-out 0.3s ease-out",
				"float": "float 3s ease-in-out infinite",
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"spin-slow": "spin-slow 12s linear infinite",
				"card-flip": "card-flip 0.6s ease-out forwards",
				"particle-float": "particle-float var(--random-duration) ease-out forwards",
			},
			backgroundImage: {
				'arcane-gradient': 'linear-gradient(to bottom, #1A1235, #0A1930)',
				'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
				'card-gradient': 'linear-gradient(to bottom, rgba(131, 77, 226, 0.8), rgba(10, 25, 48, 0.8))',
				'neon-border': 'linear-gradient(90deg, #00FFCC, #8A2BE2, #FFD700, #00FFCC)',
			},
			boxShadow: {
				'neon': '0 0 5px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3)',
				'neon-teal': '0 0 5px rgba(0, 255, 204, 0.5), 0 0 20px rgba(0, 255, 204, 0.3)',
				'neon-gold': '0 0 5px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
				'card': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
