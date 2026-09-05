import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Navbar links
nav_links_pattern = r'<nav class="nav-links" id="navLinks".*?</nav>'
new_nav_links = '''<nav class="nav-links" id="navLinks" role="navigation" aria-label="Main navigation">
        <a href="#home" class="nav-link active">HOME</a>
        <a href="#about" class="nav-link">ABOUT</a>
        <a href="#academics" class="nav-link">ACADEMICS</a>
        <a href="#campus" class="nav-link">CAMPUS</a>
        <a href="#achievements" class="nav-link">ACHIEVEMENTS</a>
        <a href="#student-life" class="nav-link">STUDENT LIFE</a>
        <a href="#gallery" class="nav-link">GALLERY</a>
        <a href="#contact" class="nav-link">CONTACT</a>
      </nav>'''
html = re.sub(nav_links_pattern, new_nav_links, html, flags=re.DOTALL)

# 2. Rebuild Hero Section
hero_pattern = r'<section class="hero" id="home" aria-label="Hero section">.*?</section>'
new_hero = '''<section class="cinematic-hero" id="home" aria-label="Hero section">
    <div class="hero-parallax-bg" style="background-image: url('assets/images/hero.jpg.jpg');"></div>
    <div class="hero-overlay"></div>
    <div class="golden-particles" id="particles-js"></div>
    
    <div class="hero-content-center">
      <h1 class="hero-main-title reveal-up">Govt. Hr. Sec. School, Alagankulam</h1>
      <p class="hero-sub-title reveal-up" style="animation-delay: 0.2s;">Knowledge &bull; Discipline &bull; Excellence</p>
      
      <a href="#campus" class="btn btn-gold reveal-up" style="animation-delay: 0.4s;">EXPLORE OUR CAMPUS</a>
    </div>

    <div class="scroll-indicator">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <p>Scroll to Explore</p>
    </div>
  </section>'''
html = re.sub(hero_pattern, new_hero, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated Navbar and Hero section.")
