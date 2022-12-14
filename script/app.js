// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const modalNext = document.querySelector(".modal-next");
const modalPrevious = document.querySelector(".modal-prev");
const nameSearch = document.getElementById("nameSearch");

fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err));

function displayEmployees(employeeData) {
  employees = employeeData;
  // store the employee HTML as we create it
  let employeeHTML = "";
  // loop through each employee and create HTML markup
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;
    // template literals make this so much cleaner!
    employeeHTML += `
<div class="card" data-index="${index}">
<img class="avatar" src="${picture.large}" />
<div class="text-container">
<h2 class="name">${name.first} ${name.last}</h2>
<p class="email">${email}</p>
<p class="address">${city}</p>
</div>
</div>
`;
  });
  gridContainer.innerHTML = employeeHTML;
}

function displayModal(index) {
  // use object destructuring make our template literal cleaner
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];
  let date = new Date(dob.date);
  const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    <hr />
    <p>${phone}</p>
    <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
    <p>Birthday:
    ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    `;
  overlay.classList.remove("hidden");
  console.log(modalHTML);
  modalContainer.innerHTML = modalHTML;
  modalContainer.style.display = "block";
}

gridContainer.addEventListener("click", (e) => {
  // make sure the click is not on the gridContainer itself
  if (e.target !== gridContainer) {
    // select the card element based on its proximity to actual element

    const card = e.target.closest(".card");
    var index = card.getAttribute("data-index");
    displayModal(index);
  }

  modalNext.addEventListener("click", () => {
    if (index < employees.length - 1) {
      index++;
      displayModal(index);
      console.log(index);
    }
  });

  modalPrevious.addEventListener("click", () => {
    if (index > 0) {
      index--;
      displayModal(index);
      console.log(index);
    }
  });
});

modalClose.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// search for names
nameSearch.addEventListener("keyup", (e) => {
  let currentValue = e.target.value.toLowerCase();
  let foundUsersIndex = [];

  employees.filter((employee, i) => {
    const name = String(employee.name.first + employee.name.last).toLowerCase();

    if (name.includes(currentValue)) {
      foundUsersIndex.push(i);
    }

    return name.includes(currentValue);
  });

  document.querySelectorAll(".card").forEach((card) => {
    foundUsersIndex.includes(parseInt(card.dataset.index))
      ? (card.style.display = "flex")
      : (card.style.display = "none");
  });
});
