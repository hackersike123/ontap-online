let questions = [];
let shuffledQuestions = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadQuestions() {
  const res = await fetch('questions.json');
  questions = await res.json();
  shuffledQuestions = [...questions];
  shuffleArray(shuffledQuestions);
  showAllQuestions();
}

function showAllQuestions() {
  const quiz = document.getElementById('quiz-container');
  const result = document.getElementById('result');
  result.textContent = '';
  document.getElementById('restart-btn').style.display = 'none';

  let html = '<form id="quiz-form">';
  shuffledQuestions.forEach((q, idx) => {
    html += `<div class="question">Câu ${idx + 1}: ${q.question}</div><ul class="options">`;
    q.options.forEach((opt, oidx) => {
      html += `<li><label><input type="radio" name="q${idx}" value="${String.fromCharCode(65+oidx)}"> ${opt}</label></li>`;
    });
    html += '</ul>';
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
  shuffledQuestions.forEach((q, idx) => {
    const selected = document.querySelector(`input[name='q${idx}']:checked`);
    const answer = selected ? selected.value : null;
    if (answer === q.answer) score++;
    userAnswers.push({
      question: q.question,
      options: q.options,
      correct: q.answer,
      selected: answer
    });
  });
  showSummary(score, userAnswers);
}

function showSummary(score, userAnswers) {
  const quiz = document.getElementById('quiz-container');
  const result = document.getElementById('result');
  quiz.innerHTML = '';
  let html = `<div>Bạn đã trả lời đúng <b>${score}/${shuffledQuestions.length}</b> câu.</div>`;
  let wrongs = userAnswers.filter(ans => ans.selected !== ans.correct);
  if (wrongs.length > 0) {
    html += '<div style="margin-top:16px;"><b>Các câu trả lời sai:</b><ol>';
    wrongs.forEach((ans, idx) => {
      // Tìm nội dung đáp án đã chọn
      let selectedIdx = ans.selected ? ans.selected.charCodeAt(0) - 65 : -1;
      let correctIdx = ans.correct ? ans.correct.charCodeAt(0) - 65 : -1;
      let selectedText = (selectedIdx >= 0 && ans.options[selectedIdx]) ? `${ans.selected}. ${ans.options[selectedIdx]}` : 'Không chọn';
      let correctText = '';
      if (correctIdx >= 0 && ans.options[correctIdx]) {
        correctText = `${ans.correct}. ${ans.options[correctIdx]}`;
      } else {
        correctText = 'Không xác định (bạn cần kiểm tra lại dữ liệu)';
      }
      html += `<li><div style='margin-bottom:4px;'>${ans.question}</div>`;
      html += `<div>Đáp án của bạn: <b>${selectedText}</b></div>`;
      html += `<div>Đáp án đúng: <b>${correctText}</b></div>`;
      html += '<ul>';
      ans.options.forEach((opt, oidx) => {
        html += `<li>${String.fromCharCode(65+oidx)}. ${opt}</li>`;
      });
      html += '</ul></li>';
    });
    html += '</ol></div>';
  }
  document.getElementById('restart-btn').style.display = 'inline-block';
  result.innerHTML = html;
}

document.getElementById('restart-btn').onclick = function() {
  loadQuestions();
};

window.onload = loadQuestions;
