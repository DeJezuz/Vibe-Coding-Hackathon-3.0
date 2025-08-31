async function startLearning() {
  const topic = document.getElementById("topicInput").value;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_OPENAI_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Give me 3 flashcards on ${topic}. Format: Question - Answer` }]
    })
  });

  const data = await response.json();
  const cards = data.choices[0].message.content.split("\n").filter(line => line.includes("-"));
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
  let score = 0;

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
    input.className = "correct";
  } else {
    input.className = "incorrect";
  }
}
