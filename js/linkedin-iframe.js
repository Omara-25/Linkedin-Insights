// Add this to your GitHub Pages site
window.addEventListener('message', function(event) {
    // Check if the message is asking for height
    if (event.data === 'getHeight') {
      // Calculate the full height of the document
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      ) + 50; // Add padding
      
      // Send height back to parent
      window.parent.postMessage({height: height}, '*');
    }
  });
  
  // Also send height whenever content changes
  const observer = new MutationObserver(function() {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    ) + 50;
    
    window.parent.postMessage({height: height}, '*');
  });
  
  // Start observing the document for content changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });