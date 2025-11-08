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
const products = []
const fetchProducts = async () => {
  const response = await fetch("../assets/data.json")
  const result = await response.json()
  return result
}
const getProductsArr = async () => {
  const res = await fetchProducts()
  // console.log(res.data)
  products.push(...res.data)
}
function generateStars(ratingValue) {
  const filledStarHtml =
    '<img src="../assets/icons/star-filled.svg"alt="stat filled"/>'
  const emptyStarHtml =
    '<img src="../assets/icons/star-empty.svg"alt="stat filled"/>'
  const starsHtml =
    filledStarHtml.repeat(ratingValue) + emptyStarHtml.repeat(5 - ratingValue)
  return starsHtml
}
const renderProductsByRange = (
  containerClass,
  cardClass,
  from = -1,
  until = -1
) => {
  const container = document.querySelector(containerClass)
  if (!container) {
    // console.error(`Container with class ${containerClass} not found.`)
    return
  }
  container.innerHTML = ""
  products.forEach((product, i) => {
    if (from !== -1 && !(i > from && i <= until)) {
      return
    }
    const newCard = document.createElement("div")
    newCard.classList.add(cardClass, `image-${i + 1}`)
    if (cardClass === "product-card") {
      newCard.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${product.imageUrl})`
      newCard.innerHTML = `<h4>${product.id}</h4><p>${product.name}</p>`
    } else if (cardClass === "top-card_container") {
      const stars = generateStars(product.rating)
      newCard.innerHTML = `<div class="top-card-img_container">
                              <img
                                src=${product.imageUrl}
                                alt=${product.id}
                              />
                           </div>
                           <div class="top-card_description">
                               <p class="top-card_text">${product.name}</p>
                               <div class="top-card_rating">${stars}</div>
                               <p class="top-card_price">$${product.price}</p>
                           </div>`
    } else {
      newCard.innerHTML = `
                <img src=${product.imageUrl} alt=${product.name}/>
                <div class="selected-product-card_info__container">
                    <p>${product.name}</p>
                    <p>$${product.price}</p>
                </div>
                <a href="#" class="btn-sm">View Product</a>
            `
    }
    container.appendChild(newCard)
  })
}
const slides = () => {
  const carouselTrack = document.querySelector(".carousel-track")
  if (!carouselTrack) return
  const productsCarousel = document.querySelector(".products-carousel")
  const prevBtn = document.querySelector(".carousel-btn.prev")
  const nextBtn = document.querySelector(".carousel-btn.next")
  const cards = Array.from(carouselTrack.children)
  const totalCards = 8

  if (cards.length === 0) return
  let currentIndex = 0
  let visibleCards = 0
  let shiftDistance = 0
  const determineVisibleCards = () => {
    const width = productsCarousel.clientWidth
    if (width >= 768) return 4
    if (width >= 425) return 2
    return 1
  }
  const calculateShiftDistance = () => {
    visibleCards = determineVisibleCards()
    const cardWidth = cards[0].offsetWidth
    const trackStyles = window.getComputedStyle(carouselTrack)
    const gapWidth = parseFloat(trackStyles.gap) || 0
    shiftDistance = cardWidth + gapWidth
  }
  const updateCarouselPosition = () => {
    const offsetX = -currentIndex * shiftDistance
    carouselTrack.style.transform = `translateX(${offsetX}px)`
    // console.log(currentIndex, visibleCards, offsetX)
  }
  calculateShiftDistance()
  updateCarouselPosition()
  window.onresize = () => {
    calculateShiftDistance()
    updateCarouselPosition()
  }
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--
    } else {
      currentIndex = totalCards - visibleCards
    }
    updateCarouselPosition()
  })
  nextBtn.addEventListener("click", () => {
    if (currentIndex < totalCards - visibleCards) {
      currentIndex++
    } else {
      currentIndex = 0
    }
    updateCarouselPosition()
  })
}
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
const footer = () => {
  const footer = document.querySelector("footer")
  const footerInnerHtml = `<div class="footer-upper_container">
        <div class="footer-upper">
          <div><h4>Our Benefits</h4></div>
          <div class="footer-upper-elements_container">
            <div class="footer-upper-content-element">
              <div>
                <div>
                  <img
                    src="../assets/icons/footer-img-1.svg"
                    alt="globe icon"
                  />
                </div>
              </div>
              <div>
                <p>Velit nisl sodales eget donec quis. volutpat orci.</p>
              </div>
            </div>
            <div class="footer-upper-content-element">
              <div>
                <div>
                  <img
                    src="../assets/icons/footer-img-2.svg"
                    alt="globe icon"
                  />
                </div>
              </div>
              <div>
                <p>Dolor eu varius. Morbi fermentum velit nisl.</p>
              </div>
            </div>
            <div class="footer-upper-content-element">
              <div>
                <div>
                  <img
                    src="../assets/icons/footer-img-3.svg"
                    alt="globe icon"
                  />
                </div>
              </div>
              <div>
                <p>Malesuada fames ac ante ipsum primis in faucibus.</p>
              </div>
            </div>
            <div class="footer-upper-content-element">
              <div>
                <div>
                  <img
                    src="../assets/icons/footer-img-4.svg"
                    alt="globe icon"
                  />
                </div>
              </div>
              <div>
                <p>Nisl sodales eget donec quis. volutpat orci.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-lower_container">
        <div class="footer-lower-left_container">
          <div class="footer-lower-left-upper_container">
            <div class="footer-lower-left-upper_element">
              <h6>About Us</h6>
              <a href="#"> <p>Organisation</p> </a
              ><a href="#"> <p>Partners</p> </a
              ><a href="#">
                <p>Clients</p>
              </a>
            </div>
            <div class="footer-lower-left-upper_element">
              <h6>Interesting Links</h6>
              <a href="#"> <p>Photo Gallery</p> </a
              ><a href="#"> <p>Our Team</p> </a
              ><a href="#">
                <p>Socials</p>
              </a>
            </div>
            <div class="footer-lower-left-upper_element">
              <h6>Achievments</h6>
              <a href="#"> <p>Winning Awards</p> </a
              ><a href="#"> <p>Press</p> </a
              ><a href="#">
                <p>Our Amazing Clients</p>
              </a>
            </div>
          </div>
          <div class="footer-lower-left-lower_container">
            <h6>Shipping Information</h6>
            <p>
              Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac.
              Ut sit amet erat nec nibh rhoncus varius in non lorem. Donec
              interdum, lectus in convallis pulvinar, enim elit porta sapien,
              vel finibus erat felis sed neque. Etiam aliquet neque sagittis
              erat tincidunt aliquam.
            </p>
          </div>
        </div>
        <div class="footer-lower-right_container">
          <div class="footer-lower-right-upper">
            <h6>Contact Us</h6>
            <p>
              Bendum dolor eu varius. Morbi fermentum velitsodales egetonec.
              volutpat orci. Sed ipsum felis, tristique egestas et, convallis ac
              velitn consequat nec luctus.
            </p>
          </div>
          <div class="footer-lower-right-lower">
            <div class="footer-contact-element">
              <div>
                <img
                  src="../assets/icons/phone-icon.png"
                  alt="phone icon"
                />
              </div>
              <div>
                <p>Phone: (+63) 236 6322</p>
              </div>
            </div>
            <div class="footer-contact-element">
              <div>
                <img
                  src="../assets/icons/mail-icon (1).png"
                  alt="phone icon"
                />
              </div>
              <div>
                <p>public@news.com</p>
              </div>
            </div>
            <div class="footer-contact-element">
              <div>
                <img
                  src="../assets/icons/hours-icon.png"
                  alt="phone icon"
                />
              </div>
              <div>
                <p>Mon - Fri: 10am - 6pm</p>
                <p>Sat - Sun: 10am - 6pm</p>
              </div>
            </div>
            <div class="footer-contact-element">
              <div>
                <img
                  src="../assets/icons/map-pin-icon.png"
                  alt="phone icon"
                />
              </div>
              <div>
                <p>639 Jade Valley, Washington Dc</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright">
        <p>© Copyright 2025</p>
      </div>`
  footer.innerHTML = footerInnerHtml
}
export { header, footer, burger, getProductsArr, renderProductsByRange, slides }
