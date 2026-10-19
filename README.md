# FitApp

A personal workout, nutrition and pantry application built with vanilla JavaScript. Runs in a browser or as an Electron desktop app.

## Features

- Workout calendar, exercise routines, timers and training history.
- Meal planning, recipe suggestions and nutrition summaries.
- Pantry inventory and shopping lists.
- Profile, weight and measurement tracking stored locally.
- JSON import/export and light/dark themes.

## Run in a browser

Requires Python 3 for this optional local static server:

```sh
git clone https://github.com/rubensauriosD/FitApp.git
cd FitApp
python3 -m http.server 3459 --bind 127.0.0.1
```

Open `http://localhost:3459`. Chart.js is loaded from a CDN, so charts need an internet connection. No backend or account is required.

## Run with Electron

Requires Node.js and npm:

```sh
npm ci
npm start
```

The existing `npm run build` command packages the macOS desktop application. Packaging requires the corresponding platform tools.

## Data and privacy

Personal entries are stored in browser/Electron localStorage. This repository contains application code and built-in recipe/routine data, not a personal profile, workout history, health records or backup exports. Use a separate browser origin when trying a copy alongside an existing installation; localStorage is scoped to its origin.

JSON backups can contain personal information. Keep them out of Git. The public source uses a generic initial greeting; enter your own profile in the app.

This is a personal, local-use project.

## Structure

```text
index.html       Application shell
css/             Responsive styles and themes
js/              Workouts, nutrition, pantry, shopping, profile and storage
electron/        Desktop window and import/export bridge
```

Built by [Ruben Bazan](https://github.com/rubensauriosD).
