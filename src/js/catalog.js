import { renderProductsByRange } from "./home.js"
import { products } from "./home.js"
import { setDataOnProductPage } from "./product.js"
let catalogueProducts = []
let filteredProducts = []
let currentPage = 1
const itemsPerPage = 12
let activeFilters = {
  category: "all",
  color: "all",
  size: "all",
  salesStatus: "all",
}
const renderPage = (page) => {
  const container = document.querySelector(".catalog_container")
  if (!container) return
  container.innerHTML = ""
  const productsToRender =
    filteredProducts.length > 0 ? filteredProducts : catalogueProducts
  const start = (page - 1) * itemsPerPage
  const end = Math.min(start + itemsPerPage, productsToRender.length)
  renderProductsByRange(
    ".catalog_container",
    "selected-product-card",
    start,
    end - 1,
    productsToRender
  )
  const displayedCount = Math.min(itemsPerPage, productsToRender.length - start)
  const counter = document.querySelector(".quantity-on-page")
  if (counter) {
    counter.textContent = `Showing ${start + 1}-${start + displayedCount} Of ${
      productsToRender.length
    } Results`
  }
  updatePagination(productsToRender.length, page)
  window.scrollTo({ top: 0, behavior: "smooth" })
}
const updatePagination = (totalItems, currentPage) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginationContainer = document.querySelector(".pagination")
  if (paginationContainer) {
    paginationContainer.innerHTML = ""
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button")
      pageBtn.className = `pagination-number ${
        i === currentPage ? "active" : ""
      }`
      pageBtn.dataset.page = i
      pageBtn.textContent = i
      pageBtn.type = "button"
      pageBtn.addEventListener("click", () => {
        currentPage = i
        renderPage(currentPage)
      })
      paginationContainer.appendChild(pageBtn)
    }
  }
  const prevBtn = document.querySelector(".pagination-arrow.prev")
  const nextBtn = document.querySelector(".pagination-arrow.next")
  if (prevBtn) {
    prevBtn.style.visibility = currentPage === 1 ? "hidden" : "visible"
    prevBtn.disabled = currentPage === 1
  }
  if (nextBtn) {
    nextBtn.style.visibility = currentPage >= totalPages ? "hidden" : "visible"
    nextBtn.disabled = currentPage >= totalPages
  }
}
const applySorting = (sortType) => {
  const type = (sortType || "default").trim()
  const productsToSort =
    filteredProducts.length > 0 ? [...filteredProducts] : [...catalogueProducts]
  let sorted = [...productsToSort]
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
      sorted = productsToSort
      break
    default:
  }
  filteredProducts = sorted
  currentPage = 1
  renderPage(1)
}
const applyFilters = () => {
  let result = [...catalogueProducts]
  Object.entries(activeFilters).forEach(([filterType, filterValue]) => {
    if (filterValue !== "all") {
      result = result.filter((product) => {
        switch (filterType) {
          case "category":
            return product.category === filterValue
          case "color":
            return product.color === filterValue
          case "size":
            if (filterValue === "S-L") {
              return (
                product.size &&
                product.size.includes("S") &&
                product.size.includes("L")
              )
            }
            return product.size && product.size.includes(filterValue)
          case "salesStatus":
            if (filterValue === "true") {
              return product.salesStatus === true
            } else if (filterValue === "false") {
              return product.salesStatus === false
            }
            return true
          default:
            return true
        }
      })
    }
  })
  filteredProducts = result
  currentPage = 1
  renderPage(1)
  updateActiveFiltersDisplay()
}
const updateActiveFiltersDisplay = () => {
  const activeFiltersContainer = document.querySelector(".active-filters")
  if (!activeFiltersContainer) return
  activeFiltersContainer.innerHTML = ""
  Object.entries(activeFilters).forEach(([filterType, filterValue]) => {
    if (filterValue !== "all") {
      const filterChip = document.createElement("div")
      filterChip.className = "active-filter-chip"
      const filterName = getFilterDisplayName(filterType, filterValue)
      filterChip.innerHTML = `${filterName}<button class="remove-filter" data-filter-type="${filterType}">×</button>`
      activeFiltersContainer.appendChild(filterChip)
    }
  })
}
const getFilterDisplayName = (filterType, filterValue) => {
  const names = {
    category: {
      "carry-ons": "Carry-ons",
      suitcases: "Suitcases",
      "luggage sets": "Luggage Sets",
      "kids' luggage": "Kids Luggage",
    },
    color: {
      red: "Red",
      blue: "Blue",
      green: "Green",
      black: "Black",
      grey: "Grey",
      yellow: "Yellow",
      pink: "Pink",
    },
    size: {
      S: "Size S",
      M: "Size M",
      L: "Size L",
      XL: "Size XL",
      "S-L": "Size S-L",
    },
    salesStatus: {
      true: "On Sale",
    },
  }
  return names[filterType]?.[filterValue] || filterValue
}
const resetFilters = () => {
  activeFilters = {
    category: "all",
    color: "all",
    size: "all",
    salesStatus: "all",
  }
  document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
    const title = dropdown.querySelector(".filter-title")
    const filterType =
      dropdown.querySelector(".filter-list-item").dataset.filterType
    title.innerHTML = `Choose option <img src="../assets/icons/arrow-down-menu.svg" alt="arrow down" />`
    dropdown.querySelectorAll(".filter-list-item").forEach((item) => {
      if (item.dataset.filterValue === "all") {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })
  })
  const salesCheckbox = document.querySelector(".sales-checkbox")
  if (salesCheckbox) {
    salesCheckbox.checked = false
  }
  filteredProducts = []
  currentPage = 1
  renderPage(1)
  updateActiveFiltersDisplay()
}
const searchProducts = (searchTerm) => {
  if (!searchTerm.trim()) {
    filteredProducts = []
    currentPage = 1
    renderPage(1)
    return
  }
  const searchLower = searchTerm.toLowerCase().trim()
  const results = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchLower) ||
      (product.id && product.id.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower))
  )
  if (results.length > 0) {
    if (results.length === 1) {
      const product = results[0]
      localStorage.setItem("selectedProductId", product.id)
      window.location.href = `product.html?id=${product.id}`
      setDataOnProductPage()
    } else {
      filteredProducts = results
      currentPage = 1
      renderPage(1)
    }
  } else {
    showNotFoundPopup(searchTerm)
  }
}
const showNotFoundPopup = (searchTerm) => {
  const popup = document.createElement("div")
  popup.className = "search-popup"
  popup.innerHTML = `<div class="popup-overlay"></div><div class="popup-content"><h3>Product Not Found</h3><p>No products found for "<strong>${searchTerm}</strong>"</p><div class="popup-close-btn btn-sm">OK</div></div>`
  document.body.appendChild(popup)
  const closeBtn = popup.querySelector(".popup-close-btn")
  const overlay = popup.querySelector(".popup-overlay")
  const closePopup = () => {
    document.body.removeChild(popup)
  }
  closeBtn.addEventListener("click", closePopup)
  overlay.addEventListener("click", closePopup)
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      closePopup()
      document.removeEventListener("keydown", handleEsc)
    }
  }
  document.addEventListener("keydown", handleEsc)
  closeBtn.focus()
}
export const pagination = () => {
  catalogueProducts = products.slice(0, 20)
  filteredProducts = []
  if (catalogueProducts.length === 0) {
    return
  }
  renderPage(1)
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
      const productsToRender =
        filteredProducts.length > 0 ? filteredProducts : catalogueProducts
      if (currentPage * itemsPerPage < productsToRender.length) {
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
export const filtering = () => {
  const searchInput = document.getElementById("searchModels")
  const searchWrapper = document.querySelector(".search-wrapper")
  const searchIcon = searchWrapper?.querySelector(".search-icon")
  if (searchInput && searchWrapper) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchProducts(searchInput.value)
      }
    })
    if (searchIcon) {
      searchIcon.addEventListener("click", () => {
        searchProducts(searchInput.value)
      })
    }
    searchWrapper.addEventListener("click", (e) => {
      if (
        e.target !== searchIcon &&
        e.target !== searchIcon.querySelector("img")
      ) {
        searchInput.focus()
      }
    })
  }
  const filterDropdowns = document.querySelectorAll(".filter-dropdown")
  filterDropdowns.forEach((dropdown) => {
    const title = dropdown.querySelector(".filter-title")
    const list = dropdown.querySelector(".filter-list")
    dropdown.addEventListener("mouseenter", () => {
      list.style.display = "block"
    })
    dropdown.addEventListener("mouseleave", () => {
      list.style.display = "none"
    })
    const filterItems = dropdown.querySelectorAll(".filter-list-item")
    filterItems.forEach((item) => {
      item.addEventListener("click", () => {
        const filterType = item.dataset.filterType
        const filterValue = item.dataset.filterValue
        if (filterValue === "all") {
          const defaultText =
            filterType.charAt(0).toUpperCase() + filterType.slice(1)
          title.innerHTML = `${defaultText} <img src="../assets/icons/arrow-down-menu.svg" alt="arrow down" />`
        } else {
          const displayName = getFilterDisplayName(filterType, filterValue)
          title.innerHTML = `${displayName} <img src="../assets/icons/arrow-down-menu.svg" alt="arrow down" />`
        }
        filterItems.forEach((i) => i.classList.remove("active"))
        item.classList.add("active")
        activeFilters[filterType] = filterValue
        applyFilters()
        list.style.display = "none"
      })
    })
  })
  const salesCheckbox = document.querySelector(".sales-checkbox")
  if (salesCheckbox) {
    salesCheckbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        activeFilters.salesStatus = "true"
      } else {
        activeFilters.salesStatus = "all"
      }
      applyFilters()
    })
  }
  document
    .querySelector(".reset-filters-btn")
    ?.addEventListener("click", resetFilters)
  document
    .querySelector(".toggle-filters-btn")
    ?.addEventListener("click", function () {
      const filtersContainer = document.querySelector(".filters-container")
      const isHidden = filtersContainer.style.display === "none"
      filtersContainer.style.display = isHidden ? "grid" : "none"
      this.textContent = isHidden ? "HIDE FILTERS" : "SHOW FILTERS"
    })
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-filter")) {
      const filterType = e.target.dataset.filterType
      activeFilters[filterType] = "all"
      const dropdown = document.querySelector(
        `.filter-dropdown [data-filter-type="${filterType}"][data-filter-value="all"]`
      )
      if (dropdown) {
        const title = dropdown
          .closest(".filter-dropdown")
          .querySelector(".filter-title")
        const filterTypeName =
          filterType.charAt(0).toUpperCase() + filterType.slice(1)
        title.innerHTML = `${filterTypeName} <img src="../assets/icons/arrow-down-menu.svg" alt="arrow down" />`
        dropdown
          .closest(".filter-list")
          .querySelectorAll(".filter-list-item")
          .forEach((item) => item.classList.remove("active"))
        dropdown.classList.add("active")
      }
      if (filterType === "salesStatus" && salesCheckbox) {
        salesCheckbox.checked = false
      }
      applyFilters()
    }
  })
}
