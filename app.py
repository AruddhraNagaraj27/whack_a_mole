from flask import Flask, jsonify, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import random
import os

app = Flask(__name__)

# --- Configuration ---
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "whack_a_mole.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Models ---
class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(120), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Score {self.player_name} {self.score}>"

# Create DB if not exists
with app.app_context():
    db.create_all()

# Game variables (server-side minimal state)
score = 0
level = 1

# --- Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_mole_position/<int:size>', methods=['GET'])
def get_mole_position(size):
    mole_position = random.randint(1, size * size)
    return jsonify({"position": mole_position})

@app.route('/save_score', methods=['POST'])
def save_score():
    """
    Expects JSON: { "player_name": "...", "score": <int>, "difficulty": "Easy" }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    player_name = data.get('player_name', '').strip() or "Anonymous"
    score_value = int(data.get('score', 0))
    difficulty = data.get('difficulty', 'Unknown')

    new_score = Score(player_name=player_name, score=score_value, difficulty=difficulty)
    db.session.add(new_score)
    db.session.commit()

    return jsonify({"status": "saved", "id": new_score.id})

@app.route('/leaderboard')
def leaderboard():
    # Top 10 scores descending
    top_scores = Score.query.order_by(Score.score.desc(), Score.created_at.asc()).limit(10).all()
    return render_template('leaderboard.html', scores=top_scores)

@app.route('/reset_game', methods=['POST'])
def reset_game():
    global score, level
    score = 0
    level = 1
    return jsonify({"score": score, "level": level})

if __name__ == '__main__':
    # For development use. In production set debug=False and use a WSGI server.
    app.run(debug=True)
