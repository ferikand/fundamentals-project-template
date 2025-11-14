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
  const sizeSelect = document.getElementById("size")
  const colorSelect = document.getElementById("color")
  const categorySelect = document.getElementById("category")

  const size = sizeSelect ? sizeSelect.value : ""
  const color = colorSelect ? colorSelect.value : ""
  const category = categorySelect ? categorySelect.value : ""

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
      item.size === selectedOptions.size &&
      item.color === selectedOptions.color
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
    <form class="product-options" action="">
      <label for="size">Size</label>
      <select id="size" name="size" required>
        <option value="">Select Size</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>
      <label for="color">Color</label>
      <select id="color" name="color" required>
        <option value="">Select Color</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="black">Black</option>
        <option value="grey">Grey</option>
        <option value="yellow">Yellow</option>
        <option value="pink">Pink</option>
      </select>
      <label for="category">Category</label>
      <select id="category" name="category" required>
        <option value="">Select Category</option>
        <option value="carry-ons">Carry-ons</option>
        <option value="suitcases">Suitcases</option>
        <option value="luggage-sets">Luggage Sets</option>
        <option value="kids-luggage">Kids' Luggage</option>
      </select>
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

  const selectedOptions = getSelectedOptions()
  const existingItem = cart.find(
    (item) =>
      item &&
      item.id === product.id &&
      item.size === selectedOptions.size &&
      item.color === selectedOptions.color
  )

  if (existingItem) {
    count = existingItem.quantity
    const quantityEl = productDescription.querySelector(".quantity p")
    if (quantityEl) {
      quantityEl.textContent = count
    }

    const sizeSelect = document.getElementById("size")
    const colorSelect = document.getElementById("color")
    const categorySelect = document.getElementById("category")

    if (sizeSelect && existingItem.size) {
      sizeSelect.value = existingItem.size
    }
    if (colorSelect && existingItem.color) {
      colorSelect.value = existingItem.color
    }
    if (categorySelect && existingItem.category) {
      categorySelect.value = existingItem.category
    }
  }

  const sizeSelect = document.getElementById("size")
  const colorSelect = document.getElementById("color")
  const categorySelect = document.getElementById("category")

  if (sizeSelect) {
    sizeSelect.addEventListener("change", () =>
      syncCartQuantity(product, count)
    )
  }
  if (colorSelect) {
    colorSelect.addEventListener("change", () =>
      syncCartQuantity(product, count)
    )
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", () =>
      syncCartQuantity(product, count)
    )
  }

  setupCounter(product)
  addProductToCart(product)
}
const calculateTotal = (product, quantity) => {
  const itemTotalBasedOnOriginalPrice = product.price * quantity
  return itemTotalBasedOnOriginalPrice.toFixed(2)
}
const calculateDiscount = (product) => {
  if (product.salesStatus && product.discountValue) {
    return product.discountValue
  }
  return 0
}
const addProductToCart = (product) => {
  const addToCartBtn = document.getElementById("add-to-cart-btn")
  if (!addToCartBtn) return
  addToCartBtn.addEventListener("click", () => {
    if (!product) return
    const selectedOptions = getSelectedOptions()
    const itemTotalBasedOnOriginalPrice = product.price * count
    const cartItem = {
      ...product,
      size: selectedOptions.size,
      color: selectedOptions.color,
      category: selectedOptions.category,
      quantity: count,
      price: product.price.toFixed(2),
      discountValue: calculateDiscount(product).toFixed(2),
      total: itemTotalBasedOnOriginalPrice.toFixed(2),
    }
    // console.log(cartItem)
    const cart = getCart()
    const existingIndex = cart.findIndex(
      (item) =>
        item &&
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    )
    if (existingIndex !== -1) {
      cart[existingIndex].quantity = count
      cart[existingIndex].total = calculateTotal(
        product,
        cart[existingIndex].quantity
      )
    } else {
      cart.push(cartItem)
    }
    saveCart(cart)
    updateCartBadge()
    document.querySelector(".quantity p").textContent = count
  })
}

export { setProductPage, setDataOnProductPage }
