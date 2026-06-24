/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FBE8CE',   
        surface: '#E4DFB5',      
        border: '#C3CC93',       
        primary: '#9AB17A',      
        secondary: '#C3CC93',    
        success: '#9AB17A',      
        warning: '#F59E0B',      
        danger: '#EF4444',       
        textPrimary: '#1F2921',  
        textSecondary: '#3F4F42',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(36, 177, 177, 0.3)' },
          '50%': { boxShadow: '0 0 35px rgba(36, 177, 177, 0.7)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
