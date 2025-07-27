function closeNote(button, innerNote) {
    innerNote = innerNote || button.parentElement;
    const noteButton = innerNote.previousElementSibling;
    
    innerNote.style.display = 'none';
    noteButton.textContent = noteButton.textContent.slice(0, -1) + '⊞';
}

function toggleNote(button) {
    const innerNote = button.nextElementSibling;
    
    if (innerNote.style.display === 'none' || innerNote.style.display === '') {
        innerNote.style.display = 'block';
        button.textContent = button.textContent.slice(0, -1) + '⊟';
        
        // Add close button if it doesn't exist
        if (!innerNote.querySelector('.close-button')) {
            const closeButton = document.createElement('span');
            closeButton.className = 'close-button';
            closeButton.textContent = '⊟';
            closeButton.onclick = function() { closeNote(this); };
            innerNote.appendChild(closeButton);
        }
    } else {
        closeNote(button, innerNote);
    }
}

// Initialize notes on page load
document.addEventListener('DOMContentLoaded', function() {
    const noteButtons = document.querySelectorAll('noteButton');
    noteButtons.forEach(function(button) {
        // Add the ⊞ icon
        button.textContent += ' ⊞';
        
        // Add click event listener
        button.addEventListener('click', function() {
            toggleNote(this);
        });
    });
});