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
    html += `<div class="question">${quesText}</div><ul class="options">`;
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

function showSummary(score, userAnswers) {
  const quiz = document.getElementById('quiz-container');
  const result = document.getElementById('result');
  quiz.innerHTML = '';
  let html = `<div>Bạn đã trả lời đúng <b>${score}/${questions.length}</b> câu.</div>`;
  let wrongs = userAnswers.filter(ans => ans.selected !== ans.correct);
  if (wrongs.length > 0) {
    html += '<div style="margin-top:16px;"><b>Các câu trả lời sai:</b><ol>';
    wrongs.forEach((ans, idx) => {
      let selectedText = ans.selectedText ? `${ans.selected}. ${ans.selectedText}` : 'Không chọn';
      let correctText = ans.correctText ? `${ans.correct}. ${ans.correctText}` : 'Không xác định';
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
