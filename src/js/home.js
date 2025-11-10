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
  until = -1,
  productsArray = products
) => {
  const container = document.querySelector(containerClass)
  if (!container) {
    // console.error(`Container with class ${containerClass} not found.`)
    return
  }
  container.innerHTML = ""
  const productsToRender = productsArray || products
  productsToRender.forEach((product, i) => {
    if (from !== -1 && !(i >= from && i <= until)) {
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
                              <img src=${product.imageUrl} alt=${product.id}/>
                           </div>
                           <div class="top-card_description">
                               <p class="top-card_text">${product.name}</p>
                               <div class="top-card_rating">${stars}</div>
                               <p class="top-card_price">$${product.price}</p>
                           </div>`
    } else {
      newCard.innerHTML = `<img src=${product.imageUrl} alt=${product.name}/>
                           <div class="selected-product-card_info__container">
                               <p>${product.name}</p>
                               <p class="price-in-card">$${product.price}</p>
                           </div>
                           <a href="#" class="btn-sm">View Product</a>`
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
export { products, getProductsArr, renderProductsByRange, slides }
