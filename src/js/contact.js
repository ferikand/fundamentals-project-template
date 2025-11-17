import { validateEmail } from "./header.js"
const initContactForm = () => {
  const contactForm = document.querySelector(".contact-form_container form")
  if (!contactForm) return
  const nameInput = document.getElementById("your_name")
  const emailInput = document.getElementById("your_email")
  const topicInput = document.getElementById("topic")
  const messageInput = document.getElementById("message")
  const submitButton = contactForm.querySelector(".btn-sm")
  createErrorContainers()
  emailInput.addEventListener("input", validateEmailField)
  emailInput.addEventListener("blur", validateEmailField)
  nameInput.addEventListener("blur", validateRequiredField)
  topicInput.addEventListener("blur", validateRequiredField)
  messageInput.addEventListener("blur", validateRequiredField)
  contactForm.addEventListener("submit", handleFormSubmit)
  replaceSubmitButton(contactForm, submitButton)
}
const createErrorContainers = () => {
  const contactForm = document.querySelector(".contact-form_container form")
  if (!contactForm) return
  const fields = ["your_name", "your_email", "topic", "message"]
  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (!field) return
    if (!document.getElementById(`${fieldId}-error`)) {
      const errorSpan = document.createElement("span")
      errorSpan.className = "error-message"
      errorSpan.id = `${fieldId}-error`
      field.parentNode.insertBefore(errorSpan, field.nextSibling)
    }
  })
}
const validateEmailField = (e) => {
  const email = e.target.value
  const emailError = document.getElementById("your_email-error")
  let isValid = true
  let errorMessage = ""

  if (email) {
    if (!validateEmail(email)) {
      isValid = false
      errorMessage = "Please enter a valid email address"
    }
  }
  emailError.textContent = errorMessage
  setFieldValidity(e.target, isValid)
}
const validateRequiredField = (e) => {
  const field = e.target
  const value = field.value.trim()
  const fieldError = document.getElementById(`${field.id}-error`)
  if (!value) {
    fieldError.textContent = "This field is required"
    setFieldValidity(field, false)
  } else {
    fieldError.textContent = ""
    setFieldValidity(field, true)
  }
}
const setFieldValidity = (field, isValid) => {
  if (isValid) {
    field.classList.remove("invalid")
    field.classList.add("valid")
  } else {
    field.classList.remove("valid")
    field.classList.add("invalid")
  }
}
const handleFormSubmit = (e) => {
  e.preventDefault()
  validateAllFields()
  if (isFormValid()) {
    showFormSuccess()
    setTimeout(() => {
      resetForm()
    }, 3000)
  } else {
    showFormError("Please correct the errors in the form.")
  }
}
const validateAllFields = () => {
  const fields = [
    document.getElementById("your_name"),
    document.getElementById("your_email"),
    document.getElementById("topic"),
    document.getElementById("message"),
  ]
  fields.forEach((field) => {
    const event = new Event("blur")
    field.dispatchEvent(event)
  })
}
const isFormValid = () => {
  const name = document.getElementById("your_name").value.trim()
  const email = document.getElementById("your_email").value.trim()
  const topic = document.getElementById("topic").value.trim()
  const message = document.getElementById("message").value.trim()
  return name && validateEmail(email) && topic && message
}
const showFormSuccess = () => {
  const form = document.querySelector(".contact-form_container form")
  const header = document.querySelector(".contact-form-feedback_header")
  const successMessage = document.createElement("div")
  successMessage.className = "success-message"
  successMessage.innerHTML = `
        <div class="success-title">Success!</div>
        <p>Thank you for your feedback! We will contact you soon.</p>
    `
  form.style.display = "none"
  header.parentNode.insertBefore(successMessage, header.nextSibling)
}
const showFormError = (message) => {
  const header = document.querySelector(".contact-form-feedback_header")
  const existingError = header.parentNode.querySelector(".form-error-message")
  if (existingError) {
    existingError.remove()
  }
  const errorMessage = document.createElement("div")
  errorMessage.className = "form-error-message"
  errorMessage.innerHTML = `
        <div class="error-title">Error</div>
        <p>${message}</p>
    `
  header.parentNode.insertBefore(errorMessage, header.nextSibling)
  setTimeout(() => {
    errorMessage.remove()
  }, 5000)
}
const resetForm = () => {
  const form = document.querySelector(".contact-form_container form")
  const successMessage = form
    .closest(".contact-form-feedback_container")
    .querySelector(".success-message")
  if (successMessage) {
    successMessage.remove()
  }
  form.style.display = "block"
  form.reset()
  const errorMessages = form.querySelectorAll(".error-message")
  errorMessages.forEach((error) => {
    error.textContent = ""
  })
  const fields = form.querySelectorAll("input, textarea")
  fields.forEach((field) => {
    field.classList.remove("invalid", "valid")
  })
}
const replaceSubmitButton = (form, currentButton) => {
  if (currentButton && currentButton.tagName === "DIV") {
    const button = document.createElement("button")
    button.type = "submit"
    button.className = currentButton.className
    button.textContent = currentButton.textContent
    currentButton.parentNode.replaceChild(button, currentButton)
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initContactForm()
})
export { initContactForm }
