import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Pure Black & White
        black: '#000000',
        white: '#FFFFFF',
        
        // Background Hierarchy
        background: {
          DEFAULT: '#0A0A0A',
          secondary: '#111111',
          tertiary: '#1A1A1A',
          hover: '#222222',
        },
        
        // Text Hierarchy
        foreground: {
          DEFAULT: '#FFFFFF',
          secondary: '#A0A0A0',
          muted: '#666666',
        },
        
        // Accent Colors - Neon
        accent: {
          DEFAULT: '#CCFF00',      // Neon Yellow-Green (Primary)
          secondary: '#FF3366',    // Hot Pink (Sale/Alert)
          tertiary: '#00FFFF',     // Cyan (Info)
        },
        
        // Sustainability Colors
        eco: {
          green: '#00FF88',
          yellow: '#FFD700',
          red: '#FF4444',
        },
        
        // Feedback Colors
        success: '#00FF88',
        warning: '#FFD700',
        error: '#FF3366',
        info: '#00FFFF',
        
        // Borders
        border: {
          DEFAULT: '#333333',
          hover: '#555555',
        },
      },
      
      fontFamily: {
        display: ['Space Grotesk', 'Helvetica Neue', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.625rem', { lineHeight: '1' }],      // 10px
        'sm': ['0.75rem', { lineHeight: '1.2' }],     // 12px
        'base': ['0.875rem', { lineHeight: '1.5' }],  // 14px
        'md': ['1rem', { lineHeight: '1.5' }],        // 16px
        'lg': ['1.25rem', { lineHeight: '1.4' }],     // 20px
        'xl': ['1.5rem', { lineHeight: '1.3' }],      // 24px
        '2xl': ['2rem', { lineHeight: '1.2' }],       // 32px
        '3xl': ['3rem', { lineHeight: '1.1' }],       // 48px
        '4xl': ['4rem', { lineHeight: '1' }],         // 64px
        '5xl': ['6rem', { lineHeight: '1' }],         // 96px
        '6xl': ['8rem', { lineHeight: '1' }],         // 128px
      },
      
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.1em',
        widest: '0.2em',
        brutal: '0.3em',
      },
      
      borderRadius: {
        'none': '0',
        'brutal': '0',
      },
      
      boxShadow: {
        'brutal': '4px 4px 0 0 #CCFF00',
        'brutal-sm': '2px 2px 0 0 #CCFF00',
        'brutal-lg': '8px 8px 0 0 #CCFF00',
        'brutal-white': '4px 4px 0 0 #FFFFFF',
        'brutal-black': '4px 4px 0 0 #000000',
      },
      
      animation: {
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'marquee': 'marquee 30s linear infinite',
      },
      
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 5px #CCFF00, 0 0 10px #CCFF00, 0 0 20px #CCFF00' },
          '50%': { boxShadow: '0 0 10px #CCFF00, 0 0 20px #CCFF00, 0 0 40px #CCFF00' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, #1A1A1A 1px, transparent 1px), linear-gradient(to bottom, #1A1A1A 1px, transparent 1px)',
        'noise': "url('/noise.png')",
      },
      
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [],
}

export default config
