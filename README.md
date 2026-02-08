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

## API Configuration
The app is set to talk to http://localhost:3000/api/v1.

---

## Implemented Features

**Authentication**:
Login Page with Tailwind UI.
Registration Page with Tailwind UI.
Integration with Backend Login API.
JWT Token storage in LocalStorage.
Auto-login on page refresh.
Error handling (Wrong password/email).
Update Profile , Password , Name and Email and Delete Account

**Layout & Navigation:**
  - **Sidebar & Navbar**: Responsive.
  - **Role-based menu items** (Admin sees "Rooms", Students see "My Bookings").
  - **Protected Routes** (Prevents access without login).

**Dashboard:**
  - **Dynamic Stats:** Fetches live data from backend APIs.
  - **Admin View:** System-wide stats, Pending requests, Most Popular Rooms.
  - **Student View:** Personal booking history stats.
  - Loading states & Error handling.
**Rooms Management (Admin):**
  - **Room Catalog:** Grid view of all rooms with capacity and feature tags.
  - **Add Room:** Modal form to create new rooms dynamically.
  - **Live Updates:** List refreshes automatically after creation.  

**Bookings Module:**
  - **Bookings List:** Table view of bookings with date, time, and purpose.
  - **Status Badges:** Visual indicators for Pending, Approved, Rejected.
  - **Admin Actions:** Approve/Reject buttons (UI logic ready).
  - **Student Actions:** Cancel booking button.
  - **Data Population:** Correctly displays Room names from relation data.
  - **New Booking Form:** User-friendly UI to select rooms, date, and time.

**Profile Update:**
  - **Preview Profile:** View Your Profile Data.
  - **Change Name & Email:** You can change your username and email.
  - **Change Password:** You can change your password .
  - **Delete Account:** Delete your existing account.

👨‍💻 Developed By
[Muhammad_Fahad_Amin]