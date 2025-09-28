// Global variables
let students = [];
let counter = 0;

// Get elements
const form = document.getElementById('registrationForm');
const cardsContainer = document.getElementById('cardsContainer');
const summaryTable = document.getElementById('summaryTable');
const feedback = document.getElementById('feedback');

// Validation functions
function validateFirstName(value) {
  const error = document.getElementById('firstNameError');
  if (value.trim().length < 2) {
    error.textContent = 'First name must be at least 2 characters.';
    return false;
  }
  error.textContent = '';
  return true;
}

function validateLastName(value) {
  const error = document.getElementById('lastNameError');
  if (value.trim().length < 2) {
    error.textContent = 'Last name must be at least 2 characters.';
    return false;
  }
  error.textContent = '';
  return true;
}

function validateEmail(value) {
  const error = document.getElementById('emailError');
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) {
    error.textContent = 'Please enter a valid email.';
    return false;
  }
  error.textContent = '';
  return true;
}

function validateProgramme(value) {
  const error = document.getElementById('programmeError');
  if (value.trim().length < 2) {
    error.textContent = 'Programme must be at least 2 characters.';
    return false;
  }
  error.textContent = '';
  return true;
}

function validateYear(value) {
  const error = document.getElementById('yearError');
  if (!value) {
    error.textContent = 'Please select a year.';
    return false;
  }
  error.textContent = '';
  return true;
}

function validatePhoto(input) {
  const error = document.getElementById('photoError');
  if (!input.files || input.files.length === 0) {
    error.textContent = 'Please select a photo.';
    return false;
  }
  
  const file = input.files[0];
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    error.textContent = 'Please select a valid image file (jpg, png, gif, webp).';
    return false;
  }
  
  error.textContent = '';
  return true;
}

// Add real-time validation
document.getElementById('firstName').addEventListener('input', function(e) {
  validateFirstName(e.target.value);
});

document.getElementById('lastName').addEventListener('input', function(e) {
  validateLastName(e.target.value);
});

document.getElementById('email').addEventListener('input', function(e) {
  validateEmail(e.target.value);
});

document.getElementById('programme').addEventListener('input', function(e) {
  validateProgramme(e.target.value);
});

document.getElementById('year').addEventListener('change', function(e) {
  validateYear(e.target.value);
});

document.getElementById('photo').addEventListener('change', function(e) {
  validatePhoto(e.target);
});

// Create card
function createCard(student) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = student.id;

  card.innerHTML = `
    <img src="${student.photo}" alt="Photo">
    <h3>${student.firstName} ${student.lastName}</h3>
    <p>${student.email}</p>
    <div>
      <span class="badge">${student.programme}</span>
      <span class="badge">Year ${student.year}</span>
    </div>
    ${student.interests ? `<p><em>${student.interests}</em></p>` : ''}
    <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
    <button class="remove-btn" onclick="removeStudent(${student.id})">Remove</button>
  `;

  cardsContainer.appendChild(card);
}

// Add table row
function addTableRow(student) {
  const row = document.createElement('tr');
  row.dataset.id = student.id;
  
  row.innerHTML = `
    <td>${student.firstName} ${student.lastName}</td>
    <td>${student.email}</td>
    <td>${student.programme}</td>
    <td>${student.year}</td>
    <td>
      <button class="table-edit-btn" onclick="editStudent(${student.id})">Edit</button>
      <button class="table-btn" onclick="removeStudent(${student.id})">Remove</button>
    </td>
  `;
  
  summaryTable.appendChild(row);
}

// Edit student
function editStudent(id) {
  const student = students.find(s => s.id === id);
  if (student) {
    // Fill the form with student data
    document.getElementById('firstName').value = student.firstName;
    document.getElementById('lastName').value = student.lastName;
    document.getElementById('email').value = student.email;
    document.getElementById('programme').value = student.programme;
    document.getElementById('year').value = student.year;
    document.getElementById('interests').value = student.interests;
    
    // Remove the student (we'll add them back when form is submitted)
    removeStudent(id);
    
    // Scroll to top of form
    document.querySelector('.reg-box').scrollIntoView({ behavior: 'smooth' });
    
    feedback.textContent = 'Student loaded for editing. Make changes and click Add Student.';
    setTimeout(() => feedback.textContent = '', 4000);
  }
}

// Remove student
function removeStudent(id) {
  students = students.filter(s => s.id !== id);

  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) card.remove();

  const row = summaryTable.querySelector(`[data-id="${id}"]`);
  if (row) row.remove();

  feedback.textContent = 'Student removed!';
  setTimeout(() => feedback.textContent = '', 2000);
}

// Form submit
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const programme = document.getElementById('programme').value;
  const year = document.getElementById('year').value;
  const interests = document.getElementById('interests').value;
  const photoInput = document.getElementById('photo');

  // Validate
  const valid = validateFirstName(firstName) &&
                validateLastName(lastName) &&
                validateEmail(email) &&
                validateProgramme(programme) &&
                validateYear(year) &&
                validatePhoto(photoInput);

  if (valid) {
    const file = photoInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      counter++;
      const student = {
        id: counter,
        firstName,
        lastName,
        email,
        programme,
        year,
        interests,
        photo: e.target.result
      };

      students.push(student);
      createCard(student);
      addTableRow(student);

      form.reset();
      feedback.textContent = 'Student added successfully!';
      setTimeout(() => feedback.textContent = '', 2000);
    };
    
    reader.readAsDataURL(file);
  } else {
    feedback.textContent = 'Please fix all errors first.';
  }
});