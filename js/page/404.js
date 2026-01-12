// Get the requested path from the URL
const currentPath = window.location.pathname;

// Extract the slug from the path
const pathSegments = currentPath.split("/").filter((segment) => segment.length > 0);
const lastSegment = pathSegments[pathSegments.length - 1];

// Determine what to display
let message;

// Check if this is the actual 404 page being visited intentionally
if (lastSegment === "404" || lastSegment === "404.html") {
  message = "This is the 404 page.";
} else {
  // Extract the slug (remove .html extension if present)
  const slug = lastSegment ? lastSegment.replace(".html", "") : "page";
  message = `${slug} not found.`;
}

// Update the h2 element with the message
const h2Element = document.querySelector("main.error-404 h2");
if (h2Element) {
  h2Element.textContent = message;
}
