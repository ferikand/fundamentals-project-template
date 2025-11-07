// mobile menu
const burger = () => {
  const burger = document.querySelector(".burger")
  const nav = document.querySelector("nav")
  const navLinks = document.querySelectorAll(".navLink")
  burger.addEventListener("click", openMenu)
  function openMenu() {
    nav.classList.toggle("mobile")
    console.log(nav.classList)
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
// products from json

const products = []

const fetchProducts = async () => {
  const response = await fetch("../assets/data.json")
  const result = await response.json()
  return result
}

const getProductsArr = async () => {
  const res = await fetchProducts()
  console.log(res.data)
  products.push(...res.data)
}

const renderCarouselContent = (containerClass) => {
  const container = document.querySelector(containerClass)
  products.forEach((product, i) => {
    const newCard = document.createElement("div")
    newCard.classList.add(`product-card`, `image-${i + 1}`)
    newCard.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${product.imageUrl})`
    newCard.innerHTML = `<h4>${product.id}</h4>
                          <p>${product.name}</p>`
    container.appendChild(newCard)
  })
}

const renderSectionOfProductsWithRange = (containerClass, from, until) => {
  const container = document.querySelector(containerClass)
  products.forEach((product, i) => {
    if (i > from && i <= until) {
      const newCard = document.createElement("div")
      newCard.classList.add(`selected-product-card`, `image-${i + 1}`)
      newCard.innerHTML = `
                              <img
                              src=${product.imageUrl}
                              alt=${product.name}/>
                              <div class="selected-product-card_info__container">
                                <p>${product.name}</p>
                                <p>${product.price}</p>
                              </div>
                              <a href="#" class="btn-sm">View Product</a>
                            `
      container.appendChild(newCard)
    }
  })
}

const slides = () => {
  const carouselTrack = document.querySelector(".carousel-track")
  const productsCarousel = document.querySelector(".products-carousel")
  const prevBtn = document.querySelector(".carousel-btn.prev")
  const nextBtn = document.querySelector(".carousel-btn.next")

  const cards = Array.from(carouselTrack.children)
  const totalCards = 12
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

// carousel
window.onload = async () => {
  burger()
  try {
    await getProductsArr()
    renderCarouselContent(".carousel-track")
    renderSectionOfProductsWithRange(".products-selected", 3, 7)
    renderSectionOfProductsWithRange(".new-products", 7, 11)

    slides()
  } catch (error) {
    console.log(error)
  }
}
