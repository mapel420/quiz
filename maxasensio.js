document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quizForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        validateForm();
    });

    // Fetch questions from the JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            displayQuestions(data.questions);
        })
        .catch(error => {
            console.log('Error fetching questions:', error);
        });

    function validateForm() {
        // Reset all error messages
        const errorMessages = document.querySelectorAll('.error');
        errorMessages.forEach(errorMessage => {
            errorMessage.textContent = '';
        });
        let hasErrors = false;

        // Validate first name
        const firstNameInput = document.getElementById('firstName');
        if (!firstNameInput.validity.valid) {
            document.getElementById('firstNameError').textContent = 'Please enter a valid first name';
            hasErrors = true;
        }

        // Validate last name
        const lastNameInput = document.getElementById('lastName');
        if (!lastNameInput.validity.valid) {
            document.getElementById('lastNameError').textContent = 'Please enter a valid last name';
            hasErrors = true;
        }

        // Validate email
        const emailInput = document.getElementById('email');
        if (!emailInput.validity.valid) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            hasErrors = true;
        }

        // Check if there are any text inputs (required questions) with empty answers
        const textInputs = document.querySelectorAll('input[type="text"][required]');
		textInputs.forEach(input => {
			if (!input.value.trim()) {
				const questionId = input.getAttribute('name').replace('text_', '');
				document.getElementById(questionId + 'Error').textContent = 'Please answer this question';
				hasErrors = true;
			}
		});

        if (hasErrors) {
            // Display error message for required questions
            document.getElementById('requiredQuestionsError').textContent = 'Please answer all required questions';
        } else {
            // Hide the error message for required questions
            document.getElementById('requiredQuestionsError').textContent = '';

            // Hide the form and show success message
            document.getElementById('quizForm').style.display = 'none';
            successMessage.style.display = 'block'; // Show success message
        }
    }

    function displayQuestions(questions) {
        const quizContainer = document.getElementById('quizContainer');
        questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            const questionText = document.createElement('h2');
            questionText.textContent = question.question;
            questionElement.appendChild(questionText);

            // Create appropriate input elements based on question type
            if (question.type === 'radio' || question.type === 'checkbox') {
                const optionsList = document.createElement('ul');
                optionsList.classList.add('options');
                question.options.forEach(option => {
                    const optionItem = document.createElement('li');
                    const optionLabel = document.createElement('label');
                    const optionInput = document.createElement('input');
                    optionInput.setAttribute('type', question.type);
                    optionInput.setAttribute('name', question.id);
                    optionLabel.appendChild(optionInput);
                    optionLabel.appendChild(document.createTextNode(option));
                    optionItem.appendChild(optionLabel);
                    optionsList.appendChild(optionItem);
                });
                questionElement.appendChild(optionsList);
            } else if (question.type === 'text') {
                const textInputContainer = document.createElement('div'); // Container for input and required star
                textInputContainer.classList.add('text-input-container');
                const textInput = document.createElement('input');
                textInput.setAttribute('type', 'text');
                textInput.setAttribute('name', 'text_' + question.id);
                textInput.setAttribute('required', question.required ? 'required' : '');
                textInputContainer.appendChild(textInput);
                // Check if the question is required and add the required star
                if (question.required) {
                    const requiredStar = document.createElement('span');
                    requiredStar.textContent = '*';
                    requiredStar.classList.add('required-star');
                    textInputContainer.appendChild(requiredStar);
                }
                questionElement.appendChild(textInputContainer);
            }
            quizContainer.appendChild(questionElement);
        });
    }
});
