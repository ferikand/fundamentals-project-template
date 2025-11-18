import {
  getProductsArr,
  renderProductsByRange,
  slides,
  generateStars,
} from "./home.js"
import {
  header,
  burger,
  initLoginModal,
  validateEmail,
  setActiveMenuItem,
} from "./header.js"
import { footer } from "./footer.js"
import {
  setProductPage,
  setDataOnProductPage,
  initAddToCartBtns,
} from "./product.js"
import { updateCartBadge, getCartContent, initCartPage } from "./cart.js"
import { initContactForm } from "./contact.js"
window.onload = async () => {
  try {
    header()
    setActiveMenuItem()
    validateEmail()
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
    await initAddToCartBtns()
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
      await setDataOnProductPage()
      renderProductsByRange(
        ".may-also-like",
        "selected-product-card",
        3,
        10,
        undefined,
        true,
        4
      )
      setProductPage()
    }
    if (window.location.pathname.includes("cart.html")) {
      initCartPage()
    } else {
      getCartContent()
      updateCartBadge()
    }
    if (window.location.pathname.includes("contact.html")) {
      initContactForm()
    }
  } catch (error) {
    // console.error(error)
    throw new Error(error)
  }
}
