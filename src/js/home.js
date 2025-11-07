// mobile menu
const burger = document.querySelector(".burger")
const nav = document.querySelector("nav")
const navLinks = document.querySelectorAll(".navLink")
const navLink = document.querySelector(".navLink")
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
// carousel
const prevBtn = document.querySelector(".carousel-btn.prev")
const nextBtn = document.querySelector(".carousel-btn.next")
const carouselTrack = document.querySelector(".carousel-track")
const productsCarousel = document.querySelector(".products-carousel")
const products = []
const getProducts = async () => {
  try {
    const response = await fetch("../assets/data.json")
    const result = await response.json()
    // console.log(...result.data)
    products.push(...result.data)
    products.forEach((product, i) => {
      const newCard = document.createElement("div")
      newCard.classList.add(`product-card`, `image-${i + 1}`)
      newCard.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${product.imageUrl})`
      newCard.innerHTML = `<h4>${product.id}</h4>
                          <p>${product.name}</p>`
      carouselTrack.appendChild(newCard)
    })
  } catch (error) {
    console.log(error)
  }
}
window.onload = async () => {
  try {
    await getProducts()
    const cards = Array.from(carouselTrack.children)
    const totalCards = products.length
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
  } catch (error) {
    console.log(error)
  }
}
