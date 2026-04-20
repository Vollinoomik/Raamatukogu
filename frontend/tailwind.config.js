/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#e52e84',
          purple: '#8a3ffc',
          text: '#0f172a',
          muted: '#475569',
          bg: '#f7f1f5',
          card: '#ffffff'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #e52e84 0%, #8a3ffc 100%)'
      }
    }
  },
  plugins: [],
};
