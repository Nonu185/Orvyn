# Orvyn Backend

The Node.js and Express backend service for Orvyn. It handles REST APIs for authentication, real-time WebSocket communication, and integrations with Google Gemini and Mistral AI.

## Architecture

- **Node.js & Express**: Core server framework.
- **MongoDB & Mongoose**: Database for users, chats, and messages.
- **Socket.IO**: Real-time bidirectional event-based communication.
- **JWT**: Secure authentication via HTTP-only cookies.
- **AI Integrations**: Google Gemini 2.5 Flash for chat capabilities, Mistral AI for conversation title generation.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in this directory with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_API_KEY=your_google_gemini_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- **Auth** (`/api/auth`): `/register`, `/login`, `/verify-email`, `/getme`
- **Chats** (`/api/chats`): GET `/`, POST `/message`, GET `/:chatid/messages`, DELETE `/delete/:chatid`
