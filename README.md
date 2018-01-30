# MLA-Chrome Extension

A chrome extension that takes highlighted quotes and stores it in the local storage. The user can then access the stored quotes and its auto-generated MLA.

## manifest.json

Most of the fields in this JSON file are self-explanatory, so I won’t waste your time explaining everything, but take note of the `browser_action` section where we specify what the default icon is and what HTML page should be displayed when the Browser Action button is clicked.

You’ll also notice I’ve added a permissions section that specifies that we need to have permission to access the `activeTab`. This is required in order to enable us to get the URL of the current tab to pass on to GTmetrix.

## Deployment and Testing

1. Navigate to the url `chrome://extensions/`.
2. Check the checkbox next to `Developer mode`.
3. Press `Load unpacked extension...`
4. Select the folder containing the extension.
