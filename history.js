// Function to dump HTML content into localStorage
function dumpHTMLToLocalStorage() {
    const htmlContent = document.documentElement.outerHTML;
    localStorage.setItem('savedHTML', htmlContent);
}

// Function to load HTML content from localStorage
function loadHTMLFromLocalStorage() {
    const savedHTML = localStorage.getItem('savedHTML');
    if (savedHTML) {
        document.open();
        document.write(savedHTML);
        document.close();
    }
}

window.addEventListener('load', () => {
    // Dump HTML content into localStorage when the page unloads
    window.addEventListener('unload', dumpHTMLToLocalStorage);

    // Load HTML content from localStorage when the page loads
    window.addEventListener('load', loadHTMLFromLocalStorage);
});