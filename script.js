let questions = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadQuestions() {
  const res = await fetch('questions.json');
  questions = await res.json();
  showAllQuestions();
}

function showAllQuestions() {
  const quiz = document.getElementById('quiz-container');
  const result = document.getElementById('result');
  result.textContent = '';
  document.getElementById('restart-btn').style.display = 'none';

  let html = '<form id="quiz-form">';
  questions.forEach((q, idx) => {
    // Xáo trộn vị trí đáp án cho từng câu nhưng không xáo trộn nhãn A, B, C, D
    let opts = q.options.slice();
    shuffleArray(opts);
    // Loại bỏ số thứ tự đầu câu hỏi nếu có
    let quesText = q.question.replace(/^\d+\.?\s*/, '');
    html += `<div class="question"><b>Câu ${idx + 1}.</b> ${quesText}</div><ul class="options">`;
    opts.forEach((opt, oidx) => {
      html += `<li><label><input type="radio" name="q${idx}" value="${opt}"> ${String.fromCharCode(65+oidx)}. ${opt}</label></li>`;
    });
    html += '</ul>';
    // Lưu lại thứ tự đáp án đã xáo trộn để kiểm tra đáp án đúng khi nộp bài
    q._shuffled = opts;
  });
  html += '<button type="submit" id="submit-btn">Nộp bài</button>';
  html += '</form>';
  quiz.innerHTML = html;

  document.getElementById('quiz-form').onsubmit = function(e) {
    e.preventDefault();
    submitAllAnswers();
  };
}

function submitAllAnswers() {
  let score = 0;
  let userAnswers = [];
  questions.forEach((q, idx) => {
    const selected = document.querySelector(`input[name='q${idx}']:checked`);
    const answer = selected ? selected.value : null;
    // Tìm đáp án đúng theo vị trí đã xáo trộn
    let correctText = q.options[q.answer.charCodeAt(0) - 65];
    let shuffledCorrectIdx = q._shuffled.findIndex(opt => opt === correctText);
    let userSelectedText = answer;
    if (shuffledCorrectIdx === -1) shuffledCorrectIdx = 0;
    if (answer === correctText) score++;
    userAnswers.push({
      question: q.question.replace(/^\d+\.?\s*/, ''),
      options: q._shuffled,
      correct: String.fromCharCode(65 + shuffledCorrectIdx),
      correctText: correctText,
      selected: answer ? String.fromCharCode(65 + q._shuffled.findIndex(opt => opt === answer)) : null,
      selectedText: userSelectedText
    });
  });
  showSummary(score, userAnswers);
}

function saveHistory(score, userAnswers) {
  let history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  history.push({
    date: new Date().toLocaleString(),
    score: score,
    total: questions.length,
    answers: userAnswers
  });
  localStorage.setItem('quizHistory', JSON.stringify(history));
}

function showHistory() {
  let history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  if (history.length === 0) return '';
  let html = '<div class="history"><b>Lịch sử làm bài:</b><ul>';
  history.slice(-5).reverse().forEach(h => {
    html += `<li>${h.date}: <b>${h.score}/${h.total}</b></li>`;
  });
  html += '</ul></div>';
  return html;
}

function showSummary(score, userAnswers) {
  const quiz = document.getElementById('quiz-container');
  const result = document.getElementById('result');
  quiz.innerHTML = '';
  let html = `<div>Bạn đã trả lời đúng <b>${score}/${questions.length}</b> câu.</div>`;
  html += showHistory();
  html += '<div style="margin-top:20px">';
  userAnswers.forEach((ans, idx) => {
    html += `<div class='answer-review' style='margin-bottom:16px;padding:10px 0;border-bottom:1px solid #eee'>`;
    html += `<b>Câu ${idx+1}:</b> ${ans.question}<br>`;
    html += `<span>Đáp án bạn chọn: <b style='color:${ans.selected === ans.correct ? '#228B22':'#d00'}'>${ans.selected ? ans.selected : 'Không chọn'}</b> | Đáp án đúng: <b style='color:#228B22'>${ans.correct ? ans.correct : 'Không xác định'}</b></span>`;
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('restart-btn').style.display = 'inline-block';
  result.innerHTML = html;
  saveHistory(score, userAnswers);
}

document.getElementById('restart-btn').onclick = function() {
  loadQuestions();
};

window.onload = loadQuestions;
