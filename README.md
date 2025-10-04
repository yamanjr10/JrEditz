🚀 About Jreditz
Jreditz is a comprehensive platform dedicated to teaching anime video editing, manga panel animation, and creative VFX techniques. We provide professional tutorials specifically designed for CapCut mobile editing, along with free downloadable resources to help both beginners and experienced editors bring their creative ideas to life.

🌐 Live Site
🔗 https://jreditz.netlify.app/

✨ Features
🎬 Interactive Tutorials Section
Pagination System: Browse through tutorials with smooth pagination (6 videos per page)

Video Badges: Dynamic badges (New, Popular, Trending, Up Coming, Hot, Out Now) with animations

Responsive Grid: Adaptive layout for mobile, tablet, and desktop

YouTube Integration: Direct links to tutorial videos with play buttons

⏰ Smart Countdown Timer
Auto-schedule Detection: Automatically calculates next upload based on your schedule

Live Updates: Real-time countdown with days, hours, minutes, and seconds

"Watch Now" Mode: Shows current available tutorial for 15 hours after upload

Schedule Transition: Handles schedule changes (pre/post Oct 18, 2025)

📅 Interactive Upload Calendar
Visual Schedule: Color-coded calendar showing uploads, breaks, and uploaded content

Monthly Navigation: Browse through scheduled months

Today Highlighting: Current date is clearly marked

Responsive Design: Works on all screen sizes with smooth scrolling

🎨 Modern UI/UX
Cyberpunk Theme: Neon pink (#ff2a6d) and cyan (#00f5ff) color scheme

Smooth Animations: CSS transitions and keyframe animations

Particle Background: Dynamic floating particles in hero section

Mobile-First: Responsive design with hamburger menu

📱 Mobile Optimization
Touch-Friendly: Large buttons and smooth touch interactions

Hamburger Menu: Slide-out navigation for mobile devices

Performance: Optimized loading and smooth scrolling

🛠 Technology Stack
Frontend
HTML5: Semantic markup with modern structure

CSS3: Custom properties (CSS Variables), Grid, Flexbox, Animations

JavaScript (ES6+): Modern JavaScript with async/await, modules

Libraries & APIs
Font Awesome 6.4.0: Comprehensive icon library

Google Fonts: Montserrat & Oxanium typography

YouTube API: Video embedding and management

Features & Architecture
Responsive Design: Mobile-first approach with breakpoints

CSS Custom Properties: Centralized color scheme and styling

Modular JavaScript: Organized code structure with clear separation of concerns

Performance Optimized: Lazy loading, efficient animations

📁 Project Structure
text
Jreditz/
├── index.html                 # Main HTML file
├── style.css                  # Complete styling with CSS variables
├── index.js                   # Main JavaScript functionality
├── tutorials.json             # Tutorial data and metadata
├── img/                       # Thumbnail images directory
│   ├── Manga Edit [ MADARA X AIZEN ] Tutorial Manga Edit Tutorial.jpg
│   ├── How To Make Null in Capcut Tutorial Null Tutorial in Capcut.jpg
│   └── ... (other thumbnails)
└── README.md                  # Project documentation
🎯 Key Sections
1. Hero Section
Animated particle background

Call-to-action buttons with hover effects

Responsive typography

2. Countdown Timer
Smart schedule calculation

Live countdown updates

Upcoming tutorial preview

3. Tutorials Grid
Paginated video gallery

Animated badges and hover effects

YouTube video integration

4. Resources Section
Downloadable manga panels and materials

Google Drive integration

Animated card layouts

5. Interactive Modals
Schedule calendar modal

About information modal

Smooth open/close animations

6. Footer
Social media links

Quick navigation

Copyright information

🚀 Getting Started
For Users:
Visit https://jreditz.netlify.app/

Browse tutorials in the Tutorials section

Download free resources from the Resources section

Check the Schedule for upcoming uploads

Follow along with video tutorials using provided assets

For Developers:
bash
# Clone the repository
git clone [your-repo-url]

# Open in browser
open index.html

# Customize styles in style.css
# Modify functionality in index.js
# Update tutorial data in tutorials.json
⚙️ Configuration
Adding New Tutorials:
Update tutorials.json with new tutorial objects:

json
{
  "title": "Tutorial Title",
  "thumbnail": "img/filename.jpg",
  "link": "YouTube URL",
  "duration": "X min",
  "date": "DD MMM YYYY",
  "badge": "badge-type"
}
Customizing Styles:
Modify CSS custom properties in :root:

css
:root {
  --primary: #ff2a6d;    /* Main pink color */
  --secondary: #00f5ff;  /* Cyan accent */
  --dark: #0a0a0f;       /* Dark background */
  --light: #ffffff;      /* Text color */
  --gray: #1a1a2a;       /* Card backgrounds */
}
📅 Content Schedule
The website automatically handles two schedule phases:

Phase 1 (Before Oct 18, 2025)
Custom upload schedule with specific dates

Mixed upload/break pattern

Phase 2 (After Oct 18, 2025)
Regular Mon/Wed/Fri upload schedule

10:30 AM upload time

Automatic schedule detection

🔧 Browser Support
✅ Chrome 60+

✅ Firefox 55+

✅ Safari 12+

✅ Edge 79+

✅ Mobile browsers (iOS Safari, Chrome Mobile)

📞 Connect & Follow
🌐 Website: jreditz.netlify.app

📺 YouTube: @jreditz100

💬 Discord: Join Community

📷 Instagram: @yamanjr10

👥 Facebook: yamanjr10

📜 License & Usage
Code License
This project is licensed under the MIT License - see the LICENSE file for details.

Content Usage
Tutorials: Free to watch and learn from

Resources: Free for personal and non-commercial projects

Attribution: Credit appreciated but not required

Commercial Use: Contact for commercial usage permissions

🤝 Contributing
We welcome contributions! Here's how you can help:

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines:
Follow existing code style and structure

Test on multiple devices and browsers

Ensure responsive design works correctly

Update documentation as needed

🐛 Bug Reports & Feature Requests
Found a bug or have a feature idea? Open an issue with:

Detailed description

Steps to reproduce (for bugs)

Expected vs actual behavior

Screenshots if applicable