Markdown
# 📚 Library Room Booker & Learning Rewards System

An integrated management platform combining real-time study room reservation with dynamic QR verification, online book loans, and a gamified learning reward point system.

## 🚀 Quick Setup Guide

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/mny19708-create/library-SPD4.git](https://github.com/mny19708-create/library-SPD4.git)
   cd library-SPD4
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the environment:**

   If `.env` does not exist, copy `.env.example` to create it. Otherwise, preserve
   its existing database settings and add `ADMIN_USERNAME` and a unique
   `ADMIN_PASSWORD` of at least 12 characters. These initial credentials are used
   only when the `admin_users` table is empty. Keep `.env` private and do not commit it.

4. **Start the application:**

   ```bash
   npm start
   ```

5. **Open the sign-in page:** visit `http://localhost:3000`. After signing in, use
   Settings to update the admin display name, change the password, or select a theme.

The server creates the admin account and session tables automatically. Admin API
routes require a valid server-managed session; passwords are stored as scrypt hashes.
👥 Project Team
Project Manager: Va Many

Backend & AI Engineers: Pov Rotha, Sot Mouchheng

Frontend Developer: Ven Sreyleak

QA & DevOps: Soy Long
