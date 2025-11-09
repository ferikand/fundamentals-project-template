import { renderProductsByRange } from "./home.js"
import { products } from "./home.js"
const catalogueProducts = products.slice(0, 20)
let currentPage = 1
const itemsPerPage = 12
const renderPage = (page) => {
  const container = document.querySelector(".catalog_container")
  if (!container) return
  container.innerHTML = ""
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  renderProductsByRange(
    ".catalog_container",
    "selected-product-card",
    start,
    Math.min(
      end - 1,
      catalogueProducts.length >= 20 ? 19 : catalogueProducts.length - 1
    )
  )
  const displayedCount = document.querySelectorAll(
    ".catalog_container .selected-product-card"
  ).length
  const counter = document.querySelector(".quantity-on-page")
  if (counter) {
    counter.textContent = `Showing ${start + 1}-${start + displayedCount} Of ${
      catalogueProducts.length
    } Results`
  }
  document.querySelectorAll(".pagination-number").forEach((btn) => {
    btn.classList.toggle("active", +btn.dataset.page === page)
  })
  const prevBtn = document.querySelector(".pagination-arrow.prev")
  const nextBtn = document.querySelector(".pagination-arrow.next")
  if (prevBtn) prevBtn.disabled = page === 1
  if (nextBtn) nextBtn.disabled = end >= catalogueProducts.length
  window.scrollTo({ top: 0, behavior: "smooth" })
}
export const pagination = () => {
  if (!catalogueProducts || catalogueProducts.length === 0) {
    console.error("Продукты не загружены!")
    return
  }
  renderPage(1)
  document.querySelectorAll(".pagination-number").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = +btn.dataset.page
      renderPage(currentPage)
    })
  })
  document
    .querySelector(".pagination-arrow.prev")
    ?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        renderPage(currentPage)
      }
    })
  document
    .querySelector(".pagination-arrow.next")
    ?.addEventListener("click", () => {
      if (currentPage * itemsPerPage < catalogueProducts.length) {
        currentPage++
        renderPage(currentPage)
      }
    })
}
