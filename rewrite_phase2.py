import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Insert Campus Section after Hero
campus_section = '''
  <!-- =============================================
       INTERACTIVE CAMPUS MAP
  ============================================= -->
  <section class="campus-section section" id="campus" aria-label="Interactive Campus Map">
    <div class="container">
      <div class="section-header reveal-up">
        <span class="section-tag">Explore Our Campus</span>
        <h2 class="section-title">An Interactive Journey</h2>
        <p class="section-subtitle">Discover every place where learning, creativity and memories come together.</p>
        
        <div class="campus-controls">
          <button id="tour-btn" class="btn btn-outline"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg> START CAMPUS TOUR</button>
          <div class="day-night-toggle">
            <span class="dn-label">Theme:</span>
            <button id="theme-day" class="dn-btn active">☀️ DAY</button>
            <button id="theme-night" class="dn-btn">🌙 NIGHT</button>
          </div>
        </div>
      </div>

      <div class="campus-map-container reveal-up" id="campus-map">
        <!-- Background map grid -->
        <div class="map-bg"></div>

        <!-- Interactive Pins -->
        <div class="map-pin" data-target="modal-main" style="top: 20%; left: 50%;">
          <div class="pin-marker">🏫</div>
          <span class="pin-label">Main Building</span>
        </div>
        <div class="map-pin" data-target="modal-library" style="top: 40%; left: 30%;">
          <div class="pin-marker">📚</div>
          <span class="pin-label">Library</span>
        </div>
        <div class="map-pin" data-target="modal-science" style="top: 35%; left: 70%;">
          <div class="pin-marker">🔬</div>
          <span class="pin-label">Science Lab</span>
        </div>
        <div class="map-pin" data-target="modal-computer" style="top: 60%; left: 25%;">
          <div class="pin-marker">💻</div>
          <span class="pin-label">Computer Lab</span>
        </div>
        <div class="map-pin" data-target="modal-play" style="top: 65%; left: 75%;">
          <div class="pin-marker">🏏</div>
          <span class="pin-label">Playground</span>
        </div>
        <div class="map-pin" data-target="modal-garden" style="top: 80%; left: 45%;">
          <div class="pin-marker">🌳</div>
          <span class="pin-label">Garden</span>
        </div>
        
        <!-- Map Overlay Modals -->
        <div class="map-modal" id="modal-main">
          <button class="close-modal">&times;</button>
          <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=70" alt="Main Building">
          <div class="modal-content">
            <h3>Main Building</h3>
            <p>The heart of our academic excellence. Features spacious classrooms and administrative offices.</p>
          </div>
        </div>
        
        <div class="map-modal" id="modal-library">
          <button class="close-modal">&times;</button>
          <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=70" alt="Library">
          <div class="modal-content">
            <h3>Library</h3>
            <p>A quiet space where students discover books, knowledge and new ideas.</p>
          </div>
        </div>

        <div class="map-modal" id="modal-science">
          <button class="close-modal">&times;</button>
          <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=70" alt="Science Lab">
          <div class="modal-content">
            <h3>Science Lab</h3>
            <p>State-of-the-art facilities for physics, chemistry, and biology experiments.</p>
          </div>
        </div>

        <div class="map-modal" id="modal-computer">
          <button class="close-modal">&times;</button>
          <img src="https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&q=70" alt="Computer Lab">
          <div class="modal-content">
            <h3>Computer Lab</h3>
            <p>Modern tech center equipped with the latest systems and high-speed internet.</p>
          </div>
        </div>

        <div class="map-modal" id="modal-play">
          <button class="close-modal">&times;</button>
          <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=70" alt="Playground">
          <div class="modal-content">
            <h3>Playground</h3>
            <p>Sprawling grounds for cricket, football, and physical education.</p>
          </div>
        </div>

        <div class="map-modal" id="modal-garden">
          <button class="close-modal">&times;</button>
          <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=70" alt="Garden">
          <div class="modal-content">
            <h3>Garden</h3>
            <p>A serene botanical space for relaxation and eco-learning.</p>
          </div>
        </div>

      </div>
    </div>
  </section>
'''

# Insert it before the stats section
html = re.sub(r'(<section class="stats")', campus_section + r'\n  \1', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Inserted Campus Map section.")
