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
        // Initialize or refresh UI wherever safe
        if (typeof displayTutorials === 'function') displayTutorials(currentPage);
        if (typeof initCountdownTimer === 'function') initCountdownTimer(); // will guard inside
        updateUpcomingTutorial();
    }
}

// Generate Tutorials Section with pagination
function displayTutorials(page = 1) {
    if (!tutorialsContainer) {
        console.warn('No tutorials container found in DOM.');
        return;
    }

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

    const startIndex = (page - 1) * tutorialsPerPage;
    const endIndex = startIndex + tutorialsPerPage;
    const paginatedTutorials = tutorials.slice(startIndex, endIndex);
    
    let tutorialsHTML = `
        <h2 class="section-title">Latest <span>Tutorials</span></h2>
        <div class="video-container">
    `;

    paginatedTutorials.forEach(tutorial => {
        const safeTitle = tutorial.title || 'Untitled';
        const safeThumb = tutorial.thumbnail || '';
        const safeLink = tutorial.link || '#';
        const badgeClass = tutorial.badge ? tutorial.badge.replace(/\s+/g, '-') : '';
        const badgeHTML = tutorial.badge ? `<div class="video-badge ${badgeClass}">${tutorial.badge}</div>` : '';

        tutorialsHTML += `
        <div class="video-card">
            <div class="video-thumb">
                ${safeThumb ? `<img src="${safeThumb}" alt="${safeTitle}" loading="lazy">` : `<div class="no-thumb">No image</div>`}
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

    // Update pagination buttons
    updatePagination();
}

function updatePagination() {
    if (!paginationContainer) return;

    const totalPages = Math.max(1, Math.ceil((tutorials.length || 0) / tutorialsPerPage));
    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    // Page numbers (limit to reasonable number)
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }

    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;

    // Use event delegation so we don't attach many handlers
    paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPage = parseInt(btn.getAttribute('data-page'), 10);
            if (!isNaN(targetPage)) changePage(targetPage);
        });
    });
}

function changePage(page) {
    const totalPages = Math.max(1, Math.ceil((tutorials.length || 0) / tutorialsPerPage));
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displayTutorials(currentPage);
    // Scroll to tutorials section if it exists
    const tutorialsSection = document.getElementById('tutorials');
    if (tutorialsSection) tutorialsSection.scrollIntoView({ behavior: 'smooth' });
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
    upcomingTutorialElement.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 10px 40px rgba(255, 42, 109, 0.3)';
    });
    upcomingTutorialElement.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(255, 42, 109, 0.1)';
    });
}

// Auto Countdown Timer that matches the calendar schedule exactly
function initCountdownTimer() {
    // Lazy guard if countdown container is missing
    countdownContainer = document.getElementById('countdownContainer');
    if (!countdownContainer) {
        console.warn('No countdownContainer in DOM — skipping countdown initialization.');
        return;
    }

    const scheduleChangeDate = new Date(2025, 9, 18); // Oct 18, 2025 (switch to Mon/Wed/Fri after this date)
    
    function getNextUploadDate() {
        const today = new Date();
        const isNewSchedule = today >= scheduleChangeDate;
        return isNewSchedule ? getNextUploadDateNewSchedule() : getNextUploadDateOldSchedule();
    }

    function getNextUploadDateNewSchedule() {
        const today = new Date();
        const uploadDays = [1, 3, 5]; // Mon, Wed, Fri
        const uploadHour = 10, uploadMinute = 30;

        const lastUpload = getLastUploadFromTutorials();
        if (lastUpload && lastUpload.uploadTime) {
            const fifteenHoursAfterUpload = new Date(lastUpload.uploadTime.getTime() + (15 * 60 * 60 * 1000));
            if (today < fifteenHoursAfterUpload) return fifteenHoursAfterUpload;
        }

        // find next day matching uploadDays and set time
        for (let i = 0; i <= 14; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);
            if (uploadDays.includes(nextDate.getDay())) {
                nextDate.setHours(uploadHour, uploadMinute, 0, 0);
                if (nextDate > today) return nextDate;
            }
        }
        // fallback tomorrow at 10:30
        const fallback = new Date(today);
        fallback.setDate(today.getDate() + 1);
        fallback.setHours(uploadHour, uploadMinute, 0, 0);
        return fallback;
    }

    function getNextUploadDateOldSchedule() {
        const today = new Date();
        const lastUpload = getLastUploadFromTutorials();
        if (lastUpload && lastUpload.uploadTime) {
            const fifteenHoursAfterUpload = new Date(lastUpload.uploadTime.getTime() + (15 * 60 * 60 * 1000));
            if (today < fifteenHoursAfterUpload) return fifteenHoursAfterUpload;
        }

        const uploadSchedule = [
            // September 2025
            new Date(2025, 8, 12), new Date(2025, 8, 13), new Date(2025, 8, 15),
            new Date(2025, 8, 16), new Date(2025, 8, 18), new Date(2025, 8, 19),
            new Date(2025, 8, 27), new Date(2025, 8, 28), new Date(2025, 8, 30),
            // October 2025
            new Date(2025, 9, 1), new Date(2025, 9, 3), new Date(2025, 9, 4),
            new Date(2025, 9, 6), new Date(2025, 9, 7), new Date(2025, 9, 9),
            new Date(2025, 9, 10), new Date(2025, 9, 12), new Date(2025, 9, 13),
            new Date(2025, 9, 15), new Date(2025, 9, 16), new Date(2025, 9, 18)
        ];

        for (let d of uploadSchedule) {
            const uploadDateTime = new Date(d);
            uploadDateTime.setHours(10, 30, 0, 0);
            if (uploadDateTime > today) return uploadDateTime;
        }
        // fallback to new schedule if none left
        return getNextUploadDateNewSchedule();
    }

    function getLastUploadFromTutorials() {
        const now = new Date();
        if (!Array.isArray(tutorials) || tutorials.length === 0) return null;

        const uploadedTutorials = tutorials.filter(t => t.link && t.link.trim() !== '' && t.date && t.date !== 'Coming soon');

        let latestTutorial = null;
        let latestDate = null;

        for (let t of uploadedTutorials) {
            const d = parseUploadDate(t.date);
            if (d && d <= now) {
                if (!latestDate || d > latestDate) {
                    latestDate = d;
                    latestTutorial = t;
                }
            }
        }

        if (latestTutorial && latestDate) {
            const uploadTime = new Date(latestDate);
            uploadTime.setHours(10, 30, 0, 0);
            return { tutorial: latestTutorial, uploadTime };
        }
        return null;
    }

    function parseUploadDate(dateString) {
        if (!dateString || dateString === 'Coming soon') return null;
        try {
            const parts = dateString.trim().split(' ');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = getMonthNumber(parts[1]);
                const year = parseInt(parts[2], 10);
                if (!isNaN(day) && month !== -1 && !isNaN(year)) return new Date(year, month, day);
            }
        } catch (e) {
            console.error('Error parsing date:', dateString, e);
        }
        return null;
    }

    function getMonthNumber(monthStr) {
        if (!monthStr) return -1;
        const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
        const key = monthStr.toLowerCase().substring(0,3);
        return months.indexOf(key);
    }

    function getWatchNowTutorial() {
        const now = new Date();
        const lastUpload = getLastUploadFromTutorials();
        if (!lastUpload) return null;
        const fifteenHoursAfterUpload = new Date(lastUpload.uploadTime.getTime() + (15 * 60 * 60 * 1000));
        return now < fifteenHoursAfterUpload ? lastUpload.tutorial : null;
    }

    function getNextUploadDatesPreview() {
        const today = new Date();
        const isNewSchedule = today >= scheduleChangeDate;
        const nextDates = [];
        if (isNewSchedule) {
            const uploadDays = [1,3,5];
            for (let i=0; nextDates.length < 3 && i < 21; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                if (uploadDays.includes(d.getDay())) {
                    d.setHours(10,30,0,0);
                    if (d > today) nextDates.push(d);
                }
            }
        } else {
            // use the same schedule array as above
            const schedule = [
                new Date(2025,8,12), new Date(2025,8,13), new Date(2025,8,15),
                new Date(2025,8,16), new Date(2025,8,18), new Date(2025,8,19),
                new Date(2025,8,27), new Date(2025,8,28), new Date(2025,8,30),
                new Date(2025,9,1), new Date(2025,9,3), new Date(2025,9,4),
                new Date(2025,9,6), new Date(2025,9,7), new Date(2025,9,9),
                new Date(2025,9,10), new Date(2025,9,12), new Date(2025,9,13),
                new Date(2025,9,15), new Date(2025,9,16), new Date(2025,9,18)
            ];
            for (let d of schedule) {
                const dt = new Date(d);
                dt.setHours(10,30,0,0);
                if (dt > today && nextDates.length < 3) nextDates.push(dt);
            }
            if (nextDates.length < 3 && today >= new Date(2025,9,15)) {
                nextDates.push(...getNewScheduleDates().slice(0, 3 - nextDates.length));
            }
        }
        return nextDates;
    }

    function getNewScheduleDates() {
        const today = new Date();
        const uploadDays = [1,3,5];
        const dates = [];
        for (let i=0; dates.length < 3 && i < 21; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            if (uploadDays.includes(d.getDay())) {
                d.setHours(10,30,0,0);
                if (d > today) dates.push(d);
            }
        }
        return dates;
    }

    function updateCountdown() {
        const nextUploadDate = getNextUploadDate();
        const now = new Date();
        if (!nextUploadDate || isNaN(nextUploadDate.getTime())) {
            countdownContainer.innerHTML = `<p>No upcoming uploads scheduled.</p>`;
            return;
        }

        const distance = nextUploadDate.getTime() - now.getTime();
        const watchNowTutorial = getWatchNowTutorial();

        if (watchNowTutorial && watchNowTutorial.link) {
            const lastUpload = getLastUploadFromTutorials();
            const fifteenHoursAfterUpload = lastUpload ? new Date(lastUpload.uploadTime.getTime() + (15 * 60 * 60 * 1000)) : null;
            let timeUntilCountdown = fifteenHoursAfterUpload ? (fifteenHoursAfterUpload.getTime() - now.getTime()) : 0;
            if (timeUntilCountdown < 0) timeUntilCountdown = 0;
            const hoursLeft = Math.floor(timeUntilCountdown / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeUntilCountdown % (1000 * 60 * 60)) / (1000 * 60));

            countdownContainer.innerHTML = `
                <h3 class="countdown-title">🎉 New Tutorial Available Now!</h3>
                <a href="${watchNowTutorial.link}" class="btn btn-primary" style="margin-top: 20px;">
                    <i class="fas fa-play"></i> Watch Now
                </a>
                <div style="margin-top: 10px; font-size: 0.8rem; color: var(--secondary);">
                    Next countdown starts in: ${hoursLeft}h ${minutesLeft}m
                </div>
            `;
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const nextUploadFormatted = nextUploadDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const nextDates = getNextUploadDatesPreview();
            let schedulePreview = '';
            if (nextDates.length > 1) {
                const previewDates = nextDates.slice(1, 3).map(date =>
                    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                ).join(' & ');
                schedulePreview = `<br><small>Next: ${previewDates}</small>`;
            }

            const upcomingTutorialTitle = Array.isArray(tutorials) && tutorials.length > 0 ? tutorials[0].title : 'TBA';

            countdownContainer.innerHTML = `
                <h3 class="countdown-title">Next Tutorial In:</h3>
                <div class="countdown-timer">
                    <div class="countdown-item">
                        <div class="countdown-number" id="days">${String(days).padStart(2,'0')}</div>
                        <div class="countdown-label">Days</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="hours">${String(hours).padStart(2,'0')}</div>
                        <div class="countdown-label">Hrs</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="minutes">${String(minutes).padStart(2,'0')}</div>
                        <div class="countdown-label">Mins</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="seconds">${String(seconds).padStart(2,'0')}</div>
                        <div class="countdown-label">Secs</div>
                    </div>
                </div>
                <div class="upcoming-tutorial">
                    ${upcomingTutorialTitle}
                </div>
            `;

            // Add click + hover if link exists
            const newUpcomingElement = countdownContainer.querySelector('.upcoming-tutorial');
            if (newUpcomingElement && Array.isArray(tutorials) && tutorials.length > 0 && tutorials[0].link) {
                newUpcomingElement.style.cursor = 'pointer';
                newUpcomingElement.onclick = () => window.open(tutorials[0].link, '_blank');
                newUpcomingElement.style.transition = 'all 0.3s ease';
                newUpcomingElement.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.02)';
                    this.style.boxShadow = '0 10px 40px rgba(255, 42, 109, 0.3)';
                });
                newUpcomingElement.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = '0 10px 30px rgba(255, 42, 109, 0.1)';
                });
            }
        }
    }

    // initial + interval
    updateCountdown();
    // clear any existing interval? We'll attach a single interval via closure
    if (initCountdownTimer._intervalId) clearInterval(initCountdownTimer._intervalId);
    initCountdownTimer._intervalId = setInterval(updateCountdown, 1000);
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
    const validMonths = [8,9,11]; // Sept, Oct, Dec
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
document.addEventListener('DOMContentLoaded', function() {
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
