document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor-follower');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px)`;
        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Enhanced hover effect
    document.querySelectorAll('a, button, .app-icon').forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        
        elem.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });
});
