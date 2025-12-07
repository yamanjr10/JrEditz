// Tutorial data - loaded from JSON
let tutorials = [];

// Pagination variables
const tutorialsPerPage = 6;
let currentPage = 1;

// We will query these inside DOMContentLoaded or guard their use
let tutorialsContainer;
let paginationContainer;
let countdownContainer;
let backToTop;
let particlesContainer;
let hamburger;
let mobileNav;
let overlay;
let body = document.body;
let scheduleContainer;
let nextMonthBtn;
let transitionElement;

// Load tutorials from JSON file
async function loadTutorials() {
    try {
        const response = await fetch('tutorials.json');
        if (!response.ok) throw new Error(`Failed to load JSON: ${response.status}`);
        const data = await response.json();
        tutorials = Array.isArray(data.tutorials) ? data.tutorials : (data || []).tutorials || [];
        console.log('Tutorials loaded successfully:', tutorials.length);
    } catch (error) {
        console.error('Error loading tutorials:', error);
        tutorials = [];
    } finally {
        autoUpdateBadges();
        if (typeof displayTutorials === 'function') displayTutorials(currentPage);
        if (typeof initCountdownTimer === 'function') initCountdownTimer();
        updateUpcomingTutorial();
    }

}
// === DISPLAY TUTORIALS ===
function displayTutorials(page = 1) {
    if (!tutorialsContainer) return;

    // Empty or loading state
    if (!Array.isArray(tutorials) || tutorials.length === 0) {
        tutorialsContainer.innerHTML = `
            <h2 class="section-title">Latest <span>Tutorials</span></h2>
            <p style="text-align: center; color: var(--secondary); padding: 50px;">
                <i class="fas fa-spinner fa-spin"></i> Loading tutorials...
            </p>
        `;
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // Pagination logic
    const startIndex = (page - 1) * tutorialsPerPage;
    const endIndex = startIndex + tutorialsPerPage;
    const paginatedTutorials = tutorials.slice(startIndex, endIndex);

    // Build HTML
    let tutorialsHTML = `
        <h2 class="section-title">Latest <span>Tutorials</span></h2>
        <div class="video-container">
    `;

    paginatedTutorials.forEach(tutorial => {
        const safeTitle = tutorial.title || 'Untitled';
        const safeThumb = tutorial.thumbnail || '';
        const safeLink = tutorial.link || '#';
        const badgeClass = tutorial.badge ? tutorial.badge.replace(/\s+/g, '-') : '';
        const badgeHTML = tutorial.badge
            ? `<div class="video-badge ${badgeClass}">${tutorial.badge}</div>`
            : '';

        tutorialsHTML += `
        <div class="video-card">
            <div class="video-thumb">
                ${safeThumb ? `<img src="${safeThumb}" alt="${safeTitle}" loading="lazy">`
                : `<div class="no-thumb">No image</div>`}
                ${badgeHTML}
                <div class="play-btn">
                    <a href="${safeLink}" target="_blank" style="color: white;">
                        <i class="fas fa-play"></i>
                    </a>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${safeTitle}</h3>
                <div class="video-meta">
                    <span><i class="far fa-clock"></i> ${tutorial.duration || '--'}</span>
                    <span>${tutorial.date || ''}</span>
                </div>
            </div>
        </div>
        `;
    });

    tutorialsHTML += `</div>`;
    tutorialsContainer.innerHTML = tutorialsHTML;

    // Update pagination
    updatePagination();
}

// === PAGINATION UI ===
function updatePagination() {
    if (!paginationContainer) return;

    const totalPages = Math.max(1, Math.ceil(tutorials.length / tutorialsPerPage));
    let paginationHTML = '';

    // Helper to create buttons
    const makeBtn = (page, label, disabled = false, active = false) => `
        <button 
            class="pagination-btn ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}" 
            ${disabled ? 'disabled' : ''} 
            data-page="${page}">
            ${label}
        </button>
    `;

    // First and Prev buttons
    paginationHTML += makeBtn(1, '<i class="fas fa-angle-double-left"></i>', currentPage === 1);
    paginationHTML += makeBtn(currentPage - 1, '<i class="fas fa-chevron-left"></i>', currentPage === 1);

    // Dynamic page window
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
    }

    // Leading ellipsis
    if (start > 1) {
        paginationHTML += makeBtn(1, '1');
        if (start > 2) paginationHTML += `<span class="pagination-ellipsis">…</span>`;
    }

    // Page numbers
    for (let i = start; i <= end; i++) {
        paginationHTML += makeBtn(i, i, false, currentPage === i);
    }

    // Trailing ellipsis
    if (end < totalPages) {
        if (end < totalPages - 1) paginationHTML += `<span class="pagination-ellipsis">…</span>`;
        paginationHTML += makeBtn(totalPages, totalPages);
    }

    // Next and Last buttons
    paginationHTML += makeBtn(currentPage + 1, '<i class="fas fa-chevron-right"></i>', currentPage === totalPages);
    paginationHTML += makeBtn(totalPages, '<i class="fas fa-angle-double-right"></i>', currentPage === totalPages);

    paginationContainer.innerHTML = paginationHTML;

    // Event Delegation
    paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPage = parseInt(btn.getAttribute('data-page'), 10);
            if (!isNaN(targetPage) && targetPage !== currentPage) changePage(targetPage);
        });
    });
}

// === CHANGE PAGE ===
function changePage(page) {
    const totalPages = Math.max(1, Math.ceil(tutorials.length / tutorialsPerPage));
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displayTutorials(currentPage);

    // Smooth scroll to section
    if (tutorialsContainer) {
        tutorialsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


// Function to fetch latest YouTube video via serverless function
async function fetchLatestYouTubeVideo() {
    try {
        console.log('Fetching latest YouTube video...');
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3000/api/latest-video'
            : '/api/latest-video';
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API response error: ${response.status}`);
        const data = await response.json();
        if (data && data.success && data.video) {
            console.log('Found video:', data.video.title);
            return data.video;
        } else {
            throw new Error(data && data.error ? data.error : 'No video found');
        }
    } catch (error) {
        console.error('Error fetching latest video:', error);
        return getLatestTutorialFromArray();
    }
}

// Fallback function to get latest from your tutorials array
function getLatestTutorialFromArray() {
    if (Array.isArray(tutorials) && tutorials.length > 0) {
        const latestTutorial = tutorials[0];
        return {
            title: latestTutorial.title,
            link: latestTutorial.link,
            id: extractVideoId(latestTutorial.link),
            duration: 0,
            durationFormatted: latestTutorial.duration
        };
    }
    return null;
}

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
}

// Function to update upcoming tutorial text in header/hero
function updateUpcomingTutorial() {
    const upcomingTutorialElement = document.querySelector('.upcoming-tutorial');
    if (!upcomingTutorialElement) return;
    if (Array.isArray(tutorials) && tutorials.length > 0) {
        const latestTutorial = tutorials[0];
        upcomingTutorialElement.textContent = latestTutorial.title || 'TBA';
        if (latestTutorial.link) {
            upcomingTutorialElement.style.cursor = 'pointer';
            upcomingTutorialElement.onclick = () => window.open(latestTutorial.link, '_blank');
        } else {
            upcomingTutorialElement.style.cursor = 'default';
            upcomingTutorialElement.onclick = null;
        }
    } else {
        upcomingTutorialElement.textContent = 'TBA';
        upcomingTutorialElement.style.cursor = 'default';
        upcomingTutorialElement.onclick = null;
    }
    // hover effects (safe)
    upcomingTutorialElement.style.transition = 'all 0.3s ease';
    upcomingTutorialElement.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 10px 40px rgba(255, 42, 109, 0.3)';
    });
    upcomingTutorialElement.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(255, 42, 109, 0.1)';
    });
}

// Auto Countdown Timer that matches the calendar schedule exactly
// Countdown Timer that always checks top tutorial
function initCountdownTimer() {
    countdownContainer = document.getElementById('countdownContainer');
    if (!countdownContainer) {
        console.warn('No countdownContainer in DOM — skipping countdown initialization.');
        return;
    }

    function getCurrentTutorial() {
        if (!Array.isArray(tutorials) || tutorials.length === 0) {
            return null;
        }

        const topTutorial = tutorials[0]; // Always use the top tutorial
        if (!topTutorial.date) {
            return null;
        }

        const tutorialDate = parseUploadDate(topTutorial.date);
        if (!tutorialDate) {
            return null;
        }

        // Set upload time to 5:00 PM local time
        const uploadTime = new Date(tutorialDate);
        uploadTime.setHours(17, 0, 0, 0);

        return {
            date: uploadTime,
            tutorial: topTutorial
        };
    }

    function parseUploadDate(dateString) {
        if (!dateString || dateString === 'Coming soon') return null;
        try {
            const parts = dateString.trim().split(' ');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = getMonthNumber(parts[1]);
                const year = parseInt(parts[2], 10);
                if (!isNaN(day) && month !== -1 && !isNaN(year)) {
                    return new Date(year, month, day);
                }
            }
        } catch (e) {
            console.error('Error parsing date:', dateString, e);
        }
        return null;
    }

    function getMonthNumber(monthStr) {
        if (!monthStr) return -1;
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const key = monthStr.toLowerCase().substring(0, 3);
        return months.indexOf(key);
    }

    function formatTime(ms) {
        const isNegative = ms < 0;
        const absMs = Math.abs(ms);

        const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absMs % (1000 * 60)) / 1000);

        return {
            days: (isNegative ? '-' : '') + String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
            isNegative: isNegative
        };
    }

    function updateCountdown() {
        const currentTutorial = getCurrentTutorial();

        if (!currentTutorial) {
            countdownContainer.innerHTML = `
                <h3 class="countdown-title">No Tutorial Scheduled</h3>
                <p style="color: var(--secondary);">Check back later for new content!</p>
            `;
            return;
        }

        const now = new Date();
        const distance = currentTutorial.date - now;
        const time = formatTime(distance);

        const hasLink = currentTutorial.tutorial.link && currentTutorial.tutorial.link.trim() !== '';
        const isWatchNowPeriod = distance <= 0 && distance > -15 * 60 * 60 * 1000; // 15 hours after 5:00 PM
        const isAfterWatchPeriod = distance <= -15 * 60 * 60 * 1000; // More than 15 hours past 5:00 PM

        // Check if there's a NEW tutorial (different date) after watch period
        if (isAfterWatchPeriod && hasLink) {
            // Check if this is still the most recent tutorial or if there's a newer one
            const nextTutorial = getCurrentTutorial(); // This will get the current top tutorial

            // If we're still showing the same tutorial that's past its watch period
            // and it has a link, keep showing "Watch Now"
            countdownContainer.innerHTML = `
                  <h3 class="countdown-title">🎉 New Tutorial Available Now!</h3>
                <a href="${currentTutorial.tutorial.link}" class="btn btn-primary" style="margin-top: 20px;" target="_blank">
                    <i class="fas fa-play"></i> Watch Now
                </a>
                <div style="margin-top: 10px; font-size: 0.8rem; color: var(--secondary);">
                </div>
            `;

        } else if (isWatchNowPeriod && hasLink) {
            // Watch Now period (15 hours after upload time)
            const timeLeftInWatchPeriod = -distance; // Convert to positive
            const hoursLeft = Math.floor(timeLeftInWatchPeriod / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeLeftInWatchPeriod % (1000 * 60 * 60)) / (1000 * 60));

            countdownContainer.innerHTML = `
                <h3 class="countdown-title">🎉 New Tutorial Available Now!</h3>
                <a href="${currentTutorial.tutorial.link}" class="btn btn-primary" style="margin-top: 20px;" target="_blank">
                    <i class="fas fa-play"></i> Watch Now
                </a>
                <div style="margin-top: 10px; font-size: 0.8rem; color: var(--secondary);">
                </div>
            `;
        } else {
            // Countdown mode (before upload OR no link during watch period)
            let title = 'Next Tutorial In:';
            let showWatchButton = false;

            if (time.isNegative) {
                if (hasLink) {
                    title = 'Tutorial Available!';
                    showWatchButton = true;
                } else {
                    title = 'Waiting For Upload:';
                }
            }

            countdownContainer.innerHTML = `
                <h3 class="countdown-title">${title}</h3>
                <div class="countdown-timer">
                    <div class="countdown-item">
                        <div class="countdown-number ${time.isNegative ? 'negative' : ''}" id="days">${time.days}</div>
                        <div class="countdown-label">Days</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number ${time.isNegative ? 'negative' : ''}" id="hours">${time.hours}</div>
                        <div class="countdown-label">Hrs</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number ${time.isNegative ? 'negative' : ''}" id="minutes">${time.minutes}</div>
                        <div class="countdown-label">Mins</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number ${time.isNegative ? 'negative' : ''}" id="seconds">${time.seconds}</div>
                        <div class="countdown-label">Secs</div>
                    </div>
                </div>
                <div class="upcoming-tutorial">
                    ${currentTutorial.tutorial.title || 'TBA'}
                </div>
                ${showWatchButton ? `
                    <a href="${currentTutorial.tutorial.link}" class="btn btn-primary" style="margin-top: 15px;" target="_blank">
                        <i class="fas fa-play"></i> Watch Tutorial
                    </a>
                ` : ''}
            `;

            // Make upcoming tutorial clickable if link exists
            const upcomingElement = countdownContainer.querySelector('.upcoming-tutorial');
            if (upcomingElement && hasLink) {
                upcomingElement.style.cursor = 'pointer';
                upcomingElement.onclick = () => window.open(currentTutorial.tutorial.link, '_blank');
                upcomingElement.style.transition = 'all 0.3s ease';
                upcomingElement.addEventListener('mouseenter', function () {
                    this.style.transform = 'scale(1.02)';
                    this.style.boxShadow = '0 10px 40px rgba(255, 42, 109, 0.3)';
                });
                upcomingElement.addEventListener('mouseleave', function () {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = '0 10px 30px rgba(255, 42, 109, 0.1)';
                });
            }
        }
    }

    // Add CSS for negative numbers
    if (!document.querySelector('#countdown-styles')) {
        const style = document.createElement('style');
        style.id = 'countdown-styles';
        style.textContent = `
            .countdown-number.negative {
                color: #ff4444 !important;
                text-shadow: 0 0 10px rgba(255, 68, 68, 0.5) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Initial update and set interval
    updateCountdown();
    if (initCountdownTimer._intervalId) clearInterval(initCountdownTimer._intervalId);
    initCountdownTimer._intervalId = setInterval(updateCountdown, 1000);
}

// Auto badge logic that updates dynamically based on date/time and tutorial order
function autoUpdateBadges() {
    if (!Array.isArray(tutorials) || tutorials.length < 3) return;

    // Helper: parse "7 Oct 2025" into a Date object at 10:30 AM
    function parseUploadDate(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.trim().split(' ');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10);
        const monthMap = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        };
        const month = monthMap[parts[1].substring(0, 3).toLowerCase()] || 0;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day, 17, 0, 0, 0); // upload time = 5:00 PM
    }

    const now = new Date();

    const top = tutorials[0];
    const second = tutorials[1];
    const third = tutorials[2];

    const topTime = parseUploadDate(top.date);
    if (!topTime) return;

    const timeDiff = now - topTime;

    // Badge rules:
    // -------------------------------------------
    // Before 5:00 PM on top tutorial's date
    if (timeDiff < 0) {
        top.badge = "up coming";
        second.badge = "out now";
        third.badge = "new";
    }
    // Between 5:00 PM and +15 hours (8:00 AM next day)
    else if (timeDiff >= 0 && timeDiff <= 15 * 60 * 60 * 1000) {
        top.badge = "out now";
        second.badge = "new";
        delete third.badge;
    }
    // After 15 hours have passed (after 8:00 AM next day)
    else {
        top.badge = "out now";
        second.badge = "new";
        delete third.badge;
    }
    setInterval(() => {
        autoUpdateBadges();
        displayTutorials(currentPage);
    }, 60 * 1000);
}


// Back to Top Button Functionality
function initBackToTop() {
    backToTop = document.getElementById("backToTop");
    if (!backToTop) return;
    window.addEventListener("scroll", () => {
        backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    });
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// Create particles for background
function initParticlesAndCTAs() {
    particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 50;
        const colors = ['#ff2a6d', '#00f5ff', '#ffcc00'];
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 5 + 2;
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
    }
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            this.style.animation = 'pulse 1s infinite';
        });
        btn.addEventListener('mouseleave', function () {
            this.style.animation = 'none';
        });
    });
}

// Hamburger menu functionality (safe)
function initMobileNav() {
    hamburger = document.getElementById('hamburger');
    mobileNav = document.getElementById('mobileNav');
    overlay = document.getElementById('overlay');
    body = document.body || document.getElementsByTagName('body')[0];

    function toggleMobileNav() {
        if (!hamburger || !mobileNav || !overlay) return;
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
    if (overlay) overlay.addEventListener('click', toggleMobileNav);

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav && mobileNav.classList.contains('active')) toggleMobileNav();
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 968 && hamburger && mobileNav && overlay) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Modal functionality
function initModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => m.style.display = 'none');

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
            if (id) closeModal(id);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(m => {
                if (m.style.display === 'flex') m.style.display = 'none';
            });
            document.body.style.overflow = '';
        }
    });
}

// Smooth scrolling without hash in URL
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (mobileNav && mobileNav.classList.contains('active')) {
                    // close mobile nav
                    const hamburgerEl = document.getElementById('hamburger');
                    if (hamburgerEl) hamburgerEl.click();
                }
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const cleanUrl = window.location.origin + window.location.pathname;
                history.replaceState(null, null, cleanUrl);
            }
        });
    });
}

// Smooth scrolling with data attributes
function setupSmoothScrollData() {
    document.querySelectorAll('.nav-links [data-scroll]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('data-scroll'));
        });
    });
    document.querySelectorAll('.mobile-nav-links [data-scroll]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection(this.getAttribute('data-scroll'));
        });
    });
}

function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;
    if (mobileNav && mobileNav.classList.contains('active')) {
        const hamburgerEl = document.getElementById('hamburger');
        if (hamburgerEl) hamburgerEl.click();
    }
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Highlight active navigation based on scroll position
function setActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-scroll') === currentSection) link.classList.add('active');
    });
}

// ------- Enhanced Schedule Calendar Generation -------
function initScheduleCalendar() {
    scheduleContainer = document.querySelector("#scheduleModal .calendar");
    if (!scheduleContainer) {
        // no calendar area - skip
        return;
    }

    const year = 2025;
    const startDate = new Date(year, 8, 12); // Sept 12, 2025
    const newScheduleStartDate = new Date(year, 9, 19); // Oct 19, 2025
    const cycle = ['upload', 'upload', 'break'];
    const longBreakStart = new Date(year, 8, 21);
    const longBreakEnd = new Date(year, 8, 26);
    const specialBreakStart = new Date(2025, 10, 23); // 23 Nov 2025 (month 10)
    const specialBreakEnd = new Date(2025, 10, 29); // 29 Nov 2025

    const today = new Date();

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function calculateCycleIndex(date) {
        let index = 0;
        let current = new Date(startDate);
        while (current < date) {
            if (!(current >= longBreakStart && current <= longBreakEnd)) index++;
            current.setDate(current.getDate() + 1);
        }
        return index % cycle.length;
    }

    function isUploadDay(date) {
        const dayOfWeek = date.getDay();
        return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    }

    function isUploadedByTime(uploadDate) {
        const uploadTime = new Date(uploadDate);
        uploadTime.setHours(10, 30, 0, 0);
        return new Date() >= uploadTime;
    }

    function generateMonthCalendar(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

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
        for (let week = 0; week < 6; week++) {
            html += "<tr>";
            for (let dow = 0; dow < 7; dow++) {
                if ((week === 0 && dow < firstDay) || day > daysInMonth) {
                    html += `<td class="empty"></td>`;
                } else {
                    let cellClass = "";
                    let content = `<span class="day-number">${day}</span>`;
                    let currentDay = new Date(year, month, day);
                    let hasUploadEvent = false;

                    // Check if today
                    const now = new Date();
                    if (
                        currentDay.getFullYear() === now.getFullYear() &&
                        currentDay.getMonth() === now.getMonth() &&
                        currentDay.getDate() === now.getDate()
                    ) {
                        cellClass = "today";
                    }

                    if (currentDay >= specialBreakStart && currentDay <= specialBreakEnd) {
                        content += `<span class="event break">Break</span>`;
                        hasUploadEvent = true;

                        html += `<td class="${cellClass}">${content}</td>`;
                        day++;
                        continue;
                    }

                    // Add event if after start date
                    if (currentDay >= startDate) {
                        if (currentDay < newScheduleStartDate) {
                            let cycleIndex = calculateCycleIndex(currentDay);
                            const status = cycle[cycleIndex];

                            if (month === 8 && currentDay >= longBreakStart && currentDay <= longBreakEnd) {
                                content += `<span class="event break">Break</span>`;
                                hasUploadEvent = true;
                            } else if (status === 'upload') {
                                const isUploaded = isUploadedByTime(currentDay);
                                const label = isUploaded ? 'Uploaded' : 'Upload';
                                content += `<span class="event ${isUploaded ? 'uploaded' : 'upload'}">${label}</span>`;
                                hasUploadEvent = true;
                            } else if (status === 'break') {
                                content += `<span class="event break">Break</span>`;
                                hasUploadEvent = true;
                            }
                        } else {
                            if (isUploadDay(currentDay)) {
                                const isUploaded = isUploadedByTime(currentDay);
                                const label = isUploaded ? 'Uploaded' : 'Upload';
                                content += `<span class="event ${isUploaded ? 'uploaded' : 'upload'}">${label}</span>`;
                                hasUploadEvent = true;
                            }
                        }

                        if (!hasUploadEvent) content += `<span class="event break">Break</span>`;
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

        // nextMonth button hook (attach only once)
        nextMonthBtn = document.getElementById('nextMonth');
        if (nextMonthBtn && !nextMonthBtn._listenerAttached) {
            nextMonthBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) { currentMonth = 0; currentYear++; }
                renderCalendar();
            });
            nextMonthBtn._listenerAttached = true;
        }
    }

    // Show current month only if desired months; else show message
    const validMonths = [8, 9, 10, 11]; // Sept, Oct, Nov, Dec
    if (new Date().getFullYear() === year && validMonths.includes(new Date().getMonth())) {
        renderCalendar();
    } else {
        scheduleContainer.innerHTML = `<p style="text-align:center;">No schedule available for this month.</p>`;
    }
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 100);
        });

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
    transitionElement = document.getElementById('pageTransition');
    // Show transition on page load
    window.addEventListener('load', () => {
        if (transitionElement) {
            setTimeout(() => {
                transitionElement.classList.remove('active');
            }, 100);
        }
    });

    document.querySelectorAll('[data-scroll]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-scroll');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 200);
            }
        });
    });
}

async function initYouTubeStats() {
    // placeholder - keep safe
}

// Scroll animations for sections
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    if (!sections || sections.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));
}

// Initialize all features when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    // Cache commonly used elements (safe)
    tutorialsContainer = document.getElementById("tutorials-container");
    paginationContainer = document.getElementById("pagination");
    countdownContainer = document.getElementById('countdownContainer');
    backToTop = document.getElementById("backToTop");
    particlesContainer = document.getElementById('particles');
    hamburger = document.getElementById('hamburger');
    mobileNav = document.getElementById('mobileNav');
    overlay = document.getElementById('overlay');
    scheduleContainer = document.querySelector("#scheduleModal .calendar");
    transitionElement = document.getElementById('pageTransition');

    // Load tutorials first, then initialize everything else
    loadTutorials().then(() => {
        setupSmoothScroll();
        setupSmoothScrollData();
        setActiveNav();
        initCustomCursor();
        initPageTransitions();
        initYouTubeStats();
        initScrollAnimations();

        initParticlesAndCTAs();
        initBackToTop();
        initMobileNav();
        initModals();
        initScheduleCalendar();

        // Remove any existing hash on page load
        if (window.location.hash) {
            const cleanUrl = window.location.origin + window.location.pathname;
            history.replaceState(null, null, cleanUrl);
        }
    }).catch(err => {
        console.error('Error during initialization:', err);
    });
});

// Add scroll event listener (safe)
window.addEventListener('scroll', () => {
    try { setActiveNav(); } catch (e) { /* ignore */ }
});
