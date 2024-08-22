
  // Right-click event handler
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // Prevent the default context menu
    alert('Right-clicking is disabled on this page.'); // Show a message
  });
  
  // Keydown event handler to block specific shortcuts
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'j' || e.key === 'J' || e.key === 'u' || e.key === 'U' || e.key === 'i' || e.key === 'I')) {
      e.preventDefault(); // Prevent the default action for the blocked key combination
      alert('Keyboard shortcut is disabled on this page.'); // Show a message
    }
  });
