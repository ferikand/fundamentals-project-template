import { renderProductsByRange } from "./home.js"
import { products } from "./home.js"
let catalogueProducts = []
let currentPage = 1
const itemsPerPage = 12
const renderPage = (page) => {
  const container = document.querySelector(".catalog_container")
  if (!container) return
  container.innerHTML = ""
  const start = (page - 1) * itemsPerPage
  const end = Math.min(start + itemsPerPage, catalogueProducts.length)
  renderProductsByRange(
    ".catalog_container",
    "selected-product-card",
    start,
    end - 1,
    catalogueProducts
  )
  const displayedCount = container.children.length
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
    prevBtn.disabled = page === 1
  }
  if (nextBtn) {
    nextBtn.style.visibility =
      end >= catalogueProducts.length ? "hidden" : "visible"
    nextBtn.disabled = end >= catalogueProducts.length
  }
  window.scrollTo({ top: 0, behavior: "smooth" })
}
const applySorting = (sortType) => {
  console.log("Applying sort:", sortType)
  const type = (sortType || "default").trim()
  currentSort = type
  let sorted = [...catalogueProducts]
  switch (type) {
    case "price_asc":
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case "price_desc":
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case "popularity_desc":
      sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      break
    case "rating_desc":
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case "default":
      sorted = products.slice(0, 20)
      break
    default:
      console.warn("Unknown sort type:", type)
  }
  catalogueProducts.length = 0
  catalogueProducts.push(...sorted)
  currentPage = 1
  renderPage(1)
}
export const pagination = () => {
  catalogueProducts = products.slice(0, 20)
  if (catalogueProducts.length === 0) {
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
  if (!sortBtn || !sortList) return
  sortBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    sortList.classList.toggle("open")
  })
  document.addEventListener("click", (e) => {
    if (!sortBtn.contains(e.target)) {
      sortList.classList.remove("open")
    }
  })
  sortItems.forEach((item) => {
    item.addEventListener("click", () => {
      sortItems.forEach((i) => i.classList.remove("active"))
      item.classList.add("active")
      const text = item.textContent.trim()
      activeValue.textContent = ` (${text})`
      const raw = item.getAttribute("data-sort-value") || ""
      const sortValue = raw.replace(/\s+/g, "")
      sortList.classList.remove("open")
      applySorting(sortValue)
    })
  })
}
