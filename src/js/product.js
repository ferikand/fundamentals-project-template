import { getProductsArr } from "/src/js/home.js"

const setProductPage = () => {
  let productId = ""
  const buttons = document.querySelectorAll(".view-product")
  buttons?.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const card = btn.closest("[data-id]")
      productId = card.dataset.id
      // console.log(productId)
      window.location.href = `../html/product.html?id=${productId}`
    })
  })
}
const getProductData = async () => {
  const productId = window.location.href.split("=")[1]
  const productsArr = await getProductsArr()
  const product = productsArr.find((product) => product.id === productId)
  // console.log(product)
  return product
}
let count = 1
const setupCounter = () => {
  const productBottom = document.querySelector(".product-bottom")
  if (!productBottom) return
  const quantityEl = productBottom.querySelector(".quantity p")
  const addBtn = productBottom.querySelector(".add")
  const deductBtn = productBottom.querySelector(".deduct")
  const updateQuantity = () => {
    quantityEl.textContent = count
  }
  addBtn.addEventListener("click", () => {
    count++
    updateQuantity()
  })
  deductBtn.addEventListener("click", () => {
    if (count > 1) count--
    updateQuantity()
  })
  updateQuantity()
}
const setDataOnProductPage = async () => {
  const product = await getProductData()
  console.log(product)
  const productImgContainer = document.querySelector(".product-img_container")
  productImgContainer.innerHTML = ""
  const img = document.createElement("img")
  img.classList.add("product-img-lg")
  img.src = product.imageUrl
  img.alt = product.name
  productImgContainer.appendChild(img)
  const productDescription = document.querySelector(
    ".product-description_container"
  )
  productDescription.innerHTML = ""
  const productDescriptioninnerHTML = `<div class="contact-form-feedback_header product-description-header">
      <h6>${product.name}</h6>
      <p>${product.name}</p>
    </div>
    <form action="">
      <label for="your_name">Size</label>
      <input
        type="text"
        id="your_name"
        name="your_name"
        required
      />
      <label for="your_email">Color</label>
      <input
        type="text"
        id="your_email"
        name="your_email"
        required
      />
      <label for="topic">Category</label>
      <input
        type="text"
        id="topic"
        name="topic"
        required
      />
      <div class="product-bottom">
        <div class="add-deduct-group">
          <div class="deduct">
            <p>-</p>
          </div>
          <div class="quantity">
            <p>${count}</p>
          </div>
          <div class="add">
            <p>+</p>
          </div>
        </div>
        <div id="add-to-cart" class="btn-sm">Add To Cart</div>
      </div>
    </form>`
  productDescription.insertAdjacentHTML(
    "afterbegin",
    productDescriptioninnerHTML
  )
  setupCounter()
}
export { setProductPage, setDataOnProductPage }
