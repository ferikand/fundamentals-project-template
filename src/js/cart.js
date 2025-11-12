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
document.addEventListener("DOMContentLoaded", updateCartBadge)
export { getCart, saveCart, updateCartBadge }
