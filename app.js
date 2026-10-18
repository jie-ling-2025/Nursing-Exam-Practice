(() => {
  "use strict";
  const questions = window.NURSING_QUESTIONS;
  const form = document.getElementById("quiz-form");
  const list = document.getElementById("question-list");
  const progressLabel = document.getElementById("progress-label");
  const progressPercent = document.getElementById("progress-percent");
  const progressBar = document.getElementById("progress-bar");
  const progressFill = document.getElementById("progress-fill");
  const results = document.getElementById("results");
  const resultStats = document.getElementById("result-stats");
  const scoreSummary = document.getElementById("score-summary");
  const retryButton = document.getElementById("retry-button");
  const cards = new Map();
  let submitted = false;

  function addText(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function renderQuestions() {
    let currentSubject = "";
    let section = null;
    questions.forEach((question) => {
      if (question.subject !== currentSubject) {
        currentSubject = question.subject;
        section = document.createElement("section");
        section.className = "subject-section";
        const heading = addText("h2", "subject-heading", currentSubject);
        section.append(heading);
        list.append(section);
      }

      const fieldset = document.createElement("fieldset");
      fieldset.className = "question-card";
      fieldset.dataset.number = String(question.number);
      const legend = document.createElement("legend");
      const top = document.createElement("div");
      top.className = "question-top";
      top.append(addText("span", "question-number", "第 " + question.number + " 題"));
      legend.append(top);
      fieldset.append(legend);
      fieldset.append(addText("p", "question-stem", question.stem));

      const optionList = document.createElement("div");
      optionList.className = "options";
      Object.entries(question.options).forEach(([letter, text]) => {
        const label = document.createElement("label");
        label.className = "option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "question-" + question.number;
        input.value = letter;
        input.setAttribute("aria-label", "第 " + question.number + " 題，" + letter + "，" + text);
        input.addEventListener("change", updateProgress);
        label.append(input, addText("span", "option-letter", "(" + letter + ")"), addText("span", "option-text", text));
        optionList.append(label);
      });
      fieldset.append(optionList);

      const source = document.createElement("div");
      source.className = "question-meta";
      source.append(
        addText("span", "", question.year + " 年・" + question.session + "・" + question.examName + "（" + question.examCode + "）"),
        addText("span", "", question.subject),
        addText("span", "", "原卷第 " + question.originalNumber + " 題・PDF 第 " + question.pdfPage + " 頁")
      );
      const sourceLink = document.createElement("a");
      sourceLink.href = question.sourceUrl;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      sourceLink.textContent = "考選部試題查詢入口 ↗";
      source.append(sourceLink);
      fieldset.append(source);

      section.append(fieldset);
      cards.set(question.number, fieldset);
    });
  }

  function updateProgress() {
    const answered = questions.reduce((count, question) => {
      return count + (form.querySelector('input[name="question-' + question.number + '"]:checked') ? 1 : 0);
    }, 0);
    const percent = Math.round(answered / questions.length * 100);
    progressLabel.textContent = "已作答 " + answered + " / " + questions.length + " 題";
    progressPercent.textContent = percent + "%";
    progressBar.setAttribute("aria-valuenow", String(answered));
    progressFill.style.width = percent + "%";
  }

  function stat(label, value) {
    const box = document.createElement("div");
    box.className = "stat";
    box.append(addText("strong", "", String(value)), addText("span", "", label));
    return box;
  }

  function submitQuiz() {
    if (submitted) return;
    const answers = questions.map((question) => {
      const selected = form.querySelector('input[name="question-' + question.number + '"]:checked');
      return selected ? selected.value : "";
    });
    const unanswered = answers.filter((answer) => !answer).length;
    if (unanswered > 0) {
      const proceed = window.confirm("還有 " + unanswered + " 題未作答。未作答題目會計為錯誤，仍要交卷嗎？");
      if (!proceed) return;
    }

    submitted = true;
    const correct = questions.reduce((count, question, index) => count + (answers[index] === question.answer ? 1 : 0), 0);
    const wrong = questions.length - correct;
    const score = correct * 5;

    questions.forEach((question, index) => {
      const card = cards.get(question.number);
      const chosen = answers[index];
      card.classList.add(chosen ? (chosen === question.answer ? "result-correct" : "result-incorrect") : "result-blank");
      card.querySelectorAll("input").forEach((input) => {
        input.disabled = true;
        const label = input.closest(".option");
        if (input.value === question.answer) label.classList.add("is-answer");
        if (chosen && input.checked && chosen !== question.answer) label.classList.add("is-picked-wrong");
      });
      const feedback = addText("p", "feedback", (chosen ? "你的答案：" + chosen + "　｜　" : "未作答　｜　") + "官方答案：" + question.answer);
      card.append(feedback);
    });

    scoreSummary.textContent = "答對 " + correct + " 題、答錯 " + wrong + " 題。每題 5 分，滿分 100 分。";
    resultStats.replaceChildren(stat("本次得分", score + " 分"), stat("答對題數", correct + " / 20"), stat("答錯題數", wrong + " / 20"));
    results.hidden = false;
    document.getElementById("submit-hint").textContent = "已完成本次作答。";
    form.querySelector('[type="submit"]').disabled = true;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuiz();
  });

  retryButton.addEventListener("click", () => {
    form.reset();
    submitted = false;
    results.hidden = true;
    resultStats.replaceChildren();
    scoreSummary.textContent = "";
    document.getElementById("submit-hint").textContent = "作答完成後即可交卷查看分數與官方答案。";
    form.querySelector('[type="submit"]').disabled = false;
    cards.forEach((card) => {
      card.classList.remove("result-correct", "result-incorrect", "result-blank");
      card.querySelector(".feedback")?.remove();
      card.querySelectorAll(".option").forEach((option) => option.classList.remove("is-answer", "is-picked-wrong"));
      card.querySelectorAll("input").forEach((input) => { input.disabled = false; });
    });
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  renderQuestions();
  updateProgress();
})();
