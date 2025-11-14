import { getCart, saveCart, updateCartBadge } from "./cart.js"
import { getProductsArr, generateStars } from "/src/js/home.js"
let count = 1
const FIXED_DISCOUNT_AMOUNT = 20
const setProductPage = () => {
  let productId = ""
  const buttons = document.querySelectorAll(".view-product")
  buttons?.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const card = btn.closest("[data-id]")
      productId = card.dataset.id
      // console.log(productId)
      localStorage.setItem("selectedProductId", productId)
      window.location.href = `../html/product.html?id=${productId}`
    })
  })
}
const getProductData = async () => {
  // const productId = window.location.href.split("=")[1]
  const productId = localStorage.getItem("selectedProductId")
  if (!productId) return
  const productsArr = await getProductsArr()
  const product = productsArr.find((product) => product.id === productId)
  // console.log(product)
  return product
}
const getSelectedOptions = () => {
  const size = document.getElementById("size")?.value.trim() || null
  const color = document.getElementById("color")?.value.trim() || null
  const category = document.getElementById("category")?.value.trim() || null
  return { size, color, category }
}
const setupCounter = (product) => {
  const productBottom = document.querySelector(".product-bottom")
  if (!productBottom) return
  const quantityEl = productBottom.querySelector(".quantity p")
  const addBtn = productBottom.querySelector(".add")
  const deductBtn = productBottom.querySelector(".deduct")
  const updateQuantity = () => {
    quantityEl.textContent = count
    syncCartQuantity(product, count)
    updateCartBadge()
  }
  addBtn.addEventListener("click", () => {
    count++
    updateQuantity()
  })
  deductBtn.addEventListener("click", () => {
    if (count > 1) count--
    updateQuantity()
  })
  updateQuantity()
}
const syncCartQuantity = (product, newCount) => {
  let cart = getCart().filter((item) => item !== null)
  const selectedOptions = getSelectedOptions()
  const index = cart.findIndex(
    (item) =>
      item &&
      item.id === product.id &&
      item.selectedSize === selectedOptions.size &&
      item.selectedColor === selectedOptions.color
  )
  if (index !== -1) {
    cart[index].quantity = newCount
    cart[index].total = calculateTotal(product, newCount)
    saveCart(cart)
    updateCartBadge()
    // console.log(newCount, cart[index].total)
  }
}
const setDataOnProductPage = async () => {
  const product = await getProductData()
  // console.log(product)
  if (!product) return
  const cart = getCart()
  const selectedOptions = getSelectedOptions()
  const existingItem = cart.find(
    (item) =>
      item &&
      item.id === product.id &&
      item.selectedSize === selectedOptions.size &&
      item.selectedColor === selectedOptions.color
  )
  if (existingItem) {
    count = existingItem.quantity
  }
  const imgContainer = document.querySelector(".product-img_container")
  imgContainer.innerHTML = `<img class="product-img-lg" src="${product.imageUrl}" alt="${product.name}">`
  const productDescription = document.querySelector(
    ".product-description_container"
  )
  if (!imgContainer || !productDescription) return
  const stars = generateStars(product.rating)
  const productDescriptionText = `
  The new Global Explorer Max Comfort Suitcase Pro is a bold reimagining of 
  travel essentials, designed to elevate every journey. Made with at least 30% 
  recycled materials, its lightweight yet impact-resistant shell combines eco-
  conscious innovation with rugged durability.<br/>
  The ergonomic handle and GlideMotion spinner wheels ensure effortless  
  mobility while making a statement in sleek design. Inside, the modular  
  compartments and adjustable straps keep your belongings secure and 
  neatly organized, no matter the destination.
  `
  productDescription.innerHTML = ""
  const productDescriptioninnerHTML = `
    <div class="contact-form-feedback_header product-description-header">
      <h6>${product.name}</h6>
      <b>$${product.price}</b>
      <div class="rating">${stars}</div>
      <p>${productDescriptionText}</p>      
    </div>
    <form action="">
      <label for="size">Size</label>
      <input
        type="text"
        id="size"
        name="size"
        required
      />
      <label for="color">Color</label>
      <input
        type="text"
        id="color"
        name="color"
        required
      />
      <label for="category">Category</label>
      <input
        type="text"
        id="category"
        name="category"
        required
      />
      <div class="product-bottom">
        <div class="add-deduct-group">
          <div class="deduct">
            <p>-</p>
          </div>
          <div class="quantity">
            <p>${count}</p>
          </div>
          <div class="add">
            <p>+</p>
          </div>
        </div>
        <div id="add-to-cart-btn" class="btn-sm">Add To Cart</div>
      </div>
    </form>`
  productDescription.innerHTML = productDescriptioninnerHTML
  const sizeInput = document.getElementById("size")
  const colorInput = document.getElementById("color")
  if (sizeInput) {
    sizeInput.addEventListener("input", () => syncCartQuantity(product, count))
  }
  if (colorInput) {
    colorInput.addEventListener("input", () => syncCartQuantity(product, count))
  }
  setupCounter(product)
  addProductToCart(product)
}
const calculateTotal = (product, quantity) => {
  const itemTotalBasedOnOriginalPrice = product.price * quantity
  return itemTotalBasedOnOriginalPrice.toFixed(2)
}
const addProductToCart = (product) => {
  const addToCartBtn = document.getElementById("add-to-cart-btn")
  if (!addToCartBtn) return
  addToCartBtn.addEventListener("click", () => {
    if (!product) return
    const hasDiscount = product.salesStatus
    const discountAmount = hasDiscount ? FIXED_DISCOUNT_AMOUNT : 0
    const selectedOptions = getSelectedOptions()
    const itemTotalBasedOnOriginalPrice = product.price * count
    const cartItem = {
      ...product,
      selectedSize: selectedOptions.size,
      selectedColor: selectedOptions.color,
      selectedCategory: selectedOptions.category,
      quantity: count,
      price: product.price.toFixed(2),
      discountValue: discountAmount.toFixed(2),
      total: itemTotalBasedOnOriginalPrice.toFixed(2),
    }
    // console.log(cartItem)
    const cart = getCart()
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.selectedSize === cartItem.selectedSize &&
        item.selectedColor === cartItem.selectedColor
    )
    if (existingIndex !== -1) {
      cart[existingIndex].quantity = count
      cart[existingIndex].total = calculateTotal(product, count)
    } else {
      cart.push(cartItem)
    }
    saveCart(cart)
    updateCartBadge()
    document.querySelector(".quantity p").textContent = count
  })
}
export { setProductPage, setDataOnProductPage }
