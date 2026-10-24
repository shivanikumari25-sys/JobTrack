# JobTrack

A responsive job-application tracker built with React, Vite, and React Router. Track applications, status changes, interview dates, notes, and profile details.

## Run locally

1. Install Node.js (20.19+ or 22.12+).
2. Run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to create a production bundle.

## Current functionality

- Create, update, filter, and delete job applications.
- View dashboard statistics and organize applications by status.
- Track interview dates in the calendar.
- Save profile and contact form data in the current browser.
- Responsive navigation for desktop and mobile.

## Data and authentication limits

This repository is currently a frontend prototype. Job applications, profile details, and contact messages are stored in browser `localStorage`; they do not sync between browsers or devices and can be cleared by the user. The login/signup pages are not secure authentication: passwords are not sent to a server or saved, and no access control protects application data. Do not use this version for sensitive or production data.

Before production, connect a backend (for example, a managed authentication/database provider or an API with secure sessions), enforce authorization on the server, add database migrations and backups, and configure deployment secrets outside the client bundle.

## Quality checks

- `npm run build`
- `npm run lint`
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# JobTrack
