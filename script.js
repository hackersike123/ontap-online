let questions = [];
const ASCII_A = 65; // Define constant for ASCII 'A'

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    questions = await res.json();
    showAllQuestions();
  } catch (error) {
    console.error("Error loading questions:", error);
    const quiz = document.getElementById('quiz-container');
    quiz.innerHTML = '<p style="color: red;">Không thể tải câu hỏi. Vui lòng kiểm tra file questions.json.</p>';
  }
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
      html += `<li><label><input type="radio" name="q${idx}" value="${opt}"> ${String.fromCharCode(ASCII_A + oidx)}. ${opt}</label></li>`;
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
    let correctText = q.options[q.answer.charCodeAt(0) - ASCII_A];
    let shuffledCorrectIdx = q._shuffled.findIndex(opt => opt === correctText);
    let userSelectedIdx = answer ? q._shuffled.findIndex(opt => opt === answer) : -1;

    // Note: If correctText is not found in _shuffled, shuffledCorrectIdx will be -1.
    // The current logic sets it to 0, which might be incorrect.
    // A more robust approach might be needed if data integrity is a concern.
    // For now, keeping the original logic but adding a comment.
    if (shuffledCorrectIdx === -1) {
        console.warn(`Correct answer "${correctText}" not found in shuffled options for question ${idx + 1}. Defaulting correct index to 0.`);
        shuffledCorrectIdx = 0; // Potentially incorrect if correct answer is truly missing
    }


    // Score calculation based on original correct text vs selected value
    if (answer === correctText) score++;

    userAnswers.push({
      question: q.question.replace(/^\d+\.?\s*/, ''),
      options: q._shuffled,
      correct: String.fromCharCode(ASCII_A + shuffledCorrectIdx),
      correctText: q._shuffled[shuffledCorrectIdx],
      selected: userSelectedIdx !== -1 ? String.fromCharCode(ASCII_A + userSelectedIdx) : null,
      selectedText: userSelectedIdx !== -1 ? q._shuffled[userSelectedIdx] : null,
      // Removed correctOriginText and selectedOriginText as they are redundant
    });
  });
  showSummary(score, userAnswers);
}

function saveHistory(score, userAnswers) {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  } catch (e) {
    console.error("Error parsing history from localStorage:", e);
    // Optionally clear corrupted history: localStorage.removeItem('quizHistory');
  }

  history.push({
    date: new Date().toLocaleString(),
    score: score,
    total: questions.length,
    answers: userAnswers
  });

  try {
    localStorage.setItem('quizHistory', JSON.stringify(history));
  } catch (e) {
    console.error("Error saving history to localStorage:", e);
  }
}

function showHistory() {
  let history = [];
   try {
    history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  } catch (e) {
    console.error("Error parsing history from localStorage:", e);
    // Optionally clear corrupted history: localStorage.removeItem('quizHistory');
  }

  if (history.length === 0) return '';
  let html = '<div class="history"><b>Lịch sử làm bài:</b><ul>';
  // Show last 5 entries, newest first
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
  html += '<div class="answer-review-container">'; // Use a container class
  userAnswers.forEach((ans, idx) => {
    // Use CSS classes instead of inline styles
    html += `<div class='answer-review'>`;
    html += `<b>Câu ${idx+1}:</b> ${ans.question}<br>`;

    // Display selected answer
    let selectedAnswerHtml = 'Không chọn';
    let selectedClass = 'answer-selected answer-incorrect'; // Default to incorrect color
    if (ans.selected && ans.selectedText) {
        selectedAnswerHtml = `${ans.selected} - ${ans.selectedText}`;
        if (ans.selected === ans.correct) {
            selectedClass = 'answer-selected answer-correct'; // Correct color if matches
        }
    } else if (ans.selected) { // Case where selectedText might be missing but selected char exists
         selectedAnswerHtml = `${ans.selected}`;
         if (ans.selected === ans.correct) {
            selectedClass = 'answer-selected answer-correct';
        }
    }

    html += `<span>Đáp án bạn chọn: <b class='${selectedClass}'>${selectedAnswerHtml}</b>`;

    // Display correct answer
    let correctAnswerHtml = 'Không xác định';
    if (ans.correct && ans.correctText) {
        correctAnswerHtml = `${ans.correct} - ${ans.correctText}`;
    } else if (ans.correct) { // Case where correctText might be missing but correct char exists
        correctAnswerHtml = `${ans.correct}`;
    }

    html += ` | Đáp án đúng: <b class='answer-correct'>${correctAnswerHtml}</b></span>`;
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
