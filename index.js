   // Tutorial data
        const tutorials = [
            {
                title: "Advance Clone in Capcut Tutorial | clone Tutorial in Capcut",
                thumbnail: "img/Advance Clone in Capcut Tutorial  clone Tutorial in Capcut.jpg",
                link: "#",
                duration: "8 min",
                date: "Coming Soon",
            },
            {
                title: "Shrine Null Capcut Tutorial | Null Tutorial in Capcut",
                thumbnail: "img/Shrine Null Capcut Tutorial  Null Tutorial in Capcut.jpg",
                link: "https://youtu.be/QZc67CgrL2M?si=e55jQ1xQpIA3pV2K",
                duration: "5 min",
                date: "12 Sep 2025",
            },
        ];

        // Generate Tutorials Section
        const tutorialsContainer = document.getElementById("tutorials-container");

        let tutorialsHTML = `
  <h2 class="section-title">Latest <span>Tutorials</span></h2>
  <div class="video-container">
`;

        tutorials.forEach(tutorial => {
            tutorialsHTML += `
    <div class="video-card">
      <div class="video-thumb">
        <img src="${tutorial.thumbnail}" alt="${tutorial.title}" loading="lazy">
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

        // Toggle mobile navigation
        function toggleMobileNav() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
        }

        // Event listeners
        hamburger.addEventListener('click', toggleMobileNav);
        overlay.addEventListener('click', toggleMobileNav);

        // Close mobile nav when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', toggleMobileNav);
        });

        // Handle window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 968) {
                // If window is resized to desktop size, close mobile nav
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            }
        });