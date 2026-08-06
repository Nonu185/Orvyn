# Orvyn

A modern, full-stack AI chat application designed to provide detailed, AI-generated answers in a sleek, responsive interface. It features secure user authentication, email verification, real-time communication, and persistent chat history.

## What does it do?

- Users can **register** and **log in** with email and password
- A **verification email** is sent on signup — you must verify before you can log in
- On the home page, you can **chat with an AI** (powered by Google Gemini)
- Each conversation gets an **auto-generated title** (powered by Mistral AI)
- Your **chat history** is saved and shown in the sidebar
- Everything is connected with **real-time sockets** using Socket.IO

## Project Structure

```
orvyn/
├── Frontend/    → React app (the UI users see)
└── Backend/     → Node.js server (handles APIs, AI, database)
```

## Tech Stack

| Part     | Technology                        |
|----------|-----------------------------------|
| Frontend | React, Vite, Tailwind CSS         |
| Backend  | Node.js, Express                  |
| Database | MongoDB (via Mongoose)            |
| AI       | Google Gemini 2.5 Flash (chat), Mistral AI (titles) |
| Realtime | Socket.IO                         |
| Auth     | JWT stored in HTTP-only cookies   |
| Email    | Nodemailer                        |


