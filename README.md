# Whack-a-Mole (Flask)

A simple browser-based **Whack-a-Mole** game built with Flask for the backend and plain HTML/CSS/JavaScript for the frontend. Features difficulty levels, player name input, score saving via **SQLite + SQLAlchemy**, and a leaderboard.

---

## Demo
Run locally (instructions below) and open `http://127.0.0.1:5000/`.

---

## Features
- Grid-based whack-a-mole gameplay
- Difficulty selection: Easy / Medium / Hard (affects mole speed & visibility)
- Player name input and score saving (SQLite using SQLAlchemy)
- Leaderboard page showing top scores
- Sounds and small animations
- No external database required (uses local SQLite)

---

## Tech Stack
- **Backend:** Python, Flask, Flask-SQLAlchemy
- **Frontend:** HTML, CSS, JavaScript
- **Database:** SQLite (local file)
- **Dependencies:** see `requirements.txt`

---

## Quick start (local)

1. Clone the repo:
```bash
git clone https://github.com/<your-username>/whack-a-mole.git
cd whack-a-mole
