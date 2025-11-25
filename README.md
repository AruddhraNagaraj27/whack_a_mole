# Whack-a-Mole (Flask)

A browser-based **Whack-a-Mole game** built using Python Flask and vanilla HTML/CSS/JavaScript.
Players can choose difficulty, enter their name, and have their scores stored using **SQLite + SQLAlchemy**.
A leaderboard displays the best scores.

---

## 🎮 Demo

Run locally and open in your browser:

```
http://127.0.0.1:5000/
```

---

## ✨ Features

- 🟩 Dynamic grid-based whack-a-mole gameplay
- 🎚 Difficulty modes: Easy / Medium / Hard
- 👤 Player name input
- 💾 Score saving with SQLite & SQLAlchemy
- 📊 Leaderboard for top scores
- 🔊 Background music and sound effects
- ⚡ Level increases make moles appear faster
- 🚫 No external database required

---

## 🧰 Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Backend  | Python, Flask, Flask-SQLAlchemy |
| Frontend | HTML, CSS, JavaScript           |
| Database | SQLite (local file)             |
| Other    | Jinja2 templates                |

---

## 🚀 Quick Start (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/whack_a_mole.git
cd whack_a_mole
```

### 2️⃣ Create a virtual environment (optional)

```bash
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run the Flask app

```bash
python app.py
```

### 5️⃣ Open in browser

```
http://127.0.0.1:5000/
```

---

## 📂 Project Structure

```
whack_a_mole/
│
├── app.py                 # Flask backend
├── requirements.txt
├── ABOUT.md
│
├── static/
│   ├── css/
│   ├── js/
│   └── images/
│
└── templates/
    └── index.html
```

---

## 🏅 Leaderboard

Scores are saved in the local SQLite database.
SQLAlchemy handles:

- Player info
- Scores
- Sorting highest scores first

---

## 👨‍💻 Author

**Aruddhra Nagaraj**
GitHub: [https://github.com/AruddhraNagaraj27](https://github.com/AruddhraNagaraj27)

---

## 📜 License

This project is free to use for learning and academic purposes.

---

Enjoy the game! 🎉
