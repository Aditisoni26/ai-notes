# 🧠 AI Note-Taking App

A simple AI-powered note-taking application built as part of a MERN Stack Developer POC task.

This app allows users to create, manage, and enhance notes using AI features like summarization, improvement, and auto-tagging.


## 🚀 Live Demo
👉 https://ai-notes-six-sand.vercel.app/


## 📦 GitHub Repository
👉 https://github.com/Aditisoni26/ai-notes


## 🎯 Features

### 🔐 Authentication
- User Registration
- Login using credentials
- Protected routes
- Session-based authentication using NextAuth

### 📝 Notes Management
- Create notes (title + content)
- View all notes
- Edit notes
- Delete notes
- Search notes by title

### 🤖 AI Features
- AI Summary → Generates a short summary of notes
- AI Improve → Enhances grammar and clarity
- AI Tags → Automatically generates relevant tags

### 🎨 UI/UX
- Clean UI using shadcn/ui
- Fully responsive design
- Dark / Light mode toggle
- Profile dropdown (shows username & email)


## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon DB)

### Authentication
- NextAuth (Credentials Provider)

### AI Integration
- OpenAI API (or any AI API used)


## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/Aditisoni26/ai-notes.git  
cd ai-notes  

### 2. Install dependencies
npm install  

### 3. Setup environment variables
Create a `.env` file in the root:

DATABASE_URL=your_database_url  
NEXTAUTH_SECRET=your_secret_key  
NEXTAUTH_URL=http://localhost:3000  

### 4. Run the project
npm run dev  

### 5. Prisma setup (if required)
npx prisma generate  
npx prisma migrate dev  


## 🧪 Test Credentials
Username: testUser  
Password: 1234 

Or create your own account using the register page.


## 🎥 Demo Video
👉 https://drive.google.com/file/d/1vUqTanI1VKbC3PBLpIlodqNbhXLDAJ77/view?usp=sharing


## 🧠 Key Highlights
- User-specific notes (data is securely isolated per user)
- Clean API structure with proper authentication checks
- AI features with loading state and error handling
- Simple, responsive, and user-friendly UI


## ⚠️ Notes
- This project is built as a Proof of Concept (POC)
- Focus is on functionality, clean structure, and integration
- Not intended for production use


## 👩‍💻 Author
Aditi Soni
