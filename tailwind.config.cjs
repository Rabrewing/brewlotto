/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./public/**/*.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif']
            },
            colors: {
                brew: {
                    primary: '#FFD700',
                    background: '#181818',
                    surface: '#232323'
                }
            },
            borderRadius: {
                xl: '1rem'
            }
        }
    },
    plugins: []
};