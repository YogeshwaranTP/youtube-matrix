// config.js

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    setupEventListeners();
});

// Load settings from chrome.storage
function loadSettings() {
    chrome.storage.sync.get(["blacklist", "whitelist", "categories1", "categories"], (data) => {
        // Load Blacklist
        const blacklist = data.blacklist || [];
        populateList(blacklist, "blacklist");

        // Load Whitelist
        const whitelist = data.whitelist || [];
        populateList(whitelist, "whitelist");

        // Load Blocked and Allowed Categories
        const blockedCategories = data.categories || [];
        populateList(blockedCategories, "categoriesList");

        const allowedCategories = data.categories1 || [];
        populateList(allowedCategories, "categoriesList1");

        // Load Nuclear Mode
        document.getElementById("nuclearCheckbox").checked = data.nuclearMode || false;
    });
}


// Event listeners for UI interactions
function setupEventListeners() {
    // Blacklist
    document.getElementById("addBlacklistBtn").addEventListener("click", () => addItem("blacklistInput", "blacklist"));

    // Whitelist
    document.getElementById("addWhitelistBtn").addEventListener("click", () => addItem("whitelistInput", "whitelist"));

    // Blocked Categories
    document.getElementById("addBlockedCategoryBtn").addEventListener("click", () => addItemFromDropdown("blockedCategoriesDropdown", "blacklist"));

    // Allowed Categories
    document.getElementById("addAllowedCategoryBtn").addEventListener("click", () => addItemFromDropdown("allowedCategoriesDropdown", "whitelist"));

    // Nuclear Mode
    document.getElementById("nuclearCheckbox").addEventListener("change", (e) => {
        chrome.storage.sync.set({ nuclearMode: e.target.checked });
    });
}

// Add item to a list and save to chrome.storage

// Populate a list in the UI
function populateList(list, elementId) {
    const ul = document.getElementById(elementId);
    ul.innerHTML = "";
    list.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}

// Populate a dropdown with options
function populateDropdown(categories, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = "";
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });
}

