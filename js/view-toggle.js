class ViewToggle {
    constructor() {
        this.button = document.querySelector('.view-toggle');
        this.isMobileView = true;
        this.phoneWrapper = document.querySelector('.phone-frame-wrapper');
        this.content = document.querySelector('.content');
        
        this.button.addEventListener('click', () => this.toggle());
        this.updateButtonText();
    }

    toggle() {
        this.isMobileView = !this.isMobileView;
        document.body.classList.toggle('desktop-view');
        
        // Add animations
        this.phoneWrapper.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        if (this.isMobileView) {
            this.phoneWrapper.style.transform = 'translate(0, -50%)';
        } else {
            this.phoneWrapper.style.transform = 'translate(-150%, -50%)';
        }
        
        // Ensure content is visible during transition
        this.content.style.visibility = 'visible';
        this.content.style.opacity = '1';
        
        this.updateButtonText();
    }

    updateButtonText() {
        const span = this.button.querySelector('span');
        const icon = this.button.querySelector('.view-icon');
        
        if (this.isMobileView) {
            span.textContent = 'Website';
            icon.style.transform = 'rotate(0deg)';
        } else {
            span.textContent = 'Mobile';
            icon.style.transform = 'rotate(90deg)';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ViewToggle();
});
