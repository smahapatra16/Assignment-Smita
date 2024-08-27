document.addEventListener('DOMContentLoaded', () => {
  
  const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');

    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
  const url = "https://fakestoreapi.com/products";
  let allProducts = []; // Store all fetched products
  let filteredProducts = []; // Store filtered products
  let displayedCount = 0; // Track how many products have been displayed
  const itemsPerPage = 10; // Number of items to show per page
  const sortAscButton = document.getElementById('sortAsc');
  const sortDescButton = document.getElementById('sortDesc');
  

  // Fetch products and initialize the UI
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(productDetails => {
      allProducts = productDetails;
      filteredProducts = allProducts; // Initially, no filter applied
      displayInitialProducts(); ; // Display the initial batch of products
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Event listener for checkbox changes
  document.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.addEventListener('change', () => {
      getChecked();
      applyFilter();
      applySorting();
      displayedCount = 0; // Reset displayed count when filter changes
      displayInitialProducts(); ; // Redisplay after filtering
    });
  });


  // Clean class names for filtering
  function cleanClassName(className) {
    return className.replace(/[^\w\s]/g, '').replace(/\s+/g, '').toLowerCase();
  }


  // Build HTML for products
  function buildHtml(products) {
    return products.map(product => `
      <div class="products container ${cleanClassName(product.category)}" id="${cleanClassName(product.category)}">
        <div class="product-item">
          <img class="product-image" src="${product.image}" alt="${product.title}" />
        </div>
        <div class="product-info">
          <span class="category">${product.category}</span>
          <span>${product.title}</span>
          <h4 class="price">$${product.price.toFixed(2)}</h4>
          <span class="hidden count">${product.rating.count}</span>
        </div>
      </div>
    `).join('');
  }

  // Display the initial batch of products
  function displayInitialProducts() {
    const container = document.getElementById('productList');
    container.innerHTML = buildHtml(filteredProducts.slice(0, itemsPerPage));
    displayedCount = itemsPerPage;

    // Show or hide the "Load More" button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (displayedCount >= filteredProducts.length) {
      loadMoreBtn.style.display = 'none'; // Hide button if all products are displayed
    } else {
      loadMoreBtn.style.display = 'block'; // Show button if there are more products to display
    }
  }

  // Load more products when the "Load More" button is clicked
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    const container = document.getElementById('productList');
    const nextProducts = filteredProducts.slice(displayedCount, displayedCount + itemsPerPage);
    container.innerHTML += buildHtml(nextProducts); // Append new products
    displayedCount += itemsPerPage;

    // Show or hide the "Load More" button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (displayedCount >= filteredProducts.length) {
      loadMoreBtn.style.display = 'none'; // Hide button if all products are displayed
    }
  });

  // Event listener for search input
  document.getElementById('searchBar').addEventListener('input', () => {
    applySearch();
    displayedCount = 0; // Reset displayed count when searching
    displayInitialProducts(); // Redisplay after searching
  });

     // Get checked values for filtering
     function getChecked() {
      const checked = {
        category: Array.from(document.querySelectorAll('input[name=category]:checked')).map(el => cleanClassName(el.value)),
        price: Array.from(document.querySelectorAll('input[name=price]:checked')).map(el => cleanClassName(el.value)),
  };
      return checked;
    }
    
   // Apply filtering based on checked values
   function applyFilter() {
      const { category, price } = getChecked();
  
      filteredProducts = allProducts.filter(product => {
        // Clean product attributes for comparison
        const cleanedCategory = cleanClassName(product.category);
        const cleanedPrice = cleanClassName(product.price.toString()); // Ensure price is a string

        return (category.length === 0 || category.includes(cleanedCategory)) &&
               (price.length === 0 || price.includes(cleanedPrice));
      });
    }

 // Apply search based on input
 function applySearch() {
  const searchQuery = document.getElementById('searchBar').value.toLowerCase();
  filteredProducts = allProducts.filter(product => {
    return product.title.toLowerCase().includes(searchQuery);
  });
}

  // Apply sorting based on checked sorting checkboxes
  function applySorting(order) {
  const sortLowToHigh = document.getElementById('sortLowToHigh').checked;
  const sortHighToLow = document.getElementById('sortHighToLow').checked;

  if (sortLowToHigh || order === 'asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortHighToLow || order === 'desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  }
  // Event listeners for sorting buttons
  sortAscButton.addEventListener('click', () => {
    applySorting('asc');
    displayInitialProducts();
});

sortDescButton.addEventListener('click', () => {
    applySorting('desc');
    displayInitialProducts();
});
});

