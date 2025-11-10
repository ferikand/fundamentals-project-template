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
  if (prevBtn) {
    prevBtn.style.visibility = page === 1 ? "hidden" : "visible"
  }
  if (nextBtn) {
    nextBtn.style.visibility =
      end >= catalogueProducts.length ? "hidden" : "visible"
  }
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
export const sorting = () => {
  const sortBtn = document.querySelector(".sort-title")
  const sortList = document.querySelector(".sort-list")
  const sortItems = document.querySelectorAll(".sort-list-item")
  const activeValue = document.querySelector(".active-value")
  sortBtn?.addEventListener("click", () => {
    sortList.classList.toggle("open")
  })
  document.addEventListener("click", (e) => {
    if (!sortBtn?.contains(e.target)) {
      sortList.classList.remove("open")
    }
  })
  sortItems.forEach((item) => {
    item.addEventListener("click", () => {
      sortItems.forEach((i) => i.classList.remove("active"))
      item.classList.add("active")
      const text = item.textContent.trim()
      activeValue.textContent = ` (${text.split(" ").slice(0, 3).join(" ")})`
      sortList.classList.remove("open")
      applySorting(item.dataset.sortValue)
    })
  })
}
let currentSort = "default"
const applySorting = (sortType) => {
  currentSort = sortType
  const sorted = [...catalogueProducts].sort((a, b) => {
    switch (sortType) {
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      case "popularity_desc":
        return b.popularity - a.popularity
      case "rating_desc":
        return b.rating - a.rating
      case "default":
      default:
        return catalogueProducts.indexOf(a) - catalogueProducts.indexOf(b)
    }
  })
  catalogueProducts.length = 0
  catalogueProducts.push(...sorted)
  currentPage = 1
  renderPage(1)
}
