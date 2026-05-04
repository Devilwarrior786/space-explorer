// =====================================================
// quiz.js — Space quiz logic (10 random questions)
// =====================================================

class Quiz {
  constructor() {
    this.questions = [];
    this.index     = 0;
    this.score     = 0;
    this.answered  = false;
  }

  // Start a fresh quiz with 10 shuffled questions
  start() {
    // Shuffle and pick 10
    const shuffled   = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    this.questions   = shuffled.slice(0, 10);
    this.index       = 0;
    this.score       = 0;
    this.answered    = false;
    this._render();
  }

  _render() {
    const isFinished = this.index >= this.questions.length;

    document.getElementById('quiz-body').style.display   = isFinished ? 'none' : 'block';
    document.getElementById('quiz-result').classList.toggle('hidden', !isFinished);

    if (isFinished) { this._showResult(); return; }

    const q = this.questions[this.index];

    // Progress bar
    const pct = (this.index / this.questions.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('q-counter').textContent = `Question ${this.index + 1} of ${this.questions.length}`;

    // Question text
    document.getElementById('quiz-q').textContent = q.q;

    // Options
    const container = document.getElementById('quiz-opts');
    container.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn       = document.createElement('button');
      btn.className   = 'opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this._answer(i));
      container.appendChild(btn);
    });

    this.answered = false;
  }

  _answer(chosen) {
    if (this.answered) return;
    this.answered = true;

    const q       = this.questions[this.index];
    const correct = q.ans;
    const btns    = document.querySelectorAll('.opt-btn');

    // Highlight correct / wrong
    btns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correct)                  btn.classList.add('correct');
      else if (i === chosen && i !== correct) btn.classList.add('wrong');
    });

    if (chosen === correct) this.score++;

    // Advance after 1.3 s
    setTimeout(() => {
      this.index++;
      this._render();
    }, 1300);
  }

  _showResult() {
    document.getElementById('progress-fill').style.width = '100%';
    const total = this.questions.length;
    const pct   = this.score / total;

    let emoji, msg;
    if (pct === 1)       { emoji = '🏆'; msg = 'Perfect score! You\'re a true Space Explorer!'; }
    else if (pct >= 0.7) { emoji = '🚀'; msg = 'Great job! The cosmos holds no secrets from you.'; }
    else if (pct >= 0.5) { emoji = '🌟'; msg = 'Not bad! Keep exploring to learn more.'; }
    else                 { emoji = '🌍'; msg = 'Keep exploring — the universe has so much more to teach you!'; }

    document.getElementById('res-emoji').textContent = emoji;
    document.getElementById('res-score').textContent = `${this.score} / ${total}`;
    document.getElementById('res-msg').textContent   = msg;
  }
}
