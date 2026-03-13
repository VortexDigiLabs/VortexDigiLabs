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

    // --- Staggered Testimonials Logic ---
    const testimonialsList = [
        { tempId: Math.random(), text: "My favorite solution in the market. We work 5x faster with Vortex Digi Labs.", by: "Alex, CEO at TechCorp", imgSrc: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
        { tempId: Math.random(), text: "I'm confident my data is safe with Vortex. I can't say that about other providers.", by: "Dan, CTO at SecureNet", imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
        { tempId: Math.random(), text: "I know it's cliche, but we were lost before we found Vortex. Can't thank you guys enough!", by: "Stephanie, COO at InnovateCo", imgSrc: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
        { tempId: Math.random(), text: "Vortex's products make planning for the future seamless. Can't recommend them enough!", by: "Marie, CFO at FuturePlanning", imgSrc: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
        { tempId: Math.random(), text: "If I could give 11 stars, I'd give 12.", by: "Andre, Head of Design at CreativeSolutions", imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" },
        { tempId: Math.random(), text: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I'd bet you've saved me 100 hours so far.", by: "Jeremy, PM at TimeWise", imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" }
    ];

    const cardsArea = document.getElementById('testimonialsCards');
    if (cardsArea) {
        let currentTestimonials = [...testimonialsList];
        let cardSize = window.innerWidth >= 640 ? 365 : 290;

        const renderCards = () => {
            cardsArea.innerHTML = '';
            currentTestimonials.forEach((testimonial, index) => {
                const position = currentTestimonials.length % 2 !== 0
                    ? index - Math.floor(currentTestimonials.length / 2)
                    : index - currentTestimonials.length / 2;
                    
                const isCenter = position === 0;

                const card = document.createElement('div');
                card.className = `testimonial-card ${isCenter ? 'is-center' : ''}`;
                
                card.style.width = `${cardSize}px`;
                card.style.height = `${cardSize}px`;
                
                const translateX = (cardSize / 1.5) * position;
                const translateY = isCenter ? -65 : (position % 2 ? 15 : -15);
                const rotate = isCenter ? 0 : (position % 2 ? 2.5 : -2.5);

                card.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`;
                
                card.innerHTML = \`
                    <span class="corner-accent"></span>
                    <img src="\${testimonial.imgSrc}" alt="" class="test-avatar" />
                    <h3>"\${testimonial.text}"</h3>
                    <p class="test-author">- \${testimonial.by}</p>
                \`;
                
                card.addEventListener('click', () => handleMove(position));
                cardsArea.appendChild(card);
            });
        };

        const handleMove = (steps) => {
            const newList = [...currentTestimonials];
            if (steps > 0) {
                for (let i = steps; i > 0; i--) {
                    const item = newList.shift();
                    if (!item) return;
                    newList.push({ ...item, tempId: Math.random() });
                }
            } else {
                for (let i = steps; i < 0; i++) {
                    const item = newList.pop();
                    if (!item) return;
                    newList.unshift({ ...item, tempId: Math.random() });
                }
            }
            currentTestimonials = newList;
            renderCards();
        };

        document.getElementById('prevTestimonialBtn').addEventListener('click', () => handleMove(-1));
        document.getElementById('nextTestimonialBtn').addEventListener('click', () => handleMove(1));

        window.addEventListener('resize', () => {
            cardSize = window.innerWidth >= 640 ? 365 : 290;
            renderCards();
        });

        renderCards();
    }
});
