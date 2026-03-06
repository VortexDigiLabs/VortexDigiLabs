document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll('.comparison-slider');

    sliders.forEach(slider => {
        const afterImage = slider.querySelector('.comparison-after');
        const handle = slider.querySelector('.slider-handle');
        let isDragging = false;

        // Start dragging
        const startDrag = (e) => {
            isDragging = true;
            // Prevent text selection during drag
            e.preventDefault();
        };

        // Stop dragging
        const stopDrag = () => {
            isDragging = false;
        };

        // Perform the drag
        const onDrag = (e) => {
            if (!isDragging) return;

            // Get standard mouse position or touch position
            let clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX === undefined) return;

            const sliderRect = slider.getBoundingClientRect();
            let xPos = clientX - sliderRect.left;

            // Constrain movement within the slider
            if (xPos < 0) xPos = 0;
            if (xPos > sliderRect.width) xPos = sliderRect.width;

            // Calculate percentage
            const percentage = (xPos / sliderRect.width) * 100;

            // Update clip-path for AFTER component (reveals AFTER on the left, BEFORE remains on the right)
            afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            
            // Move handle
            handle.style.left = `${percentage}%`;
        };

        // Mouse Events
        handle.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('mousemove', onDrag);

        // Touch Events
        handle.addEventListener('touchstart', startDrag, {passive: false});
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('touchcancel', stopDrag);
        window.addEventListener('touchmove', onDrag, {passive: false});
        
        // Allow clicking anywhere on the slider to jump to that position
        slider.addEventListener('mousedown', (e) => {
            if(e.target === handle || handle.contains(e.target)) return;
            isDragging = true;
            onDrag(e);
            isDragging = false; // Stop immediately after jump unless they dragged
        });
        
        slider.addEventListener('touchstart', (e) => {
            if(e.target === handle || handle.contains(e.target)) return;
            isDragging = true;
            onDrag(e);
            isDragging = false;
        }, {passive: false});
    });
});
