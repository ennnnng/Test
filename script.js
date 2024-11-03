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
    const formTitle = document.getElementById('formTitle').value || "Untitled Form";
    const formDescription = document.getElementById('formDescription').value || "No Description";
    
    const questionText = [];
    const questionType = [];
    const questionElements = document.querySelectorAll('#questionsContainer .question');

    questionElements.forEach(questionElement => {
        questionText.push(questionElement.querySelector('input[name="questionText[]"]').value);
        questionType.push(questionElement.querySelector('select[name="questionType[]"]').value);
    });

    // Construct the query string for the GET request
    const queryParams = new URLSearchParams({
        formTitle: formTitle,
        formDescription: formDescription,
        questionText: JSON.stringify(questionText),
        questionType: JSON.stringify(questionType)
    }).toString();

    // Use the CORS proxy to bypass CORS issues
    const scriptUrl = `https://script.google.com/macros/s/AKfycbxarB8ZMSUKO0754qssUcMe_pOIP6U2xInHrgoupHmis9ojTWlFSw5dqboAfJWcrwSG/exec?${queryParams}`;
    const corsProxy = "https://cors-anywhere.herokuapp.com/";  // Add the CORS proxy prefix

    fetch(corsProxy + scriptUrl)
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



//const scriptUrl = 'https://script.google.com/macros/s/AKfycbxarB8ZMSUKO0754qssUcMe_pOIP6U2xInHrgoupHmis9ojTWlFSw5dqboAfJWcrwSG/exec';


/*

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
            <label>
                <input type="radio" name="scale[]" value="Strongly Disagree"> Strongly Disagree
            </label>
            <label>
                <input type="radio" name="scale[]" value="Disagree"> Disagree
            </label>
            <label>
                <input type="radio" name="scale[]" value="Neutral"> Neutral
            </label>
            <label>
                <input type="radio" name="scale[]" value="Agree"> Agree
            </label>
            <label>
                <input type="radio" name="scale[]" value="Strongly Agree"> Strongly Agree
            </label>
        </div>
    `;
    container.appendChild(questionDiv);
}

function toggleScaleOptions(selectElement) {
    const multipleChoiceDiv = selectElement.closest('.question').querySelector('.multiple-choice');
    if (selectElement.value === 'SCALE') {
        multipleChoiceDiv.style.display = 'block';
    } else {
        multipleChoiceDiv.style.display = 'none';
    }
}

function generateGoogleForm() {
    console.log("Button pressed");  // Check if button press is registered

    // Initialize the data object with title and description
    const data = {
        formTitle: document.getElementById('formTitle')?.value || "Untitled Form",
        formDescription: document.getElementById('formDescription')?.value || "No Description",
        questionText: [],
        questionType: []
    };

    // Collect question data from dynamically added questions
    const questionElements = document.querySelectorAll('#questionsContainer .question');
    questionElements.forEach(questionElement => {
        const questionText = questionElement.querySelector('input[name="questionText[]"]')?.value || "";
        const questionType = questionElement.querySelector('select[name="questionType[]"]')?.value || "TEXT";
        
        // Add each question's text and type to the data object
        data.questionText.push(questionText);
        data.questionType.push(questionType);
    });

    console.log("Data sent to Google Apps Script:", data);  // Log data to confirm it's structured correctly

    // Send data to the local proxy server
    fetch('http://localhost:3000/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        console.log("Response from Google Apps Script through proxy:", result); 
        if (result.success) {
            alert("Google Form generated: " + result.formUrl);
            window.open(result.formUrl, "_blank");
        } else {
            alert("Error generating form");
        }
    })
    .catch(error => console.error("Error:", error));
}


*/





/*
function generateGoogleForm() {
  const formData = new FormData(document.getElementById('formGenerator'));
  const data = {};

  for (let [key, value] of formData.entries()) {
    if (!data[key]) {
      data[key] = [];
    }
    data[key].push(value);
  }

  fetch('https://script.google.com/macros/s/AKfycbxarB8ZMSUKO0754qssUcMe_pOIP6U2xInHrgoupHmis9ojTWlFSw5dqboAfJWcrwSG/exec', 
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

*/



//-----------------------------------------------------------------------------------------------

/*
Web app
URL
https://script.google.com/macros/s/AKfycbxarB8ZMSUKO0754qssUcMe_pOIP6U2xInHrgoupHmis9ojTWlFSw5dqboAfJWcrwSG/exec

Deployment ID
AKfycbxarB8ZMSUKO0754qssUcMe_pOIP6U2xInHrgoupHmis9ojTWlFSw5dqboAfJWcrwSG

nstall http-server by running:
npm install -g http-server
Start the server with CORS enabled:
http-server --cors
This will start a server with CORS enabled, usually accessible at 
Available on:
  http://192.168.8.139:8080
  http://127.0.0.1:8080
Hit CTRL-C to stop the server
Open your HTML page on one of them and test the form generation.
when you start your local server it will generate Available...and you can choose one of them
but you have to set the command widow to your project to launch the page on the server


function submitForm() {
  const formData = new FormData(document.getElementById('formGenerator'));
  const data = {};
  for (let [key, value] of formData.entries()) {
    if (!data[key]) {
      data[key] = [];
    }
    data[key].push(value);
  }

  fetch('<AKfycbz9DOx8EYt2zfJKXyeAFhKOfYUx9kN3iajCAm6FDpo>', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
*/
