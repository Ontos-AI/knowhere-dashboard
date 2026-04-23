import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
	extend: {
			screens: {
				xs: '375px'
			},
			fontFamily: {
				sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
				mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
				'mono-display': ['var(--font-mono-display)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
				'mono-readable': ['var(--font-mono-readable)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
				accent: ['var(--font-accent)', 'system-ui', 'sans-serif'],
				heading: ['var(--font-sans)', 'system-ui', 'sans-serif'],
				pixel: ['var(--font-pixel-primary)', 'Courier New', 'monospace']
			},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				light: 'hsl(var(--primary-light))',
  				dark: 'hsl(var(--primary-dark))'
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
  				foreground: 'hsl(var(--accent-foreground))',
  				light: 'hsl(var(--accent-light))',
  				dark: 'hsl(var(--accent-dark))'
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
  			pixel: {
  				bg: 'var(--pixel-bg)',
  				fg: 'var(--pixel-fg)',
  				border: 'var(--pixel-border)',
  				shadow: 'var(--pixel-shadow)',
  				muted: 'var(--pixel-text-muted)',
  				green: 'var(--pixel-accent-green)',
  				yellow: 'var(--pixel-accent-yellow)',
  				red: 'var(--pixel-accent-red)'
  			}
  		},
		borderRadius: {
			xs: '2px',
			sm: '4px',
			md: '6px',
			lg: '8px',
			xl: '12px',
			'2xl': '16px',
			'3xl': '24px',
			'4xl': '32px',
			full: '9999px'
		},
		boxShadow: {
			'2xs': '0 1px 0 0 rgb(0 0 0 / 0.05)',
			xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
			DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
			xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
		},
		blur: {
			none: '0px',
			xs: '2px',
			sm: '4px',
			md: '6px',
			lg: '8px',
			xl: '12px',
			'2xl': '20px',
			'3xl': '32px'
		},
		backdropBlur: {
			none: '0px',
			xs: '2px',
			sm: '4px',
			md: '6px',
			lg: '8px',
			xl: '12px',
			'2xl': '20px',
			'3xl': '32px'
		},
		opacity: {
			0: '0',
			5: '0.05',
			10: '0.1',
			15: '0.15',
			20: '0.2',
			25: '0.25',
			30: '0.3',
			35: '0.35',
			40: '0.4',
			45: '0.45',
			50: '0.5',
			55: '0.55',
			60: '0.6',
			65: '0.65',
			70: '0.7',
			75: '0.75',
			80: '0.8',
			85: '0.85',
			90: '0.9',
			95: '0.95',
			100: '1'
		},
  		spacing: {
  			'pixel-1': 'var(--space-1)',
  			'pixel-2': 'var(--space-2)',
  			'pixel-3': 'var(--space-3)',
  			'pixel-4': 'var(--space-4)',
  			'pixel-6': 'var(--space-6)',
  			'pixel-8': 'var(--space-8)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'fade-in-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-in-down': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in-right': {
  				'0%': {
  					transform: 'translateX(100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'slide-in-left': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.5'
  				}
  			},
  			glow: {
  				'0%, 100%': {
  					boxShadow: '0 0 20px rgba(38, 185, 237, 0.4)'
  				},
  				'50%': {
  					boxShadow: '0 0 40px rgba(38, 185, 237, 0.6)'
  				}
  			},
  			'glow-magenta': {
  				'0%, 100%': {
  					boxShadow: '0 0 20px rgba(153, 102, 255, 0.4)'
  				},
  				'50%': {
  					boxShadow: '0 0 40px rgba(153, 102, 255, 0.6)'
  				}
  			},
  			'glow-green': {
  				'0%, 100%': {
  					boxShadow: '0 0 20px rgba(32, 217, 166, 0.4)'
  				},
  				'50%': {
  					boxShadow: '0 0 40px rgba(32, 217, 166, 0.6)'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					transform: 'scale(0.9)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			glitch: {
  				'0%, 100%': {
  					transform: 'translate(0)'
  				},
  				'20%': {
  					transform: 'translate(-2px, 2px)'
  				},
  				'40%': {
  					transform: 'translate(-2px, -2px)'
  				},
  				'60%': {
  					transform: 'translate(2px, 2px)'
  				},
  				'80%': {
  					transform: 'translate(2px, -2px)'
  				}
  			},
  			'neon-pulse': {
  				'0%, 100%': {
  					textShadow: '0 0 10px rgba(38, 185, 237, 0.7), 0 0 20px rgba(38, 185, 237, 0.5)'
  				},
  				'50%': {
  					textShadow: '0 0 20px rgba(38, 185, 237, 0.9), 0 0 40px rgba(38, 185, 237, 0.7)'
  				}
  			},
  			holographic: {
  				'0%, 100%': {
  					filter: 'hue-rotate(0deg)'
  				},
  				'50%': {
  					filter: 'hue-rotate(20deg)'
  				}
  			},
  			'pixel-blink': {
  				'0%, 49%': {
  					opacity: '1'
  				},
  				'50%, 100%': {
  					opacity: '0'
  				}
  			},
  			'pixel-bounce': {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-8px)'
  				}
  			},
  			'pixel-scroll': {
  				'0%': {
  					backgroundPosition: '0 0'
  				},
  				'100%': {
  					backgroundPosition: '-100px 0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			shimmer: 'shimmer 2s infinite',
  			'fade-in': 'fade-in 0.5s ease-out',
  			'fade-in-up': 'fade-in-up 0.6s ease-out',
  			'fade-in-down': 'fade-in-down 0.6s ease-out',
  			'slide-in-right': 'slide-in-right 0.3s ease-out',
  			'slide-in-left': 'slide-in-left 0.3s ease-out',
  			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			glow: 'glow 2s ease-in-out infinite',
  			'glow-magenta': 'glow-magenta 2s ease-in-out infinite',
  			'glow-green': 'glow-green 2s ease-in-out infinite',
  			'scale-in': 'scale-in 0.3s ease-out',
  			glitch: 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
  			'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
  			holographic: 'holographic 3s ease-in-out infinite',
  			'pixel-blink': 'pixel-blink 1s steps(2) infinite',
  			'pixel-bounce': 'pixel-bounce 0.6s steps(3) infinite',
  			'pixel-scroll': 'pixel-scroll 4s linear infinite'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		}
  	}
  },
  plugins: [],
}

export default config
