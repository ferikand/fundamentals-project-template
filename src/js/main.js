import { getProductsArr, renderProductsByRange, slides } from "./home.js"
import { header, burger } from "./header.js"
import { footer } from "./footer.js"
import { setProductPage, setDataOnProductPage } from "./product.js"
import { updateCartBadge } from "./cart.js"
window.onload = async () => {
  try {
    header()
    footer()
    burger()
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
    if (document.querySelector(".catalog_container")) {
      const { pagination, sorting, filtering } = await import("./catalog.js")
      pagination()
      sorting()
      filtering()
    }
    setProductPage()
    if (window.location.pathname.includes("product.html")) {
      setDataOnProductPage()
    }
    updateCartBadge()
  } catch (error) {
    console.log(error)
  }
}
