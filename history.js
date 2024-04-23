// Function to dump HTML content into localStorage
function dump_html() {
    const htmlContent = document.documentElement.outerHTML;
    sessionStorage.setItem('savedHTML', htmlContent);
    sessionStorage.setItem("is_reloaded", "true");
}

// Function to load HTML content from localStorage
// czy session może?
function load_html() {
    const savedHTML = sessionStorage.getItem('savedHTML');
    if (savedHTML) {
        document.open();
        document.write(savedHTML);
        document.close();
    }
    sessionStorage.setItem("is_reloaded", "false");
}

// Dump HTML content into localStorage when the page unloads
window.addEventListener('unload', dump_html);

// Load HTML content from localStorage when the page loads
// window.addEventListener('load', loadHTMLFromLocalStorage);

if (sessionStorage.getItem("is_reloaded") === "true") {
    load_html();
}