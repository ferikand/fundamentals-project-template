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
const updateCartBadge = () => {
  const cart = getCart()
  const totalItems = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0)
  const badge = document.querySelector(".cart-count")
  if (badge) badge.textContent = totalItems
}
const getCartContent = () => {
  const cart = getCart()
  cart.forEach((product) => {
    const tableRow = document.createElement("div")
    tableRow.innerHTML = `
    <div class="cart-item">
          <div class="cart-item-img_container">
            <img
              src="${product.imageUrl}"
              alt="${product.name}"
            />
          </div>
          <div class="cart-product-name">${product.name}</div>
          <div class="cart-price">${product.price}</div>
          <div class="cart-quantity">
            <div class="cart-deduct">
              <p>-</p>
            </div>
            <div class="cart-quantity">
              <p>${product.quantity}</p>
            </div>
            <div class="card-add">
              <p>+</p>
            </div>
          </div>
          <div class="cart-total">${product.total}</div>
          <div class="cart-delete">
            <img
              src="../assets/icons/trash-bin.svg"
              alt="trash bin"
            />
          </div>
      </div>
  `
    const cartContainer = document.querySelector(".cart-container")
    cartContainer.appendChild(tableRow)
  })
}
document.addEventListener("DOMContentLoaded", updateCartBadge)
export { getCart, saveCart, updateCartBadge, getCartContent }
