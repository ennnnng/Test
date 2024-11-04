function generateGoogleForm() {
    // Initialize data object
    const data = {
        formTitle: document.getElementById('formTitle').value || "Untitled Form",
        formDescription: document.getElementById('formDescription').value || "No Description",
        questionText: [],
        questionType: []
    };

    // Collect question text and type from the form inputs
    const questionElements = document.querySelectorAll('#questionsContainer .question');
    questionElements.forEach(questionElement => {
        const questionText = questionElement.querySelector('input[name="questionText[]"]').value;
        const questionType = questionElement.querySelector('select[name="questionType[]"]').value;

        data.questionText.push(questionText);  // Add question text to data array
        data.questionType.push(questionType);  // Add question type to data array
    });

    // Define the CORS proxy URL for the Google Apps Script
    const scriptUrl = 'https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbxarB8ZMSUKO0754qssUcMe_pOIP6U2xInHrgoupHmis9ojTWlFSw5dqboAfJWcrwSG/exec';  // Replace with actual URL

    // Check the data structure in the console for debugging
    console.log("Data to send:", JSON.stringify(data));

    // Send the request using fetch
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
