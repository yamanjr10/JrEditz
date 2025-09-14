// Tutorial data
const tutorials = [
    {
        title: "How to make Doted glitch effect in Capcut | glitch effect in Capcut Tutorial",
        thumbnail: "img/How to make Doted glitch effect in Capcut glitch effect in Capcut Tutorial.jpg",
        link: "https://youtu.be/1v1Yk3eXG7A?si=ZKXH1gk2b0mJHjvV",
        duration: "4 min",
        date: "16 Sep 2025",
        badge: "up coming",   
    },
    {
        title: "How to make Aura in Capcut | Aura in Capcut Tutorial",
        thumbnail: "img/How to make Aura in Capcut  Aura in Capcut Tutorial.jpg",
        link: "https://youtu.be/SUpB3rgz9A0?si=AhCbl-hi-Q7YNmyL",
        duration: "4 min",
        date: "15 Sep 2025",
        badge: "out now",
    },
    {
        title: "Advance Clone in Capcut Tutorial | clone Tutorial in Capcut",
        thumbnail: "img/Advance Clone in Capcut Tutorial  clone Tutorial in Capcut.jpg",
        link: "https://youtu.be/DNW2NPeVwjU?si=9g3N3WJj9c5Df3-R",
        duration: "8 min",
        date: "13 Sep 2025",
        badge: "new",
    },
    {
        title: "Shrine Null Capcut Tutorial | Null Tutorial in Capcut",
        thumbnail: "img/Shrine Null Capcut Tutorial  Null Tutorial in Capcut.jpg",
        link: "https://youtu.be/QZc67CgrL2M?si=e55jQ1xQpIA3pV2K",
        duration: "5 min",
        date: "12 Sep 2025",
        badge: "popular",
    },
];

// Pagination variables
const tutorialsPerPage = 6;
let currentPage = 1;

// Generate Tutorials Section with pagination
const tutorialsContainer = document.getElementById("tutorials-container");
const paginationContainer = document.getElementById("pagination");

function displayTutorials(page) {
    const startIndex = (page - 1) * tutorialsPerPage;
    const endIndex = startIndex + tutorialsPerPage;
    const paginatedTutorials = tutorials.slice(startIndex, endIndex);
    
    let tutorialsHTML = `
        <h2 class="section-title">Latest <span>Tutorials</span></h2>
        <div class="video-container">
    `;

    paginatedTutorials.forEach(tutorial => {
        const badgeHTML = tutorial.badge ? `<div class="video-badge ${tutorial.badge.replace(' ', '-')}">${tutorial.badge}</div>` : '';

        tutorialsHTML += `
        <div class="video-card">
            <div class="video-thumb">
                <img src="${tutorial.thumbnail}" alt="${tutorial.title}" loading="lazy">
                ${badgeHTML}
                <div class="play-btn">
                    <a href="${tutorial.link}" target="_blank" style="color: white;">
                        <i class="fas fa-play"></i>
                    </a>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${tutorial.title}</h3>
                <div class="video-meta">
                    <span><i class="far fa-clock"></i> ${tutorial.duration}</span>
                    <span>${tutorial.date}</span>
                </div>
            </div>
        </div>
        `;
    });

    tutorialsHTML += `</div>`;
    tutorialsContainer.innerHTML = tutorialsHTML;
    
    // Update pagination buttons
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(tutorials.length / tutorialsPerPage);
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn ${currentPage === i ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(tutorials.length / tutorialsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayTutorials(currentPage);
    // Scroll to tutorials section
    document.getElementById('tutorials').scrollIntoView({ behavior: 'smooth' });
}

// Initialize tutorials display
displayTutorials(currentPage);


// Back to Top Button Functionality
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Create particles for background
document.addEventListener('DOMContentLoaded', function () {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 5 + 2;
        const colors = ['#ff2a6d', '#00f5ff', '#ffcc00'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = randomColor;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `-${Math.random() * 20}s`;

        particlesContainer.appendChild(particle);
    }

    // Add animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            this.style.animation = 'pulse 1s infinite';
        });

        btn.addEventListener('mouseleave', function () {
            this.style.animation = 'none';
        });
    });
});

// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');
const body = document.body;

function toggleMobileNav() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
}

hamburger.addEventListener('click', toggleMobileNav);
overlay.addEventListener('click', toggleMobileNav);

const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', toggleMobileNav);
});

window.addEventListener('resize', function () {
    if (window.innerWidth > 968) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }
});

// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }

    function openModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    const openers = document.querySelectorAll('[data-modal]');
    openers.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = el.dataset.modal;
            if (target) openModal(target);
            history.replaceState(null, document.title, window.location.pathname + window.location.search);
        });
    });

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.close;
            closeModal(id);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList && e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => {
                if (m.style.display === 'flex') {
                    m.style.display = 'none';
                }
            });
            document.body.style.overflow = '';
        }
    });
});
