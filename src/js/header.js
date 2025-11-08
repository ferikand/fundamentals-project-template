const header = () => {
  const header = document.querySelector("header")
  const headerInnerHtml = `<div class="heading">
        <div
          class="burger"
          type="button"
        >
          &#9776;
        </div>
        <div class="socials">
          <div>
            <a
              href="#"
              title="facebook_icon"
              ><img
                src="../assets/icons/facebook.svg"
                alt="facebook"
            /></a>
          </div>
          <div>
            <a
              href="#"
              title="twitter"
              ><img
                src="../assets/icons/twitter.svg"
                alt="twitter"
            /></a>
          </div>
          <div>
            <a
              href="#"
              title="instagram"
              ><img
                src="../assets/icons/instagram.svg"
                alt="instagram"
            /></a>
          </div>
        </div>
        <div class="logo">
          <a href="#"
            ><span class="suitcase"
              ><img
                src="../assets/icons/suitcase.svg"
                alt="instagram"
            /></span>
            <h1>BEST SHOP</h1></a
          >
        </div>
        <div class="user-section">
          <div>
            <a
              href="#"
              class="icon user-icon"
              ><img
                src="../assets/icons/user.svg"
                alt="user"
            /></a>
          </div>
          <div>
            <a
              href="#"
              class="icon cart-icon"
              ><img
                src="../assets/icons/shopping-cart.svg"
                alt="shopping cart"
            /></a>
          </div>
        </div>
      </div>
      <div class="devider"></div>
      <div class="nav-container">
        <nav>
          <ul>
            <li>
              <a
                href="../html/home.html"
                class="navLink active"
                >Home</a
              >
            </li>
            <li>
              <a
                href="../html/catalog.html"
                class="navLink"
                >Catalog<span>
                  <img
                    src="../assets/icons/arrow-down-menu.svg"
                    alt="arrow down"
                  /> </span
              ></a>
            </li>
            <li>
              <a
                href="../html/about.html"
                class="navLink"
                >About Us</a
              >
            </li>
            <li>
              <a
                href="../html/contact.html"
                class="navLink"
                >Contact Us</a
              >
            </li>
          </ul>
        </nav>
      </div>`
  header.innerHTML = headerInnerHtml
}
const burger = () => {
  const burger = document.querySelector(".burger")
  const nav = document.querySelector("nav")
  const navLinks = document.querySelectorAll(".navLink")
  burger.addEventListener("click", openMenu)
  function openMenu() {
    nav.classList.toggle("mobile")
    // console.log(nav.classList)
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
export { header, burger }
