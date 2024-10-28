document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
});

// Crousal
document.addEventListener('DOMContentLoaded', function () {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.quote-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    setInterval(function () {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }, 3000); // Change every 3 seconds
});

function loadComponent(file, elementId) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading component:', error));
}

// Load the header and footer
loadComponent('../pages/components/header.html', 'header-placeholder');
loadComponent('../pages/components/footer.html', 'footer-placeholder');


document.addEventListener('DOMContentLoaded', function() {
    const footer = document.getElementById('footer');
    let isExpanded = false;
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Check if we're at the bottom of the page
        if ((windowHeight + scrollTop) >= (documentHeight - 10)) {
            if (!isExpanded) {
                footer.classList.add('expanded');
                isExpanded = true;
            }
        } else {
            if (isExpanded && scrollTop < lastScrollTop) {
                footer.classList.remove('expanded');
                isExpanded = false;
            }
        }

        lastScrollTop = scrollTop;
    });

    footer.addEventListener('click', function(e) {
        if (e.target === footer || e.target.closest('.footer-bottom')) {
            footer.classList.toggle('expanded');
            isExpanded = !isExpanded;
        }
    });
});