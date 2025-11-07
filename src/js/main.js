import {
  header,
  footer,
  burger,
  products,
  fetchProducts,
  getProductsArr,
  renderProductsByRange,
  slides,
} from "./home.js"
window.onload = async () => {
  try {
    header()
    footer()
    burger()
    await getProductsArr()
    renderProductsByRange(".products-selected", "selected-product-card", 3, 7)
    renderProductsByRange(".new-products", "selected-product-card", 7, 11)
    renderProductsByRange(".carousel-track", "product-card")
    slides()
  } catch (error) {
    console.log(error)
  }
}
