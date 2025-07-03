/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./admin/**/*.{js,ts,jsx,tsx}",
        "./layouts/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./public/**/*.html"
    ],
    darkMode: 'class', // Use 'class' for dark theme toggling
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif']
            },
            colors: {
                brew: {
                    primary: '#FFD700',
                    background: '#181818',
                    surface: '#232323',
                    accent: '#00C7B7',
                    error: '#FF5A5F',
                    info: '#9C27B0',
                }
            },
            borderRadius: {
                xl: '1rem',
                '2xl': '1.5rem'
            },
            boxShadow: {
                'brew-xl': '0 10px 25px rgba(0,0,0,0.6)',
                'brew-md': '0 5px 15px rgba(0,0,0,0.4)'
            }
        }
    },
    safelist: [
        'text-white',
        'text-black',
        'text-gray-300',
        'bg-[#181818]',
        'bg-[#232323]',
        'bg-brew-background',
        'bg-brew-surface',
        'text-brew-primary',
        'hover:bg-white',
        'hover:text-[#FFD700]',
        'hover:text-brew-primary',
        'rounded-xl',
        'shadow-xl',
        'font-bold',
        'font-semibold'
    ],
    plugins: []
};
