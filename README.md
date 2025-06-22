# YouTube Matrix Extension

**Escape the Matrix. Take control of your YouTube experience.**

---

## Overview

This Chrome extension allows you to filter, block, and analyze your YouTube usage in a highly customizable, Matrix-inspired interface. You can blacklist or whitelist channels, restrict content by categories, activate a "Nuclear Mode" to block everything except your chosen whitelist, and review your usage analytics.

---

## Features

- **Password Protection:** Settings are locked by default. The initial password is `matrix`. You can change it after unlocking.
- **Blacklist:** Block specific YouTube channels.
- **Whitelist:** Always allow specific channels, even if they are blacklisted or blocked by category.
- **Allowed Categories:** Only allow videos from selected categories.
- **Blocked Categories:** Block videos from selected categories.
- **Nuclear Mode:** Block all content except whitelisted channels.
- **Data Analytics:** Visualize your YouTube usage by channel and category, including time spent.

---

## Installation & Setup

1. **Clone or Download the Repository**

   ```
   git clone <repo-url>
   # or download and extract the zip
   ```

2. **Open Chrome and Go to Extensions**

   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)

3. **Load the Extension**

   - Click "Load unpacked"
   - Select the `/youtube-matrix` folder (the one containing `manifest.json`)

4. **Permissions**

   - The extension will request permissions for storage and access to YouTube pages.

5. **Open the Settings Page**

   - Click the extension icon and select "Open Settings"
   - Or open `settings.html` directly in your browser

---

## Usage Instructions

### Unlocking the Settings

- Enter the default password: `matrix`
- Click "Unlock"
- The Matrix-themed description will disappear, revealing all settings

### Changing the Password

- Enter a new password in the "Set Password" section and click "Set Password"

### Blacklist/Whitelist

- Add channels to the blacklist to block them
- Add channels to the whitelist to always allow them

### Allowed/Blocked Categories

- Use the dropdowns to select categories to allow or block
- Click "+" to add them to the respective list

### Nuclear Mode

- Toggle the "Activate-Nuclear-Mode" switch to block all content except whitelisted channels

### Data Analytics

- Click "Review Data Analysis" to see your YouTube usage breakdown by channel and category

---

## File Structure

```
youtube-matrix/
├── background.js
├── blocked.html
├── config.html
├── config.js
├── content-timer.js
├── contentScript.js
├── data-analytics.css
├── data-analytics.html
├── data-analytics.js
├── manifest.json
├── script.js
├── settings.html
├── settings.js
├── libs/
│   ├── chart.js
│   └── tailwind.css
└── src/
    ├── App.js
    ├── content-timer (copy).js
    ├── graph.js
    ├── popup.html
    ├── popup.js
    ├── settings_2.html
    ├── settings.html
    ├── settings.js
    └── thankGO/
        ├── data-analytics.html
        └── data-analytics.js
```

---

## Code Explanation

### `settings.html` & `settings.js`

- **UI:** Matrix-themed, password-protected settings page.
- **Password:** Default is `matrix`. Changeable in the UI.
- **Sections:** Blacklist, Whitelist, Allowed/Blocked Categories, Nuclear Mode.
- **Description:** Matrix-inspired help box, hidden after unlocking.
- **All settings are stored using `chrome.storage.sync` for persistence.**

### `background.js`

- Handles background tasks, such as fetching channel/category info from the YouTube API and enforcing blacklist/whitelist/nuclear mode logic.

### `content-timer.js`

- Tracks time spent watching each channel.
- Stores daily watch time in `chrome.storage.local`.

### `data-analytics.html`, `data-analytics.js`, `data-analytics.css`

- Visualizes your YouTube usage with charts (using Chart.js).
- Shows breakdown by channel, category, and total time.

### `config.html`, `config.js`

- Alternative configuration UI for advanced users.

### `manifest.json`

- Chrome extension manifest (permissions, scripts, pages).

---

## Customization

- **Add/Remove Categories:** Edit the category lists in `settings.html` as needed.
- **Styling:** Uses Tailwind CSS and custom Matrix-inspired styles.
- **Analytics:** Modify `data-analytics.js` for custom charts or data views.

---

## Troubleshooting

- If the extension doesn't work, ensure you have allowed all required permissions.
- Reload the extension after making changes.
- For issues with analytics, check the console for errors.

---

## Credits

- Inspired by The Matrix movie.
- Uses [Tailwind CSS](https://tailwindcss.com/) and [Chart.js](https://www.chartjs.org/).

---

## License

MIT License

---

**Welcome to the Matrix. Control your reality.**