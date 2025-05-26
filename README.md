# ProjectExam2 – Holidaze

A venue booking web app built with **React**, styled using **Tailwind CSS**, and powered by **Supabase** authentication.

🌐 **Live Site:** [https://holidaze22.netlify.app/](https://holidaze22.netlify.app/)

---

## 📁 Project Structure

```
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
```

---

## 📸 Screenshots

![Screenshot 1](https://github.com/user-attachments/assets/7f814dc8-b7ef-463c-930b-148c1c5c4437)
![Screenshot 2](https://github.com/user-attachments/assets/9aa672bf-653f-4795-ab8c-158a128141dd)
![Screenshot 3](https://github.com/user-attachments/assets/1fad3e1b-3fbd-43bc-a3eb-20640d425979)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ole12345678910/ProjectExam2.git
cd ProjectExam2
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Your `.env` File

Create a `.env` file in the root directory and add your environment variables. For example:

```env
VITE_API_KEY=your_api_key_here
```

You can start by copying the example file if available:

```bash
cp .env.example .env
```

Then edit `.env` to add your actual keys.


### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Your Browser

Go to [http://localhost:5173](http://localhost:5173) or the address shown in your terminal.

> ⚠️ Requires [Node.js](https://nodejs.org/) version **16 or higher**

---

## 📦 Tech Stack & Libraries

### ⚛️ Core

* `react` – UI library
* `react-dom` – DOM rendering
* `react-router-dom` – Routing/navigation

### 🎨 Styling

* `tailwindcss` – Utility-first CSS
* `tailwind-scrollbar-hide` – Hide scrollbars
* `postcss` + `autoprefixer` – CSS processing

### 📦 Components & UI

* `react-icons` – Icon libraries
* `react-calendar` – Custom calendar
* `react-responsive-carousel` – Basic image slider
* `react-slick` + `slick-carousel` – Alternative slider option
* `keen-slider` – Lightweight, modern slider

> 💡 Consider keeping just **one** slider lib to reduce bundle size.

### 🔐 Auth

* `@supabase/auth-helpers-react` – Supabase login/session support

### 🧰 Tooling

* `vite` – Fast dev server and bundler
* `eslint` – Code linting
* `@vitejs/plugin-react` – React support for Vite
* `dotenv` – Environment variables

### 📘 Type & Lint Support

* `@types/react`, `@types/react-dom` – TS type hints
* `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` – Best practice rules
