async function startLearning() {
  const topic = document.getElementById("topicInput").value.trim();
  if (!topic) {
    alert("Por favor, digite um tópico.");
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
    div.innerHTML = `<strong>${q}</strong><br>${a}<br><button onclick="responsiveVoice.speak('${a}', 'Portuguese Female')">🔊 Ouvir</button>`;
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
