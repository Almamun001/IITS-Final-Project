// Get references to various elements in the DOM
const cartCounter = document.getElementById("iits-cart_counter");
const addToCartButtons = document.querySelectorAll(".addToCartBtn");
const cartDecrementButton = document.getElementById("cart_dec");
const itemsContainer = document.getElementById("iits-items");
const menuSection = document.getElementById("menu-section");
const searchSection = document.getElementById("searchSection");

// Get references to category toggle buttons
const allToggleBtn = document.getElementById("all_toggle");
const coffeeToggleBtn = document.getElementById("coffee_toggle");
const burgerToggleBtn = document.getElementById("burger_toggle");

// Get references to search-related elements
const searchForm = document.getElementById("searchForm");
const searchBox = document.getElementById("iits-searchBox");

// Initialize cart count and fetched data array
let cartCount = 0;
let fetchedData = [];

// Function to initialize the cart count from local storage on page load
function initCartCounter() {
  const storedCartCount = localStorage.getItem("cartCount");
  if (storedCartCount !== null) {
    cartCount = parseInt(storedCartCount, 10);
    updateCartCounter();
  }
}

// Call the function to initialize the cart count on page load
initCartCounter();

// Function to update the cart count in the UI
function updateCartCounter() {
  cartCounter.innerText = cartCount;
}

// Function to handle "Add to cart" button click
function handleAddToCartButtonClick() {
  cartCount++;
  localStorage.setItem("cartCount", cartCount);
  updateCartCounter();
}

// Function to handle "cart decrement" button click
function handleCartDecrementButtonClick() {
  if (cartCount > 0) {
    cartCount--;
  }
  localStorage.setItem("cartCount", cartCount);
  updateCartCounter();
}

// Add click event listeners to the "Add to cart" buttons
addToCartButtons.forEach((button) => {
  button.addEventListener("click", handleAddToCartButtonClick);
});

// Add click event listener to the "cart decrement" button
cartDecrementButton.addEventListener("click", handleCartDecrementButtonClick);

// Function to render items in the UI
function renderItems(items) {
  itemsContainer.innerHTML = "";

  // Check if any items are available
  if (items.length === 0) {
    itemsContainer.innerHTML = '<p class="text-center">Nothing Found</p>';
    return;
  }

  // Loop through each item and create a card for it
  items.forEach((item) => {
    const itemCard = `
      <div class="item col-md-6 col-lg-4 p-3" data-category="${item.type}">
        <div class="card">
          <div class="img-container">
            <img src="${item.url}" alt="${item.name}" />
            <span class="category-pill">${item.type}</span>
          </div>
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.desc}</p>
            <button class="addToCartBtn btn w-100">Add to cart</button>
          </div>
        </div>
      </div>
    `;
    itemsContainer.innerHTML += itemCard;
  });

  // Get the "Add to cart" buttons for the newly added items
  const addToCartButtons = document.querySelectorAll(".addToCartBtn");

  // Add click event listeners to the newly added "Add to cart" buttons
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", handleAddToCartButtonClick);
  });
}

// Function to fetch data from the API
const getData = async () => {
  let url = "https://64b2e33138e74e386d55b072.mockapi.io/api/hanover";
  let option = {
    method: "GET",
  };

  try {
    let response = await fetch(url, option);
    let data = await response.json();

    // Store fetched data in the array
    data.forEach((ele) => {
      fetchedData.push(ele);
    });

    // Render the items on the page
    renderItems(fetchedData);
  } catch (err) {
    console.log(err);
  }
};

// Function to handle item filtering based on selected category
function handleCategoryToggle(e) {
  const selectedCategory = e.target.value;

  // Filter the items based on the selected category
  const filteredItems =
    selectedCategory === "all"
      ? fetchedData
      : fetchedData.filter((item) => item.type === selectedCategory);

  // Render the filtered items on the page
  renderItems(filteredItems);
}

// Function to handle search form submission
function handleSearchFormSubmit(e) {
  e.preventDefault();
  const searchValue = searchBox.value.toLowerCase();
  const filteredItems = fetchedData.filter((item) =>
    item.name.toLowerCase().includes(searchValue)
  );
  renderItems(filteredItems);
  searchBox.value = "";
}

// Add click event listeners to the filter radio buttons
allToggleBtn.addEventListener("click", handleCategoryToggle);
coffeeToggleBtn.addEventListener("click", handleCategoryToggle);
burgerToggleBtn.addEventListener("click", handleCategoryToggle);

// Add submit event listener to the search form
searchForm.addEventListener("submit", handleSearchFormSubmit);

// Admin section starts
const adminBtn = document.getElementById("iits-adminBtn");
const adminSection = document.getElementById("iits-adminSection");

// Admin login credentials
const expectedId = "iits";
const expectedPassword = "23";

// Function to handle admin button click
function handleAdminButtonClick() {
  const enteredId = prompt("Enter Admin ID:");
  const enteredPassword = prompt("Enter Admin Password:");

  if (enteredId === expectedId && enteredPassword === expectedPassword) {
    // Show admin section and hide menu and search sections
    adminSection.classList.remove("hidden");
    menuSection.classList.add("hidden");
    searchSection.classList.add("hidden");
    const addNewItemBtn = document.querySelector("#iits-addNewForm button");
    addNewItemBtn.addEventListener("click", handleAddNewItemButtonClick);
  } else {
    alert("Invalid ID or Password! Access denied.");
  }
}

// Add click event listener to the admin button
adminBtn.addEventListener("click", handleAdminButtonClick);

// Close admin section and show menu and search sections
let closeBtn = document.getElementById("iits-cancelBtn");
closeBtn.addEventListener("click", function () {
  adminSection.classList.add("hidden");
  menuSection.classList.remove("hidden");
  searchSection.classList.remove("hidden");
});
// Admin section ends

// Function to handle "Add New Item" button click in the admin section
function handleAddNewItemButtonClick(e) {
  e.preventDefault();

  // Get input values from the admin section
  const nameInput = document.getElementById("name");
  const picInput = document.getElementById("pic");
  const descInput = document.getElementById("desc");
  const typeItemInput = document.getElementById("typeItem");

  // Validate the inputs
  if (
    !nameInput.value ||
    !picInput.value ||
    !descInput.value ||
    typeItemInput.value === "invalid"
  ) {
    alert("Enter all the required data.");
    // Clear input fields after submission
    nameInput.value = "";
    picInput.value = "";
    descInput.value = "";
    typeItemInput.value = "invalid";
    return;
  }

  // Generate a new object representing the new item
  let length2 = fetchedData.length;
  const newObj = {
    name: nameInput.value,
    desc: descInput.value,
    id: length2 + 1,
    type: typeItemInput.value,
    url: picInput.value,
  };

  // Add the new item to the fetched data array
  fetchedData.push(newObj);

  // Render the updated items on the page
  renderItems(fetchedData);

  // Clear input fields after successful submission
  nameInput.value = "";
  picInput.value = "";
  descInput.value = "";
  typeItemInput.value = "invalid";

  // Hide admin section and show menu and search sections
  adminSection.classList.add("hidden");
  menuSection.classList.remove("hidden");
  searchSection.classList.remove("hidden");
}

// Fetch data from the API and render the initial items on page load
getData();

// Update inner text with developer's name
document.getElementById("iits-developer").innerHTML = "Abdullah Al Mamun";
