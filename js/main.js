//Language specific things
const ar = {
  thanks      : "<p>شكرا لتسجيلك، سنقوم بالتواصل معك قريبا لتأكيد ميعاد المقابلة </p>",
  error       : "<p>حدث خطأ ما، حاول مرةأخرى</p>",
  fill        : "فضلا املأ هذا الفراغ",
  validEmail  : "أدخل بريد الكتروني صحيح",
  validPhone  : "أدخل رقم موبايل صحيح",
  fill2       : "هذا الفراغ لا بد أن يملأ بما لا يقل عن كلمتين",
  answer      : "أجب عن هذه الأسئلة",
  location    : '../ar/location.html'
};

const en = {
  thanks      : "<p>Thank you for your registration, We will call you soon to confirm your appointment.</p>",
  error       : "<p>An error occured, please try again.</p>",
  fill        : "Please fill in this field",
  validEmail  : "Please enter a valid email",
  validPhone  : "Enter a valid phone number",
  fill2       : "This field must be at least 2 words",
  answer      : "Answer the questions",
  location    : '../location.html'
}


// validateEmpty the form
// get the form inputs
let formFields = document.querySelectorAll(
  ".card input, .card select, .card textarea"
);

// validation
function validation() {
  validateEmpty(this);

  // validation on stop typing

  // validate email
  if (this.type == "email") {
    validateEmail(this);
  }

  // validate phone
  if (this.type == "tel") {
    validatePhone(this);
  }

  // // validate textarea
  if (this.tagName.toLowerCase() == "textarea" && this.hasAttribute("required")) {
    validateTextArea(this);
  }

}

// validateEmpty the fields on blur
formFields.forEach(field => {
  // validate on blur
  field.addEventListener("blur", validation);

  // validate on typing
  field.addEventListener("keydown", validation);
  
  // validate on change
  field.addEventListener("change", validation);
  
  //   save data on reload
  window.addEventListener('beforeunload', function() {
    localStorage.setItem(field.name, field.value);
  })

  window.addEventListener('load', function() {
    // get the value from local storage
    let val = localStorage.getItem(field.name)
    if (val !== null) field.value = val;
  })
  
  if (field.getAttribute("type") == "submit") {
    field.addEventListener("focus", function() {
      validateEmpty(this)
    });  
  }

  // scroll to show the input on focus in mobile
  if (window.innerWidth == 768) {
    field.addEventListener("focus", function() {
      document.body.scrollTop = this.offsetTop;
    });
  }
});

// catch the errors of validation
let error = 1;

// select the form
let regForm = document.querySelector("#regForm");

regForm.addEventListener("submit", function(e) {
  let sub_form = {};
  //   validateEmpty the fields
  formFields.forEach(field => {
    if (field.getAttribute("type") !== "submit" && field.offsetParent !== null) {
      // convert the form value from array into object
      sub_form[field.name] = field.value;
    }
  });

  if (error > 0) {
    // disable the submit button
    // document.querySelector("#regForm input[type='submit']").disabled = true;

    // prevent the submition if there's errors
    e.preventDefault();
    formFields.forEach(field => {
      validateEmpty(field);
    });
  } else {
    // send te data otherwise
    e.preventDefault();

    // the modal
    let modal = document.querySelector("#val-modal");
    // the content of the modal
    let modalContent = modal.querySelector(".modal-content");
    // hide when clicking any where except the modal
    window.onclick = function(e) {
      if (e.target == modal) {
        modal.style.display = "none";
      }
    };
    // show the modal
    modal.style.display = "block";
    
    // hide the questions of committees
    document.querySelectorAll('.question').forEach(question => {
      question.style.display = 'none';
    })
  // show the loading before every request
    if (modalContent.querySelector('p')) {
        modalContent.querySelector('p').style.display = 'none';
    }
    modalContent.querySelector('img').style.display = 'block';

    // send data to the api
    fetch("https://stark-temple-62549.herokuapp.com/register", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sub_form)
    })
      .then(res => {
        // show success message
        if (location.href.indexOf("ar") > 0) {
            modalContent.querySelector('img').style.display = 'none';
            modalContent.querySelectorAll('p').forEach(p => {
                p.style.display = 'none';
            })
            modalContent.insertAdjacentHTML("beforeend", `<p>${ar.thanks}</p>`)
              
        } else {
            modalContent.querySelector('img').style.display = 'none';
            modalContent.querySelectorAll('p').forEach(p => {
                p.style.display = 'none';
            })
            modalContent.insertAdjacentHTML("beforeend", `<p>${en.thanks}</p>`)
        }
              
        //Redirect to the location-showing page
        setTimeout(() => {
            if (location.href.indexOf("ar") > 0) {
                location.replace(ar.location)
            } else {
                location.replace(en.location)
            }
        }, 2500);
              
        //Redirect to the location-showing page
        setTimeout(() => {
          location.replace('/register/location.html')
        }, 2500);


        // Reset the form on success
        formFields.forEach(field => {
          if (field.getAttribute("type") !== "submit" && field.offsetParent !== null) {
              field.value = "";
              field.classList.remove("valid");
              field.classList.remove("invalid");
          }
        });
      })
      .catch(err => {
          if (location.href.indexOf("ar") > 0) {
            modalContent.querySelector('img').style.display = 'none';
            modalContent.querySelectorAll('p').forEach(p => {
                p.style.display = 'none';
            })
            modalContent.insertAdjacentHTML("beforeend", `<p>${ar.error}</p>`)
          } else {
            modalContent.querySelector('img').style.display = 'none';
            modalContent.querySelectorAll('p').forEach(p => {
                p.style.display = 'none';
            })
            modalContent.insertAdjacentHTML("beforeend", `<p>${en.error}</p>`)
          }
      })
  }
});

function validateEmpty(field) {
  if (field.hasAttribute("required")) {
    if (field.value.length > 0) {
      field.classList.add("valid");
      field.classList.remove("invalid");

      if (error > 0) {
        error -= 1;
      }

      // check if the field have error message or not
      // get the error message
      let errorMessage = field.parentElement.lastElementChild;
      if (errorMessage.classList.contains("validate-message")) {
        errorMessage.remove();
      }
    } else {
      if (!field.classList.contains("invalid")) {
        field.classList.add("invalid");
        field.classList.remove("valid");

        error += 1;
        // insert error message after the empty field
        message(field, (location.href.indexOf("ar") > 0 ) ? ar.fill : en.fill);
      }
    }
  }
}

// validate the email fields
function validateEmail(field) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!re.test(String(field.value))) {
    if (!field.classList.contains("invalid")) {
      field.classList.add("invalid");
      field.classList.remove("valid");

      error += 1;

      message(field, (location.href.indexOf("ar") > 0 ) ? ar.validEmail : en.validEmail);
    }
  } else {
    field.classList.add("valid");
    field.classList.remove("invalid");

    if (error > 0) {
      error -= 1;
    }

    // check if the field have error message or not
    // get the error message
    let errorMessage = field.parentElement.lastElementChild;
    if (errorMessage.classList.contains("validate-message")) {
      errorMessage.remove();
    }
  }
}

// validate phone number
function validatePhone(field) {
  let re = /^01\d{9}/;

  if (!re.test(field.value)) {
    if (!field.classList.contains("invalid")) {
      field.classList.add("invalid");
      field.classList.remove("valid");

      error += 1;

      message(field, (location.href.indexOf("ar") > 0 ) ? ar.validPhone : en.validPhone);
    }
  } else {
    field.classList.add("valid");
    field.classList.remove("invalid");

    if (error > 0) {
      error -= 1;
    }

    // check if the field have error message or not
    // get the error message
    let errorMessage = field.parentElement.lastElementChild;
    if (errorMessage.classList.contains("validate-message")) {
      errorMessage.remove();
    }
  }
}

// validate the textareas to not be less than 300 chars
function validateTextArea(field) {
  let textArr = field.value.split(" ");
  if (textArr.length < 2) {
    if (!field.classList.contains("invalid")) {
      field.classList.add("invalid");
      field.classList.remove("valid");

      error += 1;

      message(field, (location.href.indexOf("ar") > 0 ) ? ar.fill2 : en.fill2);
    }
  } else {
    field.classList.add("valid");
    field.classList.remove("invalid");

    if (error > 0) {
      error -= 1;
    }

    // check if the field have error message or not
    // get the error message
    let errorMessage = field.parentElement.lastElementChild;
    if (errorMessage.classList.contains("validate-message")) {
      errorMessage.remove();
    }
  }
}

// add custom message on validation
function message(el, msg) {
  el.insertAdjacentHTML("afterend", `<p class="validate-message">${msg}</p>`);
}

// show the corresponding question appear on selecting the option
let committeeSelect = document.querySelector("select#committee");
let committeeSelect2 = document.querySelector("select#committee2");

// handle the change event in the select box
committeeSelect.addEventListener("change", function() {
  // remove all other questions
  document.querySelectorAll(".question").forEach(question => {
    question.style.display = "none";
  });
  // show the corresponding question appear on selecting the option
  if (document.querySelector(`#${this.value}`)) {
    document.querySelector(`#${this.value}`).style.display = "block";
  }
  
//   remove the chosen option from 2nd preference
    for (let i = 0; i < committeeSelect2.children.length; i++) {
        if (committeeSelect2.children[i].value == this.value) {
          committeeSelect2.children[i].style.display = 'none'
        } else {
          committeeSelect2.children[i].style.display = 'block'
        }
    }
});

// show the input for 'other' choice appear on selecting the option
let universitySelect = document.querySelector("select#university");

// handle the change event in the select box
universitySelect.addEventListener("change", function() {
  if (this.value == "other") {
    showOtherOption(this);
  } else {
      this.parentElement.nextElementSibling.style.display = 'none'
  }
});

// show the input for 'other' choice appear on selecting the option
let facultySelect = document.querySelector("select#faculty");

// handle the change event in the select box
facultySelect.addEventListener("change", function() {
  if (this.value == "other") {
    showOtherOption(this);
  } else {
      this.parentElement.nextElementSibling.style.display = 'none'
  }
  // show the "year selectbox"
  document.querySelector(".year").style.display = "block";
  if (this.value == "Engineering") {
    document.querySelector(".eng-dept").style.display = "block";
  } else {
    document.querySelector(".eng-dept").style.display = "none";
  }

  
  if (this.value == "pharmacyeuticals") {
    yearCount(5);
  } else if (this.value == "applied arts" || this.value == "Engineering") {
    yearCount(4);
    
    let option = document.createElement("option");
    option.innerHTML = "preparatory year";
    option.value = "preparatory";
    yearSelect.appendChild(option);
  } else if (this.value == "medicine") {
    yearCount(6);
  } else {
    yearCount(4);
  }
});

let yearSelect = document.querySelector("select#year");
// fill the select with the corresponding year count
function yearCount(count) {
  // TODO: remove all children of select before choose
  while(yearSelect.firstElementChild.nextElementSibling) {
    yearSelect.firstElementChild.nextElementSibling.remove();
  }

  for (let i = 1; i <= count; i++) {
    // create an option
    let option = document.createElement("option");

    // fil the content of the option
    if (i === 1) {
      option.innerHTML = i + "st year";
      option.value = i;
    } else if (i === 2) {
      option.innerHTML = i + "nd year";
      option.value = i;
    } else if (i === 3) {
      option.innerHTML = i + "rd year";
      option.value = i;
    } else {
      option.innerHTML = i + "th year";
      option.value = i;
    }

    // append to the select box
    yearSelect.appendChild(option);
  }
}

// show the input for 'other' choice
function showOtherOption(targetSelect) {
  let otherOption = targetSelect.parentElement.nextElementSibling;
  // show the input for 'other' choice appear on selecting the option
  otherOption.style.display = "block";

  // get the input of the other option
  let otherInput = otherOption.querySelector("input");

  // set the option value to input value
  otherInput.addEventListener("change", function() {
    // create an option with value of this input
    let option = document.createElement("option");
    // add the attribute "selected" to it
    option.setAttribute("selected", "selected");
    // set the value of the select box to the value of the input
    targetSelect.value = this.value;
    option.innerHTML = this.value;
    targetSelect.appendChild(option);
  });
}

let howSelect = document.querySelector("select#how");

howSelect.addEventListener('change', function() {
  if (this.value == "Social media") {
    document.querySelector(".social").style.display = "block";
  } else {
    document.querySelector(".social").style.display = "none";
  }
})

// prevent scrolling on load
window.addEventListener("load", function() {
<<<<<<< HEAD
  if (location.href.indexOf("ar") > 0) {
    btnHeader.innerHTML = ar.answer;
  } else {
    btnHeader.innerHTML = en.answer;
  }

  btnHeader.disabled = false;

  // scroll to top on load
  window.scrollTo(0, 0);
});

// prevent scrolling on load
window.addEventListener("DOMContentLoaded", function() {
  // scroll to top on load
  window.scrollTo(0, 0);

  document.body.style.overflow = "hidden";
});

// scroll to form on clicking on the button
let btnHeader = document.querySelector(".btn-header");

btnHeader.addEventListener("click", function() {
  // make the body scrollable back
  document.body.style.overflow = "auto";
  document.body.style.height = 2100 + "px";
  // scroll to form
  window.scrollTo(
    0,
    650
  );

  // animate the form
  document.querySelector('.card').classList.add('anime-form');
  document.querySelector('main .container').classList.remove('contain')
<<<<<<< HEAD
});


// show the terms and conditions modal
termsBtn = document.querySelector('#terms-click');
termsModal = document.querySelector('#tAc');

termsBtn.addEventListener('click', function(e) {
  e.preventDefault();
  termsModal.style.display = 'block'
})
// hide when clicking any where except the modal
window.onclick = function(e) {
  if (e.target == termsModal) {
    termsModal.style.display = "none";
  }
};

// check if the terms is checked
let termsCheck = document.querySelector('#terms-check');

let submitBtn = document.querySelector("#regForm input[type='submit']");
submitBtn.disabled = true;

termsCheck.addEventListener('change', function() {
  if (this.checked) {
    formFields.forEach(field => {
        validateEmpty(field);
    });
    
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
})
