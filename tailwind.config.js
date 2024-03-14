/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/*.{html,js,css,ejs} ",
  ],
  theme: {
    extend: {
      backgroundImage: {
      'register': "url('/public/images/creation-entreprise-1.jpg')",
      'footer-texture': "url('/img/footer-texture.png')",
    }
  },
  },
  plugins: [],
}

