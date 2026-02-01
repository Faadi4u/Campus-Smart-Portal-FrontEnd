# Smart Campus Portal - Frontend

This is the React frontend for my Final Year Project. It handles the user interface where students and admins log in, view rooms, and manage bookings. It connects to the Node/Express backend.

**Current State:** Setting up Authentication and State Management.

---

## How to Run

**Important:** Make sure the **Backend** is running on Port 3000 before starting this, or the login won't work.

1.  **Install the packages:**
    ```bash
    npm install
    ```

2.  **Start the local server:**
    ```bash
    npm run dev
    ```

3.  **Open the link:**
    Usually `http://localhost:5173`

---

## Tools Used

-   **React + Vite:** For a fast development environment.
-   **Tailwind CSS:** For styling the pages quickly.
-   **React Router:** Handles navigation (Login page, Dashboard, etc.).
-   **Axios:** To send requests to the backend API.
-   **Context API:** To manage the user's login state globally.
-   **React Hot Toast:** For success/error popup messages.

---

## Folder Organization

Here is where I keep everything:

src/
├── api/           # API config (base URL and token logic)
├── components/    # Buttons, Inputs, and other reusable UI parts
├── context/       # AuthContext (Handles Login/Logout state)
├── layouts/       # The main design wrappers (Navbar, Sidebar)
├── pages/         # The actual screens (Login, Dashboard, etc.)
├── App.jsx        # Main app structure
└── main.jsx       # App entry point

---

## API Configuration
The app is set to talk to http://localhost:3000/api/v1.

👨‍💻 Developed By
[Muhammad_Fahad_Amin]