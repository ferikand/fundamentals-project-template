import { getCart, saveCart, updateCartBadge } from "./cart.js"
import { getProductsArr } from "/src/js/home.js"
let count = 1
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
const setupCounter = (product) => {
  const productBottom = document.querySelector(".product-bottom")
  if (!productBottom) return
  const quantityEl = productBottom.querySelector(".quantity p")
  const addBtn = productBottom.querySelector(".add")
  const deductBtn = productBottom.querySelector(".deduct")
  const updateQuantity = () => {
    quantityEl.textContent = count
    syncCartQuantity(product, count)
  }
  addBtn.addEventListener("click", () => {
    count++
    updateQuantity()
  })
  deductBtn.addEventListener("click", () => {
    if (count > 1) count--
    updateQuantity(product, count)
  })
  updateQuantity()
}
const syncCartQuantity = (product, newCount) => {
  let cart = getCart().filter((item) => item !== null)
  const index = cart.findIndex((item) => item && item.id === product.id)
  if (index !== -1) {
    cart[index].quantity = newCount
  }
  saveCart(cart)
  updateCartBadge()
}
const setDataOnProductPage = async () => {
  const product = await getProductData()
  console.log(product)
  const cart = getCart()
  const existingItem = cart.find((item) => item && item.id === product.id)
  if (existingItem) {
    count = existingItem.quantity
  }
  const imgContainer = document.querySelector(".product-img_container")
  imgContainer.innerHTML = `<img class="product-img-lg" src="${product.imageUrl}" alt="${product.name}">`
  const productDescription = document.querySelector(
    ".product-description_container"
  )
  if (!imgContainer || !productDescription) return
  productDescription.innerHTML = ""
  const productDescriptioninnerHTML = `
    <div class="contact-form-feedback_header product-description-header">
      <h6>${product.name}</h6>
      <p>${product.name}</p>
    </div>
    <form action="">
      <label for="your_name">Size</label>
      <input
        type="text"
        id="size"
        name="size"
        required
      />
      <label for="your_email">Color</label>
      <input
        type="text"
        id="color"
        name="color"
        required
      />
      <label for="topic">Category</label>
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
  setupCounter(product)
  addProductToCart(product)
}
const addProductToCart = (product) => {
  const addToCartBtn = document.getElementById("add-to-cart-btn")
  if (!addToCartBtn) return
  addToCartBtn.addEventListener("click", () => {
    if (!product) return
    const size = document.getElementById("size").value.trim() || null
    const color = document.getElementById("color").value.trim() || null
    const category = document.getElementById("category").value.trim() || null
    const cartItem = {
      ...product,
      selectedSize: size,
      selectedColor: color,
      selectedCategory: category,
      quantity: count,
      total: product.price * count,
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
      cart[existingIndex].quantity += count
    } else {
      cart.push(cartItem)
    }
    saveCart(cart)
    updateCartBadge()
    document.querySelector(".quantity p").textContent = count
  })
}
export { setProductPage, setDataOnProductPage }
