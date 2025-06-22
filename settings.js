document.addEventListener('DOMContentLoaded', () => {
  let password = '';
  const DEFAULT_PASSWORD = 'matrix';
  const unlockBtn = document.getElementById('unlockBtn');
  const inputPassword = document.getElementById('inputPassword');
  const mainSection = document.getElementById('main-section');
  const lockSection = document.getElementById('lock-section');
  const setPasswordBtn = document.getElementById('setPasswordBtn');
  const setPasswordInput = document.getElementById('setPasswordInput');
  const addWhitelistBtn = document.getElementById('addWhitelistBtn');
  const whitelistInput = document.getElementById('whitelistInput');
  const whitelistList = document.getElementById('whitelist');
  const addBlacklistBtn = document.getElementById('addBlacklistBtn');
  const blacklistInput = document.getElementById('blacklistInput');
  const blacklistList = document.getElementById('blacklist');

  // Load password and lists from Chrome storage
  const loadSettings = () => {
    chrome.storage.sync.get(['password', 'whitelist', 'blacklist'], (data) => {
      password = data.password || DEFAULT_PASSWORD; // Load the password or set to default
      inputPassword.value = ''; // Clear input field
      loadList(whitelistList, data.whitelist || []); // Load whitelist
      loadList(blacklistList, data.blacklist || []); // Load blacklist
    });
  };

  // Load list into the specified list element
  const loadList = (listElement, items) => {
    listElement.innerHTML = ''; // Clear previous items
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.classList.add('flex', 'justify-between', 'items-center');
      listItem.innerHTML = `
        <span>${item}</span>
        <button class="text-red-500 hover:text-red-400 transition-colors">
          <svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/></svg>
        </button>
      `;
      listElement.appendChild(listItem);
      listItem.querySelector('button').addEventListener('click', () => {
        removeItem(item, listElement, listItem);
      });
    });
  };

  // Remove item from the list
  const removeItem = (item, listElement, listItem) => {
    listElement.removeChild(listItem);
    // Determine which key to update based on the list element
    const key = listElement === whitelistList ? 'whitelist' : 'blacklist';
    // Update storage after removing
    chrome.storage.sync.get([key], (data) => {
      const updatedList = data[key] || [];
      const newList = updatedList.filter(i => i !== item);
      chrome.storage.sync.set({ [key]: newList });
    });
  };

  // Unlock functionality
  unlockBtn.addEventListener('click', () => {
    if (inputPassword.value === password || (password === '' && inputPassword.value === DEFAULT_PASSWORD)) {
      lockSection.classList.add('hidden');
      mainSection.classList.remove('hidden');
    }
  });

  // Set new password
  setPasswordBtn.addEventListener('click', () => {
    password = setPasswordInput.value;
    setPasswordInput.value = '';
    chrome.storage.sync.set({ password: password }); // Save the new password to storage
  });

  // Add to whitelist
  const addToWhitelist = () => {
    addToList(whitelistInput, whitelistList, 'whitelist');
  };

  // Add to blacklist
  const addToBlacklist = () => {
    addToList(blacklistInput, blacklistList, 'blacklist');
  };

  // Generic function to add to a list
  const addToList = (inputElement, listElement, key) => {
    const inputValue = inputElement.value.trim();
    if (inputValue) {
      const listItem = document.createElement('li');
      listItem.classList.add('flex', 'justify-between', 'items-center');
      listItem.innerHTML = `
        <span>${inputValue}</span>
        <button class="text-red-500 hover:text-red-400 transition-colors">
          <svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/></svg>
        </button>
      `;
      listElement.appendChild(listItem);
      inputElement.value = '';
      listItem.querySelector('button').addEventListener('click', () => {
        removeItem(inputValue, listElement, listItem);
      });

      // Update storage
      chrome.storage.sync.get({ [key]: [] }, (data) => {
        const updatedList = [...data[key], inputValue];
        chrome.storage.sync.set({ [key]: updatedList });
      });
    }
  };

  addWhitelistBtn.addEventListener('click', addToWhitelist);
  addBlacklistBtn.addEventListener('click', addToBlacklist);
 
  // Load settings on initial page load
  loadSettings();
});

// Handling Nuclear Mode
document.addEventListener('DOMContentLoaded', () => {
  const nuclearCheckbox = document.getElementById('nuclearCheckbox');

  // Load the state from chrome.storage when the settings page is loaded
  chrome.storage.sync.get(['nuclearModeEnabled'], function (result) {
    nuclearCheckbox.checked = result.nuclearModeEnabled || false; // Default is false
    document.getElementById('nuclearCheckbox').checked = nuclearCheckbox.checked; // Set the checkbox state
  });

  // Add event listener to save the toggle state in chrome.storage
  nuclearCheckbox.addEventListener('change', function () {
    chrome.storage.sync.set({ nuclearModeEnabled: nuclearCheckbox.checked }, function () {
      console.log('Nuclear Mode is set to: ' + nuclearCheckbox.checked);
    });
  });
});



// Load categories from storage
const loadCategories = () => {
  chrome.storage.sync.get('categories', (data) => {
    const categories = data.categories || [];
    categories.forEach(category => {
      const listItem = document.createElement('li');
      listItem.textContent = category;
      listItem.className = "flex justify-between items-center";

      // Create remove button for category with black background and red text
      const removeBtn = document.createElement('button');
      removeBtn.className = "bg-black text-red-500 p-1 rounded hover:bg-gray-800 transition-colors"; // Black background, red text
      removeBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/></svg>'; // Smaller icon

      removeBtn.onclick = () => removeItem(category, categoriesList, listItem); // Use the same remove function

      listItem.appendChild(removeBtn);
      categoriesList.appendChild(listItem);
    });
  });
};

// Function to add category to the list
const addCategory = () => {
  const selectedCategory = categoriesDropdown.value;
        console.log('Nuclear Mode is set to: ');
  if (selectedCategory && !Array.from(categoriesList.children).some(item => item.textContent === selectedCategory)) {
    const listItem = document.createElement('li');
    listItem.textContent = selectedCategory;
    listItem.className = "flex justify-between items-center";

    // Create remove button for category with black background and red text
    const removeBtn = document.createElement('button');
    removeBtn.className = "bg-black text-red-500 p-1 rounded hover:bg-gray-800 transition-colors"; // Black background, red text
    removeBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/></svg>'; // Smaller icon

    removeBtn.onclick = () => {
      // Remove category from the list
      categoriesList.removeChild(listItem);
      // Remove from storage
      chrome.storage.sync.get('categories', (data) => {
        const updatedCategories = data.categories.filter(item => item !== selectedCategory);
        chrome.storage.sync.set({ categories: updatedCategories });
      });
    };

    listItem.appendChild(removeBtn);
    categoriesList.appendChild(listItem);

    // Update storage
    chrome.storage.sync.get('categories', (data) => {
      const updatedCategories = data.categories ? [...data.categories, selectedCategory] : [selectedCategory];
      chrome.storage.sync.set({ categories: updatedCategories });
    });
  }
};



// Function to add a category to categories1
const addCategory1 = () => {
  const dropdown = document.getElementById('categoriesDropdown1');
  const selectedCategory = dropdown.value;

  // Retrieve current categories1 from storage, add the new category, then update storage
  chrome.storage.sync.get('categories1', (data) => {
    const categories = data.categories1 || [];
    if (!categories.includes(selectedCategory)) {
      categories.push(selectedCategory);
      chrome.storage.sync.set({ categories1: categories }, () => {
        loadCategories1(); // Reload the list to display the new category
      });
    }
  });
};

// Function to load categories1 from storage and display them in the list
const loadCategories1 = () => {
  const categoriesList = document.getElementById('categoriesList1');
  categoriesList.innerHTML = ''; // Clear existing list items

  chrome.storage.sync.get('categories1', (data) => {
    const categories = data.categories1 || [];
    categories.forEach(category => {
      const listItem = document.createElement('li');
      listItem.textContent = category;
      listItem.className = "flex justify-between items-center";

      // Create remove button for each category item
      const removeBtn = document.createElement('button');
      removeBtn.className = "bg-black text-red-500 p-1 rounded hover:bg-gray-800 transition-colors";
      removeBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17h-2v-4H7v-2h4V7h2v4h4v2h-4v4z"/></svg>';

      // Attach event to remove button to delete the category
      removeBtn.onclick = () => {
        chrome.storage.sync.get('categories1', (data) => {
          const updatedCategories = (data.categories1 || []).filter(item => item !== category);
          chrome.storage.sync.set({ categories1: updatedCategories }, () => {
            loadCategories1(); // Reload the list after removal
          });
        });
      };

      listItem.appendChild(removeBtn);
      categoriesList.appendChild(listItem);
    });
  });
};

// Event listener to call addCategory1 on button click
document.getElementById('addCategoryBtn1').addEventListener('click', addCategory1);

// Load categories1 on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadCategories1(); // Load categories1 when the page loads
});


const removeItem = (item, listElement, listItem) => {
  listElement.removeChild(listItem);
  // Update storage after removing
  chrome.storage.sync.get('categories', (data) => {
    const updatedList = data.categories || [];
    const newList = updatedList.filter(i => i !== item);
    chrome.storage.sync.set({ categories: newList });
  });
};




// Event listeners for category addition
addCategoryBtn.addEventListener('click', addCategory);
addCategoryBtn1.addEventListener('click', addCategory);

categoriesDropdown.addEventListener('change', addCategory);
categoriesDropdown1.addEventListener('change', addCategory);

// Load categories on initial page load
loadCategories();

