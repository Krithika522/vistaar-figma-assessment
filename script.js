// Json Data
async function loadData() {
  try {
    const response = await fetch("../storeData.json");
    const jsonData = await response.json();
    const data = jsonData.products[0];

    return data;
  } catch (error) {
    console.error("Error loading json", error);
  }
}

// SVG Shapes
const circleSvg = `M562,306 m-300,0 a300,300 0 1,0 600,0 a300,300 0 1,0 -600,0`;
const spiralSvg = `M302.279 498.312L300 493.256L297.721 498.312
C266.868 566.765 220.337 609.5 169 609.5
C123.66 609.5 82.0782 576.193 51.6874 521.166
C21.3451 466.227 2.5 390.159 2.5 306
C2.5 221.841 21.3451 145.773 51.6874 90.834
C82.0782 35.8068 123.66 2.5 169 2.5
C220.337 2.5 266.868 45.2351 297.721 113.688
L300 118.744L302.279 113.688
C333.132 45.2351 379.663 2.5 431 2.5
C482.337 2.5 528.868 45.2351 559.721 113.688
L562 118.744L564.279 113.688
C595.132 45.2351 641.663 2.5 693 2.5
C744.337 2.5 790.868 45.2351 821.721 113.688
L824 118.744L826.279 113.688
C857.132 45.2351 903.663 2.5 955 2.5
C1000.34 2.5 1041.92 35.8068 1072.31 90.834
C1102.65 145.773 1121.5 221.841 1121.5 306
C1121.5 390.159 1102.65 466.227 1072.31 521.166
C1041.92 576.193 1000.34 609.5 955 609.5
C903.663 609.5 857.132 566.765 826.279 498.312
L824 493.256L821.721 498.312
C790.868 566.765 744.337 609.5 693 609.5
C641.663 609.5 595.132 566.765 564.279 498.312
L562 493.256L559.721 498.312
C528.868 566.765 482.337 609.5 431 609.5
C379.663 609.5 333.132 566.765 302.279 498.312Z`;
const svgShapes = [circleSvg, spiralSvg];

// Header Carousel image
function populateCarousel(images) {
  const track = document.getElementById("svg-carousel-strip");
  track.innerHTML = "";

  images.forEach((imgUrl, index) => {
    const patternId = `pattern-${index}`;
    const shape = svgShapes[index % svgShapes.length];
    const svgHTML = `
      <svg class="svg-cutout" viewBox="0 0 1124 612" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="1124" height="612">
            <image  href="${imgUrl}" x="0" y="0" width="1124" height="1120" preserveAspectRatio="none slice" />
          </pattern>
        </defs>
        <path d="${shape}" stroke="black" stroke-width="8" fill="url(#${patternId})"/>
       
      </svg>
    `;

    track.insertAdjacentHTML("beforeend", svgHTML);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadData();

  let sampleImages = [];
  sampleImages.push(data.mens[0].images[0]);
  sampleImages.push(data.womens[0].images[0]);
  sampleImages.push(data.accessories[0].images[0]);
  sampleImages.push(data.accessories[1].images[0]);
  sampleImages.push(data.accessories[2].images[0]);

  const imagesToDisplay = [...sampleImages];
  populateCarousel(imagesToDisplay);
});

// Populate Category section
function category(categories) {
  const categoryId = document.getElementById("category");
  categoryId.innerHTML = "";

  categories.forEach((imageUrl, index) => {
    const catalog = `<div class="m-3  category-item" data-category="${imageUrl.label.toLowerCase()}" role="button">
      <img src=${
        imageUrl.image
      } class="img-fluid rounded-5 cursor-pointer" alt="category" style="width: 100%; max-width: 200px;"/>
      <p class="fw-bold  mt-2 mb-0 text-uppercase text-secondary small" style="letter-spacing: 2px; opacity: 0.7;font-size: 10px ">Category</p>
      <p class="fw-bold font-bold mb-0 text-uppercase" style="letter-spacing: 2px">${
        imageUrl.label
      }</p>
    </div>`;
    categoryId.insertAdjacentHTML("beforeend", catalog);
  });
}
document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadData();

  window.cachedData = data;
  console.log(window.cachedData);
  let categoryData = [
    { label: "WOMENS", image: data.womens[2].thumbnail },
    { label: "MENS", image: data.mens[2].thumbnail },
    { label: "ACCESSORIES", image: data.accessories[2].thumbnail },
  ];
  const thumbnailImg = categoryData;
  category(thumbnailImg);
  // Adding click events to product cards
  setTimeout(() => {
    document.querySelectorAll(".category-item").forEach((item) => {
      item.addEventListener("click", () => {
        const selected = item.getAttribute("data-category");
        window.location.href = `components/category.html?category=${selected}`;
      });
    });
  }, 100);
});

// event Listener for category file
document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadData();
  window.cachedData = data;
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategory = urlParams.get("category") || "womens";

  showProducts(selectedCategory);
});

function showProducts(categoryName) {
  const productContainer = document.getElementById("product-list");
  const categoryHeadline = document.getElementById("category-headline");
  if (!productContainer) return;

  productContainer.innerHTML = "";
  const data = window.cachedData;
  let categoryTag;

  let products = [];
  if (categoryName === "womens") {
    products = data.womens;
    categoryTag = "Women's";
  } else if (categoryName === "mens") {
    products = data.mens;
    categoryTag = "Men's";
  } else if (categoryName === "accessories") {
    products = data.accessories;
    categoryTag = "Accessories";
  }
  // Category Tag
  categoryHeadline.innerHTML = `<h3 class="ps-5 m-3">Category: ${categoryTag}</h3>`;

  products.forEach((product) => {
    const card = `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <a href="single-product.html?category=${categoryName}&id=${product.id}" class="text-decoration-none text-dark">
        <div class="card border-0 shadow-sm h-100 zoom-hover ">
          <img src="${product.thumbnail}" class="card-img-top rounded rounded-5 img-fluid" alt="${product.title}">
          <div class="card-body d-flex justify-content-between justify-item-center align-items-center">
            <h5 class="card-title ">${product.title}</h5>
            <p class="card-text">$${product.price}</p>
          </div>
        </div>
      </div>`;
    productContainer.insertAdjacentHTML("beforeend", card);
  });
}

//Single Product Page event listener
document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.includes("single-product.html")) {
    const param = new URLSearchParams(window.location.search);
    const category = param.get("category");
    const id = parseInt(param.get("id"));
    const data = await loadData();
    const products = data[category];
    const product = products.find((p) => p.id === id);
    const singleProdContainer = document.getElementById("single-product");
    const productQuantity = 1;
    const image = product.images
      .map((imageSrc, index) => {
        return `<div>
           <button class="image-selector" data-index=${index} data-src=${imageSrc}>
           <img src="${imageSrc}" alt="product-image"/>
           </button>
      </div>`;
      })
      .join("");

    if (product) {
      singleProdContainer.innerHTML = `
      
        <div class="col-12 col-md-3 col-lg-2  ">
           ${image}
        </div>
         <div class="col-12 col-md-6 col-lg-6 main-image">
         <div id="main-single-image">
         </div>
         </div>
         <div class="col-12 col-md-9 col-lg-4 d-flex d-sm-flex flex-column justify-content-start align-items-start pt-2">
         
          <strong class="bg-success p-2 w-25 rounded rounded-pill font-weight-bolder text-monospace">Layer</strong>
          <h2 class="fs-1 fw-bolder lh-2">${product.title}</h2>
          <div class="size-guide mt-2">
          <a href="#">
          <strong>Size guide</strong>
          </a>
          </div>
          <form method="post">
          <input type="hidden" name="variant-id" id="variant-id" value="product">
          <input type="hidden" name="utf8" value="✓">
          <div class="radio-group">
            <div class="radio-btn-size">
              <input type="radio" id="size-s" name="size"  value="S" checked>
              <label for="size-s" class="label">S</label>
            </div>
            <div class="radio-btn-size">
              <input type="radio" id="size-m" name="size"  value="M">
              <label for="size-m" class="label">M</label>
            </div>
            <div class="radio-btn-size">
              <input type="radio" id="size-l" name="size"  value="L">
              <label for="size-l" class="label">L</label>
            </div>
            <div class="radio-btn-size">
              <input type="radio" id="size-xl" name="size"  value="XL">
              <label for="size-xl" class="label">XL</label>
            </div>
            <div class="radio-btn-size">
              <input type="radio" id="size-2xl" name="size"  value="2XL">
              <label for="size-2xl" class="label">2XL</label>
            </div>
          </div>
          </form>
          <div class="product-quantity">
           <button id="decrease-btn">-</button>
           <input type="number" id="quantity-num" name="quantity" value="1" min="1">
           <button id="increase-btn">+</button>
          </div>
          <button type="submit" id="add-to-cart-btn" class="add-to-cart mt-20px">Add Rs. ${product.price} ${product.title}</button>

          <div id="contact-form" class="mt-4" style="display: none;">
  <h4>Contact Form</h4>
  <form id="user-contact">
    <div class="mb-2">
      <input type="text" placeholder="First Name" name="firstName" class="form-control " required />
    </div>
    <div class="mb-2">
      <input type="text" placeholder="Last Name" name="lastName" class="form-control" required />
    </div>
    <div class="mb-2">
      <input type="email" placeholder="xyz@abcd.com" name="email" class="form-control" required />
    </div>
    <div class="mb-2">
      <input type="tel" placeholder="Phone Number" name="phone" class="form-control" required />
    </div>
    <div class="mb-2">
      <textarea placeholder="Address" name="address" class="form-control" required></textarea>
    </div>
    <button type="submit" class="btn btn-success" id="user-contact">Submit</button>
  </form>
</div>

          <p class="prod-description">${product.description}</p>
          <div class="product-detail d-flex flex-row justify-content-between">
  <div class="accordion-main" id="product-accordion">
    <div class="accordion-header d-flex justify-content-between align-items-center" style="cursor: pointer;">
      <h4 class="mb-0">Product Details</h4>
      <i class='bx bx-chevron-down' style='color:#221d1c'></i>
    </div>
    <div class="accordion-content mt-2" style="display: none;">
      <p>80% Cotton, 15% Nylon, 5% Spandex knitted fabric</p>
    </div>
  </div>
</div>
         </div>
      `;
      singleImageListeners();
      userSelectedSize();
      setupQuantitySelector();
      setupAccordion();
    }
  }
});
//Single image listener
function singleImageListeners() {
  const currentSelector = document.querySelectorAll(".image-selector");
  const mainSingleImage = document.getElementById("main-single-image");
  currentSelector.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentSelector.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      const imageSrc = btn.getAttribute("data-src");
      mainSingleImage.innerHTML = `<img src="${imageSrc}" class="img-fluid " alt="selected-image" />`;
    });
  });
  if (currentSelector.length > 0) currentSelector[0].click();
}
//Size Selector
function userSelectedSize() {
  const productSizes = {
    S: "101",
    M: "102",
    L: "103",
    XL: "104",
    "2XL": "105",
  };
  const hiddenInput = document.getElementById("variant-id");
  const currentSelectedSize = document.querySelectorAll("input[name='size']");

  currentSelectedSize.forEach((b) =>
    b.addEventListener("change", (e) => {
      hiddenInput.value = productSizes[e.target.value];
      console.log(hiddenInput.value);
    })
  );
}

//Product Quantity
function setupQuantitySelector() {
  const quantityInput = document.getElementById("quantity-num");
  const increaseBtn = document.getElementById("increase-btn");
  const decreaseBtn = document.getElementById("decrease-btn");
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const contactForm = document.getElementById("contact-form");

  const updateButtonState = () => {
    const quantity = parseInt(quantityInput.value);
    addToCartBtn.disabled = quantity === 0;
  };

  increaseBtn.addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
    updateButtonState();
  });

  decreaseBtn.addEventListener("click", () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
    updateButtonState();
  });

  quantityInput.addEventListener("input", () => {
    if (parseInt(quantityInput.value) < 0) quantityInput.value = 0;
    updateButtonState();
  });

  addToCartBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    if (quantity > 0) {
      contactForm.style.display = "block";
    }
  });

  updateButtonState();
}
// Contact form submission handler
const contactForm = document.getElementById("user-contact");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = contactForm.elements["firstName"].value;
    const lastName = contactForm.elements["lastName"].value;
    const email = contactForm.elements["email"].value;
    const phone = contactForm.elements["phone"].value;
    const address = contactForm.elements["address"].value;
    console.log("Submitted Contact Form:");
    console.log({ firstName, lastName, email, phone, address });

    window.location.href = "../order-confirmation.html";
  });
}

//Accordion event handling
function setupAccordion() {
  const accordion = document.getElementById("product-accordion");
  if (!accordion) return;
  const header = accordion.querySelector(".accordion-header");
  const content = accordion.querySelector(".accordion-content");
  const icon = accordion.querySelector("i");

  header.addEventListener("click", () => {
    const isVisible = content.style.display === "block";
    content.style.display = isVisible ? "none" : "block";
    icon.className = isVisible ? "bx bx-chevron-down" : "bx bx-chevron-up";
  });
}
