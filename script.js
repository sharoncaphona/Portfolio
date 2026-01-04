// script.js
// ==========================================================================
// Theme handling
// ==========================================================================
(function themeInit() {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  
  // Get saved theme or system preference
  const savedTheme = localStorage.getItem("theme-preference");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialTheme = savedTheme || (prefersLight ? "light" : "dark");
  
  // Set initial theme
  if (initialTheme === "light") {
    root.setAttribute("data-theme", "light");
    updateThemeToggleIcon("light");
  } else {
    root.removeAttribute("data-theme");
    updateThemeToggleIcon("dark");
  }
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
  
  function toggleTheme() {
    const isLight = root.getAttribute("data-theme") === "light";
    
    if (isLight) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme-preference", "dark");
      updateThemeToggleIcon("dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme-preference", "light");
      updateThemeToggleIcon("light");
    }
    
    // Dispatch custom event for theme change
    const event = new CustomEvent("themeChange", {
      detail: { theme: isLight ? "dark" : "light" }
    });
    document.dispatchEvent(event);
  }
  
  function updateThemeToggleIcon(theme) {
    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
      themeToggle.setAttribute("aria-label", 
        `Switch to ${theme === "light" ? "dark" : "light"} mode`
      );
    }
  }
  
  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme-preference")) {
      if (e.matches) {
        root.removeAttribute("data-theme");
        updateThemeToggleIcon("dark");
      } else {
        root.setAttribute("data-theme", "light");
        updateThemeToggleIcon("light");
      }
    }
  });
})();

// ==========================================================================
// Mobile navigation
// ==========================================================================
(function navInit() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = navMenu ? navMenu.querySelectorAll("a") : [];
  
  if (!navToggle || !navMenu) return;
  
  // Toggle mobile menu
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("is-open");
    document.body.style.overflow = isExpanded ? "" : "hidden";
  });
  
  // Close menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
  
  // Close menu on escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
})();

// ==========================================================================
// Project filter (if you keep the filter functionality)
// ==========================================================================
(function filterInit() {
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectGrid = document.getElementById("projectGrid");
  
  if (!filterButtons.length || !projectGrid) return;
  
  const projectCards = Array.from(projectGrid.querySelectorAll(".card"));
  
  function setActiveFilter(activeButton) {
    filterButtons.forEach(button => {
      const isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }
  
  function filterProjects(filter) {
    projectCards.forEach(card => {
      const tags = (card.getAttribute("data-tags") || "").split(/\s+/);
      const shouldShow = filter === "all" || tags.includes(filter);
      
      // Add animation
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      
      setTimeout(() => {
        card.style.display = shouldShow ? "" : "none";
        card.style.opacity = "";
        card.style.transform = "";
      }, 50);
    });
  }
  
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      setActiveFilter(button);
      filterProjects(filter);
    });
  });
})();

// ==========================================================================
// Animate elements on scroll
// ==========================================================================
(function scrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  document.querySelectorAll(".fact, .approach, .methodology-card, .project-mini").forEach(el => {
    observer.observe(el);
  });
})();

// ==========================================================================
// Smooth scrolling for anchor links
// ==========================================================================
(function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      // Calculate offset for fixed header
      const headerHeight = document.querySelector(".site-header").offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });
})();

// ==========================================================================
// Current year in footer
// ==========================================================================
(function yearInit() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();

// ==========================================================================
// Back to top button
// ==========================================================================
(function backToTopInit() {
  const backToTopButton = document.getElementById("backToTop");
  
  if (!backToTopButton) return;
  
  // Show/hide button based on scroll position
  function toggleBackToTopButton() {
    if (window.scrollY > 500) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  }
  
  // Scroll to top with smooth animation
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    // Focus on main content for accessibility
    document.querySelector("main").setAttribute("tabindex", "-1");
    document.querySelector("main").focus();
  });
  
  // Listen to scroll events
  window.addEventListener("scroll", toggleBackToTopButton, { passive: true });
  
  // Check initial scroll position
  toggleBackToTopButton();
})();

// ==========================================================================
// Form handling (if you add a contact form later)
// ==========================================================================
(function formHandling() {
  const contactForm = document.querySelector("form");
  
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Simple form validation
      const inputs = this.querySelectorAll("input[required], textarea[required]");
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add("error");
          isValid = false;
        } else {
          input.classList.remove("error");
        }
      });
      
      if (isValid) {
        // Here you would typically send the form data to a server
        // For now, just show a success message
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = "Sending...";
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
          submitButton.textContent = "Message Sent!";
          submitButton.style.backgroundColor = "var(--color-success)";
          
          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "";
            contactForm.reset();
          }, 3000);
        }, 1500);
      }
    });
  }
})();

// ==========================================================================
// Page load animations
// ==========================================================================
(function pageLoadAnimations() {
  // Add loaded class to body when page is fully loaded
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    
    // Animate hero elements
    const heroElements = document.querySelectorAll(".hero h1, .hero p, .hero__cta, .hero__meta");
    heroElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
      el.classList.add("fade-in-up");
    });
  });
})();

// ==========================================================================
// Skill chips hover effect enhancement
// ==========================================================================
(function skillChipsEnhancement() {
  const skillChips = document.querySelectorAll(".chip");
  
  skillChips.forEach(chip => {
    chip.addEventListener("mouseenter", () => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim();
      
      // Create a subtle glow effect
      chip.style.boxShadow = `0 4px 12px ${color}40`;
    });
    
    chip.addEventListener("mouseleave", () => {
      chip.style.boxShadow = "";
    });
  });
})();

// ==========================================================================
// Dynamic metric counters (optional enhancement)
// ==========================================================================
(function metricCounters() {
  const metricElements = document.querySelectorAll(".metric-value, .fact-number");
  
  if (!metricElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const value = element.textContent;
        
        // Check if it's a number with + sign
        if (value.match(/^\d+\+?$/)) {
          const target = parseInt(value);
          let current = 0;
          const increment = target / 50; // Adjust speed
          const duration = 1500; // ms
          const step = duration / 50;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              element.textContent = value;
              clearInterval(timer);
            } else {
              element.textContent = Math.floor(current) + (value.includes("+") ? "+" : "");
            }
          }, step);
          
          // Stop observing once animated
          observer.unobserve(element);
        }
      }
    });
  }, { threshold: 0.5 });
  
  metricElements.forEach(el => observer.observe(el));
})();

// ==========================================================================
// Print button (optional)
// ==========================================================================
(function printPortfolio() {
  const printButton = document.getElementById("printPortfolio");
  
  if (printButton) {
    printButton.addEventListener("click", () => {
      window.print();
    });
  }
})();

// ==========================================================================
// Initialize everything when DOM is ready
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("QA Portfolio loaded successfully!");
  
  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
    .fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animated {
      animation: fadeIn 0.6s ease-out forwards;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .loaded .site-header {
      animation: slideDown 0.5s ease-out;
    }
    
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }
    
    input.error, textarea.error {
      border-color: #ef4444 !important;
      animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  
  document.head.appendChild(style);
});