function addQuestion() {
    const container = document.getElementById('questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    questionDiv.innerHTML = `
        <label class="category-select">Category:</label>
        <select name="category[]" class="category-select">
            <option value="K1">K1</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
            <option value="S4">S4</option>
            <option value="V1">V1</option>
            <option value="V2">V2</option>
            <option value="Feedback">Feedback about the course</option>
        </select>

        <label>Question Text:</label>
        <input type="text" name="questionText[]" required>

        <label>Question Type:</label>
        <select name="questionType[]" onchange="toggleScaleOptions(this)">
            <option value="TEXT">Short Answer</option>
            <option value="PARAGRAPH">Paragraph</option>
            <option value="SCALE">Scale</option>
        </select>

        <div class="multiple-choice" style="display: none;">
            <label><input type="radio" name="scale[]" value="Strongly Disagree"> Strongly Disagree</label>
            <label><input type="radio" name="scale[]" value="Disagree"> Disagree</label>
            <label><input type="radio" name="scale[]" value="Neutral"> Neutral</label>
            <label><input type="radio" name="scale[]" value="Agree"> Agree</label>
            <label><input type="radio" name="scale[]" value="Strongly Agree"> Strongly Agree</label>
        </div>
    `;
    container.appendChild(questionDiv);
}

function toggleScaleOptions(selectElement) {
    const multipleChoiceDiv = selectElement.closest('.question').querySelector('.multiple-choice');
    multipleChoiceDiv.style.display = (selectElement.value === 'SCALE') ? 'block' : 'none';
}


function generateGoogleForm() {
    const data = {
        formTitle: document.getElementById('formTitle').value || "Untitled Form",
        formDescription: document.getElementById('formDescription').value || "No Description",
        questionText: [],
        questionType: []
    };

    const questionElements = document.querySelectorAll('#questionsContainer .question');
    questionElements.forEach(questionElement => {
        const questionText = questionElement.querySelector('input[name="questionText[]"]').value;
        const questionType = questionElement.querySelector('select[name="questionType[]"]').value;

        data.questionText.push(questionText);
        data.questionType.push(questionType);
    });

    // Ensure you've defined the proxy script URL correctly
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxarB8ZMSUKO0754qssUcMe_pOIP6U2xInHrgoupHmis9ojTWlFSw5dqboAfJWcrwSG/exec';

    fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("Google Form generated: " + result.formUrl);
            window.open(result.formUrl, "_blank");
        } else {
            alert("Error generating form");
        }
    })
    .catch(error => console.error("Error:", error));
}
