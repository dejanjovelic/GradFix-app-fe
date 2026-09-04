# GradFix Frontend

GradFix is a React-based frontend application that allows citizens to report issues in their city, upload photos, provide a location, and track the resolution process.

This project was developed as part of the Pierre Enterprises Full Stack Test Task.

---

## Features

### Citizen

- Register and login
- Google Sign-In
- JWT authentication
- Submit a new report
- Upload up to 3 images
- Select report category
- Choose GPS location or provide a manual address
- View report details

### General

- Mobile-first responsive design
- Form validation
- Global API error handling
- Protected routes
- Role-based authorization

---

## Technologies

- React 19
- React Router
- Axios
- React Hook Form
- SCSS
- Lucide React
- Leaflet (OpenStreetMap)
- Vite

---

## Project Structure

```
src
│
├── api
├── assets
├── components
├── contexts
├── hooks
├── layouts
├── pages
├── routes
├── utils
└── App.jsx
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/dejanjovelic/GradFix-app-fe.git
```

Go to the project directory

```bash
cd GradFix-app-fe
```

Install dependencies

```bash
npm install
```

Starting project

```bash
npm start
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_API_URL=https://localhost:7001/api
VITE_BACKEND_URL=https://localhost:7001
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

---

## Running the application

Start the development server

```bash
npm run dev
```

The application will be available at

```
http://localhost:5173
```

---

## Backend

This frontend communicates with the GradFix ASP.NET Core Web API.

Backend repository:

https://github.com/dejanjovelic/GradFix-app-be

The backend must be running before starting the frontend.

---

## Authentication

The application uses JWT Bearer authentication.

After a successful login the backend returns:

- JWT token
- expiration date
- user profile
- user roles

The token is stored in Local Storage and automatically attached to every authenticated request using an Axios interceptor.

---

## Image Uploads

Reports support uploading up to three images.

Images are sent as `multipart/form-data` and stored by the backend.

---

## Registration error regression checks

Run `npm test` with a recent Node.js version supporting automatic ES module detection (verified with Node 26.5.1). The five dependency-free tests cover API error messages, validation precedence, invalid payloads, safe server errors and network failures.

Browser regression check: register with an email already present in the test database. The form should show the backend rejection message, keep the submit button usable and produce no `getErrorMessage is not defined` error.

## AI Usage

AI tools (ChatGPT) were used during the development process as a programming assistant for:

- discussing architecture decisions
- reviewing implementation ideas
- explaining ASP.NET Core and React concepts
- generating boilerplate code
- improving code readability
- identifying potential bugs

All generated code was manually reviewed, modified, integrated and tested before being included in the final solution.

---

## Future Improvements

- Report editing
- My Reports page
- Report search and filtering
- Status timeline improvements
- Admin dashboard enhancements
- Image optimization
- Unit and integration tests

---

## Author

Dejan Jovelić
