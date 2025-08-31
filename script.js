async function startLearning() {
  const topic = document.getElementById("topicInput").value.trim();
  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Give me 3 flashcards on ${topic}. Format: Question - Answer`
      }]
    })
  });

  const data = await response.json();
  const rawText = data.choices[0].message.content;
  const cards = rawText.split("\n").filter(line => line.includes(" - "));

  const flashDiv = document.getElementById("flashcards");
  flashDiv.innerHTML = "<h2>Flashcards</h2>";
  cards.forEach(card => {
    const [q, a] = card.split(" - ");
    const div = document.createElement("div");
    div.className = "flashcard";
    div.innerHTML = `<strong>${q}</strong><br>${a}<br><button onclick="responsiveVoice.speak('${a}')">🔊 Listen</button>`;
    flashDiv.appendChild(div);
  });

  generateQuiz(cards);
}

function generateQuiz(cards) {
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "<h2>Quiz</h2>";

  cards.forEach((card, i) => {
    const [q, a] = card.split(" - ");
    const inputId = `answer${i}`;
    quizDiv.innerHTML += `
      <p>${q}<br>
      <input type="text" id="${inputId}" onblur="checkAnswer('${inputId}', '${a}')"></p>
    `;
  });

  localStorage.setItem("lastTopic", document.getElementById("topicInput").value);
}

function checkAnswer(id, correct) {
  const input = document.getElementById(id);
  if (input.value.trim().toLowerCase() === correct.trim().toLowerCase()) {
    input.classList.add("correct");
    input.classList.remove("incorrect");
  } else {
    input.classList.add("incorrect");
    input.classList.remove("correct");
  }
}
