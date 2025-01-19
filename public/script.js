document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('notesFile');
    const formData = new FormData();
    formData.append('notesFile', fileInput.files[0]);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const questions = await response.json();
    displayQuestions(questions);
});

function displayQuestions(questions) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.question}</p>
            ${question.options.map((option, i) => `
                <label>
                    <input type="radio" name="question${index}" value="${option}">
                    ${option}
                </label>
            `).join('')}
        `;
        container.appendChild(questionDiv);
    });
}
