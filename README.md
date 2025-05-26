# ProjectExam2
Project Exam 2


ProjectExam2/
├── public/
│   └── _redirects
├── src/
│   ├── assets/
│   │   └── holizazeMark.png
│   ├── components/
│   │   ├── api.js
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── MainCarousel.jsx
│   │   ├── MiniCarousel.jsx
│   │   ├── userBookings.jsx
│   │   ├── VenueForm.jsx
│   │   └── VenueWithBookings.jsx
│   ├── hooks/
│   │   ├── useBookedDates.js
│   │   ├── useBooking.js
│   │   ├── useDefaultDateRange.js
│   │   ├── useProfile.js
│   │   ├── useUser.js
│   │   └── useVenue.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Logout.jsx
│   │   │   └── Register.jsx
│   │   ├── home/
│   │   │   └── Home.jsx
│   │   ├── profile/
│   │   │   ├── Dashboard.jsx
│   │   │   └── DetailsProfiles.jsx
│   │   └── venue/
│   │       ├── DetailsVenues.jsx
│   │       └── Venues.jsx
│   ├── utils/
│   │   ├── dateUtils.js
│   │   └── venueHelpers.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.js
└── vite.config.js


````markdown
## Installation

To run this project locally on your machine, follow these steps:

1. **Clone the repository**
```bash
git clone https://github.com/Ole12345678910/ProjectExam2.git
cd ProjectExam2
````

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open the project in your browser**
   Go to `http://localhost:5173` (or the address shown in your terminal) to view the app.

---

**Note:**

* Make sure you have [Node.js](https://nodejs.org/) installed (version 16 or higher).
* npm comes bundled with Node.js.

```
---

## 📦 Tech Stack & Libraries Used

This project is built using **React** with a modern toolchain and several helpful libraries:

### ⚛️ Core

* **React** – Frontend library for building user interfaces
* **React DOM** – For rendering React in the browser
* **React Router DOM** – Client-side routing and navigation

### 🧱 UI & Styling

* **Tailwind CSS** – Utility-first CSS framework for styling
* **tailwind-scrollbar-hide** – Tailwind plugin to easily hide scrollbars
* **PostCSS + Autoprefixer** – CSS processing used by Tailwind

### 🖼️ Icons & Components

* **React Icons** – Access to icon libraries (e.g., FontAwesome, Material Icons)
* **React Calendar** – A customizable calendar component
* **React Responsive Carousel** – Simple responsive image slider
* **React Slick** & **Slick Carousel** – Another carousel/slider solution
* **Keen Slider** – Lightweight and flexible slider library

  > 💡 Note: This project includes multiple carousel libraries. You might want to use just one based on your final design.

### 🔐 Authentication

* **@supabase/auth-helpers-react** – Supabase integration for user login/session management

### ⚙️ Development Tools

* **Vite** – Fast build tool and dev server
* **@vitejs/plugin-react** – Adds React-specific support to Vite
* **ESLint** – Linting tool to ensure consistent code style
* **eslint-plugin-react-hooks** – Helps enforce best practices for React Hooks
* **dotenv** – Loads environment variables from `.env` files

### 🧠 Type & Lint Support

* **@types/react**, **@types/react-dom** – TypeScript support for better editor autocomplete and safety
* **@eslint/js**, **eslint-plugin-react-refresh** – Extra ESLint config and features

