
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                pb: {
                    black: '#0E0E0E',
                    darkGray: '#1C1C1C',
                    gray: '#6B6B6B',
                    lightGray: '#DADADA',
                    offWhite: '#F5F6F2',
                    white: '#FFFFFF',
                },
                ind: {
                    ok: '#2F6F3E',
                    warn: '#8C7A3E',
                    error: '#8E2A2A',
                    info: '#4A5A64',
                }
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
