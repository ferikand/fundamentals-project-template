import { getProductsArr, renderProductsByRange, slides } from "./home.js"
import { header, burger } from "./header.js"
import { footer } from "./footer.js"
// import { pagination, sorting } from "./catalog.js"
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
    renderProductsByRange(".catalog_container", "selected-product-card", 0, 19)
    renderProductsByRange(".top-best-sets", "top-card_container", 19, 25)
    slides()
    const { pagination, sorting } = await import("./catalog.js")
    pagination()
    sorting()
  } catch (error) {
    console.log(error)
  }
}
