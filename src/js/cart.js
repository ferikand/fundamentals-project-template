const getCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem("cart")) || []
    return Array.isArray(data)
      ? data.filter((i) => i && typeof i === "object")
      : []
  } catch {
    return []
  }
}
const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartBadge()
}
const updateCartItemQuantity = (productId, change) => {
  let cart = getCart()
  const index = cart.findIndex((item) => item.id === productId)
  if (index !== -1) {
    let newQuantity = cart[index].quantity + change
    if (newQuantity <= 0) {
      cart.splice(index, 1)
    } else {
      const price =
        parseFloat(cart[index].price.toString().replace("$", "")) || 0
      cart[index].quantity = newQuantity
      cart[index].total = (price * newQuantity).toFixed(2)
    }
    saveCart(cart)
    getCartContent()
  }
}
const deleteCartItem = (productId) => {
  let cart = getCart()
  const newCart = cart.filter((item) => item.id !== productId)
  saveCart(newCart)
  getCartContent()
}
const updateCartBadge = () => {
  const cart = getCart()
  const totalItems = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0)
  const badge = document.querySelector(".cart-count")
  if (badge) badge.textContent = totalItems
}
const getCartContent = () => {
  const cartContainer = document.querySelector(".cart-container")
  if (!cartContainer) return
  const cart = getCart()
  cartContainer.innerHTML = ""
  cart.forEach((product) => {
    const price = parseFloat(product.price.toString().replace("$", "")) || 0
    const itemTotal = (price * product.quantity).toFixed(2)
    const tableRow = document.createElement("div")
    tableRow.innerHTML = `
    <div class="cart-item" data-id="${product.id}">
          <div class="cart-item-img_container">
            <img
              src="${product.imageUrl}"
              alt="${product.name}"
            />
          </div>
          <div class="cart-product-name">${product.name}</div>
          <div class="cart-price">$${product.price}</div>
          <div class="cart-quantity">
            <div class="cart-deduct" data-product-id="${product.id}">
              <p>-</p>
            </div>
            <div class="cart-quantity">
              <p>${product.quantity}</p>
            </div>
            <div class="cart-add" data-product-id="${product.id}">
              <p>+</p>
            </div>
          </div>
          <div class="cart-total">$${itemTotal}</div>
          <div class="cart-delete" data-product-id="${product.id}">
            <img
              src="../assets/icons/trash-bin.svg"
              alt="trash bin"
            />
          </div>
      </div>
  `
    cartContainer.appendChild(tableRow)
  })
  document.querySelectorAll(".cart-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId
      updateCartItemQuantity(productId, 1)
    })
  })
  document.querySelectorAll(".cart-deduct").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId
      updateCartItemQuantity(productId, -1)
    })
  })
  document.querySelectorAll(".cart-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cartItem = btn.closest(".cart-item")
      if (cartItem) {
        const productId = cartItem.dataset.id
        deleteCartItem(productId)
      }
    })
  })
}
document.addEventListener("DOMContentLoaded", updateCartBadge)
export { getCart, saveCart, updateCartBadge, getCartContent }
