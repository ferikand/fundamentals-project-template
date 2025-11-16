const header = () => {
  const header = document.querySelector("header")
  const headerInnerHtml = `
  <div class="heading">
        <div class="burger" type="button">&#9776;</div>
        <div class="socials">
          <div>
            <a href="#" title="facebook_icon">
              <img src="../assets/icons/facebook.svg" alt="facebook"/>
            </a>
          </div>
          <div>
            <a href="#" title="twitter">
              <img src="../assets/icons/twitter.svg" alt="twitter"/>
            </a>
          </div>
          <div>
            <a href="#" title="instagram">
              <img src="../assets/icons/instagram.svg" alt="instagram"/>
            </a>
          </div>
        </div>
        <div class="logo">
          <a href="home.html">
            <span class="suitcase">
              <img src="../assets/icons/suitcase.svg" alt="instagram"/>
            </span>
            <h1>BEST SHOP</h1>
          </a>
        </div>
        <div class="user-section">
          <div>
            <a href="#" class="icon user-icon" id="user-icon">
              <img src="../assets/icons/user.svg" alt="user"/>
            </a>
          </div>
          <div>
            <a href="../html/cart.html" class="icon cart-icon">
              <img src="../assets/icons/shopping-cart.svg" alt="shopping cart"/>
              <span class="cart-count">0</span>
            </a>
          </div>
        </div>
      </div>
      <div class="devider"></div>
      <div class="nav-container">
        <nav>
          <ul>
            <li>
              <a href="../html/home.html" class="navLink home">Home</a>
            </li>
            <li>
              <a href="../html/catalog.html" class="navLink catalog">
                Catalog<span>
                  <img src="../assets/icons/arrow-down-menu.svg" alt="arrow down"/>
                </span>
              </a>
            </li>
            <li>
              <a href="../html/about.html" class="navLink about">About Us</a>
            </li>
            <li>
              <a href="../html/contact.html" class="navLink contact">Contact Us</a>
            </li>
          </ul>
        </nav>
      </div>
    <!-- login modal -->
    <div class="login-modal" id="login-modal">
      <div class="modal-overlay" id="modal-overlay"></div>
      <div class="modal-content">        
        <form class="login-form" id="login-form">
          <div class="form-group">
            <label for="login-email">Email Address *</label>
            <input
              type="email"
              id="login-email"
              name="email"
              required
              placeholder="Enter your email"
            />
            <span class="error-message" id="email-error"></span>
          </div>
          <div class="form-group">
            <label for="login-password">Password *</label>
            <div class="password-input-wrapper">
              <input
                type="password"
                id="login-password"
                name="password"
                required
                placeholder="Enter your password"
                class="password-input"
              />
              <button type="button" class="toggle-password" id="toggle-password">
                  <img src="../assets/icons/eye-closed.png" alt="Show password" class="eye-icon" id="eye-icon"/>
              </button>
            </div>
            <span class="error-message" id="password-error"></span>
          </div>
          <div class="login-bottom">
            <div class="remember">
              <label for="remember">
               <input type="checkbox" id="remember" name="remember">
                Remember me
              </label>
            </div>
            <div class="forgot">
              <p>Forgot Your Password?</p>
            </div>
          </div>
          <button type="submit" class="btn-sm btn-primary login-btn">
            Log In
          </button>
        </form>
      </div>
    </div>`
  header.innerHTML = headerInnerHtml
}
const setActiveMenuItem = () => {
  const menuItems = document.querySelectorAll(".navLink")
  if (menuItems) {
    const menuItemsArr = Array.from(menuItems)
    let currentPage = window.location.href.split(".html")[0].split("/")
    currentPage = currentPage[currentPage.length - 1]
    menuItemsArr?.forEach((item) => item.classList.remove("active"))
    document.querySelector(`.${currentPage}`)?.classList.add("active")
  }
}
const burger = () => {
  const burger = document.querySelector(".burger")
  const nav = document.querySelector("nav")
  const navLinks = document.querySelectorAll(".navLink")
  burger.addEventListener("click", openMenu)
  function openMenu() {
    nav.classList.toggle("mobile")
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".burger") && !e.target.closest("nav.mobile")) {
      nav.classList.remove("mobile")
    }
  })
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      navLinks.forEach((l) => l.classList.remove("active"))
      e.target.classList.add("active")
    })
  })
}
const initLoginModal = () => {
  const userIcon = document.getElementById("user-icon")
  const loginModal = document.getElementById("login-modal")
  const modalOverlay = document.getElementById("modal-overlay")
  const modalClose = document.getElementById("modal-close")
  const loginForm = document.getElementById("login-form")
  const passwordInput = document.getElementById("login-password")
  const toggleButton = document.getElementById("toggle-password")
  passwordInput.type = "password"
  userIcon.addEventListener("click", (e) => {
    e.preventDefault()
    openLoginModal()
  })
  modalOverlay.addEventListener("click", closeLoginModal)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && loginModal.classList.contains("active")) {
      closeLoginModal()
    }
  })
  toggleButton.addEventListener("click", togglePassword)
  loginForm.addEventListener("submit", handleLoginSubmit)
  const emailInput = document.getElementById("login-email")
  emailInput.addEventListener("input", validateEmailField)
  passwordInput.addEventListener("input", validatePasswordField)
}
const openLoginModal = () => {
  const loginModal = document.getElementById("login-modal")
  loginModal.classList.add("active")
  document.body.style.overflow = "hidden"
}
const closeLoginModal = () => {
  const loginModal = document.getElementById("login-modal")
  loginModal.classList.remove("active")
  document.body.style.overflow = ""
  resetForm()
}
const validateEmail = (email) => {
  if (!email) return false
  const parts = email.split("@")
  if (parts.length !== 2) return false
  const [personal_info, domain] = parts
  if (!personal_info || !domain) return false
  if (personal_info.length > 64 || domain.length > 253) return false
  const piRegex = /^[\w!#$%&'*+/=?^_`{|}~-]+(\.[\w!#$%&'*+/=?^_`{|}~-]+)*$/i
  const domainRegex = /^(?:\w(?:[\w-]{0,61}\w)?\.)+[a-z]{2,}$/i
  return piRegex.test(personal_info) && domainRegex.test(domain)
}
const validateEmailField = () => {
  const email = document.getElementById("login-email").value
  const emailError = document.getElementById("email-error")
  if (!email) {
    emailError.textContent = ""
  } else if (!validateEmail(email)) {
    emailError.textContent = "Please enter a valid email address"
  } else {
    emailError.textContent = ""
  }
}
const validatePasswordField = () => {
  const passwordInput = document.getElementById("login-password")
  const passwordError = document.getElementById("password-error")
  if (!passwordInput || !passwordError) {
    console.warn("Password validation elements not found")
    return
  }
  const password = passwordInput.value
  if (!password) {
    passwordError.textContent = ""
  } else if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters"
  } else {
    passwordError.textContent = ""
  }
}
const handleLoginSubmit = (e) => {
  e.preventDefault()
  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value
  const emailError = document.getElementById("email-error")
  const passwordError = document.getElementById("password-error")
  let isValid = true
  if (!email) {
    emailError.textContent = "Email is required"
    isValid = false
  } else if (!validateEmail(email)) {
    emailError.textContent = "Please enter a valid email address"
    isValid = false
  } else {
    emailError.textContent = ""
  }
  if (!password) {
    passwordError.textContent = "Password is required"
    isValid = false
  } else if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters"
    isValid = false
  } else {
    passwordError.textContent = ""
  }
  if (isValid) {
    showLoginSuccess()
    setTimeout(() => {
      closeLoginModal()
    }, 2000)
  }
}
const togglePassword = () => {
  const passwordInput = document.getElementById("login-password")
  const eyeIcon = document.getElementById("eye-icon")
  if (!eyeIcon) {
    console.error("Eye icon not found!")
    return
  }
  const isPasswordVisible = passwordInput.type === "text"
  if (isPasswordVisible) {
    passwordInput.type = "password"
    eyeIcon.src = "../assets/icons/eye-closed.png"
    eyeIcon.alt = "Show password"
  } else {
    passwordInput.type = "text"
    eyeIcon.src = "../assets/icons/eye-open.png"
    eyeIcon.alt = "Hide password"
  }
  passwordInput.focus()
}
const showLoginSuccess = () => {
  const loginForm = document.getElementById("login-form")
  const successMessage = document.createElement("div")
  successMessage.className = "success-message"
  successMessage.innerHTML = `
    <div class="success-icon">OK</div>
    <p>Login successful! Redirecting...</p>
  `
  loginForm.style.display = "none"
  loginForm.parentNode.insertBefore(successMessage, loginForm.nextSibling)
}
const resetForm = () => {
  const loginForm = document.getElementById("login-form")
  const successMessage = loginForm.parentNode.querySelector(".success-message")
  const passwordInput = document.getElementById("login-password")
  const eyeIcon = document.getElementById("eye-icon")
  if (successMessage) {
    successMessage.remove()
  }
  loginForm.style.display = "block"
  loginForm.reset()
  document.getElementById("email-error").textContent = ""
  document.getElementById("password-error").textContent = ""
  if (passwordInput && eyeIcon) {
    passwordInput.type = "password"
    eyeIcon.src = "../assets/icons/eye-closed.png"
    eyeIcon.alt = "Show password"
  }
}

export { header, burger, initLoginModal, validateEmail, setActiveMenuItem }
