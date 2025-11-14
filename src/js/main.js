import {
  getProductsArr,
  renderProductsByRange,
  slides,
  generateStars,
} from "./home.js"
import { header, burger, initLoginModal } from "./header.js"
import { footer } from "./footer.js"
import { setProductPage, setDataOnProductPage } from "./product.js"
import { updateCartBadge, getCartContent, initCartPage } from "./cart.js"
window.onload = async () => {
  try {
    header()
    footer()
    burger()
    initLoginModal()
    await getProductsArr()
    renderProductsByRange(
      ".products-grid-wrapper.selected-products-wrapper",
      "selected-product-card",
      3,
      6
    )
    renderProductsByRange(
      ".products-grid-wrapper.new-products-wrapper",
      "selected-product-card",
      7,
      10
    )
    renderProductsByRange(".carousel-track", "product-card")
    renderProductsByRange(".top-best-sets", "top-card_container", 20, 25)
    slides()
    generateStars()
    if (document.querySelector(".catalog_container")) {
      const { pagination, sorting, filtering } = await import("./catalog.js")
      pagination()
      sorting()
      filtering()
    }
    if (!window.location.pathname.includes("product.html")) {
      setProductPage()
      updateCartBadge()
    }
    if (window.location.pathname.includes("product.html")) {
      setDataOnProductPage()
      renderProductsByRange(
        ".may-also-like",
        "selected-product-card",
        3,
        10,
        undefined,
        true,
        4
      )
    }
    if (window.location.pathname.includes("cart.html")) {
      initCartPage()
    } else {
      getCartContent()
      updateCartBadge()
    }
  } catch (error) {
    console.log(error)
  }
}
