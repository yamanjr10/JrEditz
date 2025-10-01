// Tutorial data
const tutorials = [
    {
        title: "If Your Hand is Cut Off Edit Tutorial | GOJO Using RCT 🩸🔥 🥵 Manga Edit",
        thumbnail: "img/If Your Hand is Cut Off Edit Tutorial  GOJO Using RCT 🩸🔥 Manga Edit.jpg",
        link: "https://youtu.be/vYXW5e1yZ_Y?si=1soJFFK0ENLkHgpG",
        duration: "8 min",
        date: "1 Oct 2025",
        badge: "out now",   
    },
    {
        title: "Ku Lo Sa Edit Tutorial | Kaiser 🥵 Manga Edit Tutorial",
        thumbnail: "img/Ku Lo Sa Edit Tutorial Kaiser 🥵 Manga Edit Tutorial.jpg",
        link: "https://youtu.be/s9t8GRolr8Y?si=MWzmfBXuDRibX8bW",
        duration: "5 min",
        date: "30 Sep 2025", 
        badge: "new",
    },
    {
        title: "How to Make Manga Clips For Your Edit in Capcut + Movement to those clips",
        thumbnail: "img/How to Make Manga Clips For Your Edit in Capcut + Movement to those clips.jpg",
        link: "https://youtu.be/2srW2725kpE?si=mRhlKrzbT14TI03N",
        duration: "5 min",
        date: "28 Sep 2025",
    },
    {
        title: "Manga glitch effect in Capcut | glitch effect in Capcut Tutorial",
        thumbnail: "img/Manga glitch effect in Capcut  glitch effect in Capcut.jpg",
        link: "https://youtu.be/zG7iOZTSAeg?si=3xNI770TxhYdsCjV",
        duration: "4 min",
        date: "27 Sep 2025",
        badge: "popular",
    },
    {
        title: "Funk De Blezela Edit Tutorial Toji 🥵 Manga Edit Tutorial",
        thumbnail: "img/Funk De Blezela Edit Tutorial Toji 🥵 Manga Edit Tutorial.jpg",
        link: "https://youtu.be/eql35mOO6bc?si=LoCEPUsXXLBJS4Gc",
        duration: "15 min",
        date: "19 Sep 2025",
    },
    {
        title: "Advance Clone in Capcut Tutorial (P2) | clone Tutorial in Capcut",
        thumbnail: "img/Advance Clone in Capcut Tutorial ( P 2 ) clone Tutorial in Capcut.jpg",
        link: "https://youtu.be/p2jnyNONlSc?si=0cJAskRTXQR1nkuF",
        duration: "8 min",
        date: "18 Sep 2025", 
    },
    {
        title: "How to make Doted glitch effect in Capcut | glitch effect in Capcut Tutorial",
        thumbnail: "img/How to make Doted glitch effect in Capcut glitch effect in Capcut Tutorial.jpg",
        link: "https://youtu.be/a0EkP5bYq5g?si=Hg0DzDoWEaAWoapz",
        duration: "4 min",
        date: "16 Sep 2025",
    },
    {
        title: "How to make Aura in Capcut | Aura in Capcut Tutorial",
        thumbnail: "img/How to make Aura in Capcut  Aura in Capcut Tutorial.jpg",
        link: "https://youtu.be/SUpB3rgz9A0?si=AhCbl-hi-Q7YNmyL",
        duration: "4 min",
        date: "15 Sep 2025",
    },
    {
        title: "Advance Clone in Capcut Tutorial | clone Tutorial in Capcut",
        thumbnail: "img/Advance Clone in Capcut Tutorial  clone Tutorial in Capcut.jpg",
        link: "https://youtu.be/DNW2NPeVwjU?si=9g3N3WJj9c5Df3-R",
        duration: "8 min",
        date: "13 Sep 2025",
    },
    {
        title: "Shrine Null Capcut Tutorial | Null Tutorial in Capcut",
        thumbnail: "img/Shrine Null Capcut Tutorial  Null Tutorial in Capcut.jpg",
        link: "https://youtu.be/QZc67CgrL2M?si=e55jQ1xQpIA3pV2K",
        duration: "5 min",
        date: "12 Sep 2025",
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

// Smooth scrolling without hash in URL
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile nav if open
                if (mobileNav.classList.contains('active')) {
                    toggleMobileNav();
                }
                
                // Scroll to the element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without hash using History API
                const cleanUrl = window.location.origin + window.location.pathname;
                history.replaceState(null, null, cleanUrl);
            }
        });
    });
}

// Call this function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScroll();
    
    // Remove any existing hash on page load
    if (window.location.hash) {
        const cleanUrl = window.location.origin + window.location.pathname;
        history.replaceState(null, null, cleanUrl);
    }
});

// Smooth scrolling with data attributes
function setupSmoothScroll() {
    // Handle desktop navigation
    document.querySelectorAll('.nav-links [data-scroll]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('data-scroll'));
        });
    });
    
    // Handle mobile navigation
    document.querySelectorAll('.mobile-nav-links [data-scroll]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('data-scroll'));
        });
    });
}

function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
        // Close mobile nav if open
        if (mobileNav.classList.contains('active')) {
            toggleMobileNav();
        }
        
        // Scroll to the element
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Call this function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScroll();
});

// Highlight active navigation based on scroll position
function setActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 100 && 
            window.scrollY < sectionTop + sectionHeight - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-scroll') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', setActiveNav);

// Call on page load
document.addEventListener('DOMContentLoaded', function() {
    setActiveNav();
});
// ------- Enhanced Schedule Calendar Generation -------
document.addEventListener("DOMContentLoaded", () => {
    const scheduleContainer = document.querySelector("#scheduleModal .calendar");
    const year = 2025;
    const startDate = new Date(year, 8, 12); // Sept 12, 2025
    const cycle = ['upload', 'upload', 'break'];
    const longBreakStart = new Date(year, 8, 21);
    const longBreakEnd = new Date(year, 8, 26);
    const today = new Date();
    
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function calculateCycleIndex(date) {
        let index = 0;
        let current = new Date(startDate);
        while (current < date) {
            if (!(current >= longBreakStart && current <= longBreakEnd)) {
                index++;
            }
            current.setDate(current.getDate() + 1);
        }
        return index % cycle.length;
    }

    function generateMonthCalendar(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th>
                        <th>Thu</th><th>Fri</th><th>Sat</th>
                    </tr>
                </thead>
                <tbody>`;

        let day = 1;
        let dayOfWeek = firstDay;

        for (let week = 0; week < 6; week++) {
            html += "<tr>";
            for (let dow = 0; dow < 7; dow++) {
                if ((week === 0 && dow < firstDay) || day > daysInMonth) {
                    html += `<td class="empty"></td>`;
                } else {
                    let cellClass = "";
                    let content = `<span class="day-number">${day}</span>`;
                    let currentDay = new Date(year, month, day);

                    // Check if today
                    if (
                        currentDay.getFullYear() === today.getFullYear() &&
                        currentDay.getMonth() === today.getMonth() &&
                        currentDay.getDate() === today.getDate()
                    ) {
                        cellClass = "today";
                    }

                    // Add event if after start date
                    if (currentDay >= startDate) {
                        let cycleIndex = calculateCycleIndex(currentDay);
                        const status = cycle[cycleIndex];

                        // Long break Sept 21–26
                        if (month === 8 && currentDay >= longBreakStart && currentDay <= longBreakEnd) {
                            content += `<span class="event break">Break</span>`;
                        } else if (status === 'upload') {
                            const label = currentDay < today ? 'Uploaded' : 'Upload';
                            content += `<span class="event ${currentDay < today ? 'uploaded' : 'upload'}">${label}</span>`;
                        } else if (status === 'break') {
                            content += `<span class="event break">Break</span>`;
                        }
                    }

                    html += `<td class="${cellClass}">${content}</td>`;
                    day++;
                }
            }
            html += "</tr>";
            if (day > daysInMonth) break;
        }

        html += "</tbody></table>";
        return html;
    }

    function renderCalendar() {
        scheduleContainer.innerHTML = generateMonthCalendar(currentYear, currentMonth);
        
        
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // Show current month if September, October, or December
    const validMonths = [8, 9, 11]; // 8=Sept, 9=Oct, 11=Dec
    if (today.getFullYear() === year && validMonths.includes(today.getMonth())) {
        renderCalendar();
    } else {
        scheduleContainer.innerHTML = `<p style="text-align:center;">No schedule available for this month.</p>`;
    }
});

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 100);
        });
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .video-card, .feature-card, .resource-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                follower.style.transform = 'scale(1.3)';
                follower.style.borderColor = 'var(--primary)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                follower.style.transform = 'scale(1)';
                follower.style.borderColor = 'var(--secondary)';
            });
        });
    }
}

// Page Transitions
function initPageTransitions() {
    const transition = document.getElementById('pageTransition');
    
    // Show transition on page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            transition.classList.remove('active');
        }, 100);
    });
    
    // Smooth navigation between sections
    document.querySelectorAll('[data-scroll]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-scroll');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Add slight delay for transition feel
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 200);
            }
        });
    });
}

async function initYouTubeStats() {
}

// Countdown Timer
function initCountdownTimer() {
    const nextTutorialDate = new Date('2025-10-01T10:30:00').getTime(); // Replace with actual next tutorial date
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = nextTutorialDate - now;
        
        if (distance < 0) {
            document.getElementById('countdownContainer').innerHTML = `
                <h3 class="countdown-title">🎉 New Tutorial Available Now!</h3>
                <a href="https://youtu.be/vYXW5e1yZ_Y?si=1soJFFK0ENLkHgpG" class="btn btn-primary" style="margin-top: 20px;">
                    <i class="fas fa-play"></i> Watch Now
                </a>
            `;
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Scroll animations for sections
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize all features when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initCustomCursor();
    initPageTransitions();
    initYouTubeStats();
    initCountdownTimer();
    initScrollAnimations();
});




