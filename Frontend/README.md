# Orvyn Frontend

The client-side application for Orvyn, built with React and Vite. It provides a sleek, responsive, dark-mode user interface for real-time AI conversations.

## Architecture

- **React & Vite**: Core UI library and rapid build tool.
- **Tailwind CSS**: Utility-first CSS framework for efficient styling.
- **Socket.IO Client**: Real-time connection to the backend.
- **Axios**: HTTP client for REST API requests.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

*Note: The frontend proxies `/api` and `/socket.io` requests to the backend server (typically running on port 3000) through Vite's configuration. Ensure the backend is running concurrently for full functionality.*

## Project Structure

- `src/app/`: Core app configuration, routing, and global styles.
- `src/features/auth/`: Authentication contexts and components (Login, Register).
- `src/features/home/`: Main chat interface and socket logic.
- `src/features/services/`: API interaction layer.
