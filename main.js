/* ============================================
   PREMIUM FRIENDSHIP WEBSITE - MAIN.JS
   Ultra-luxury, cinematic, mobile-first
   ============================================ */

// ============================================
// CONFIGURATION - Edit these values only
// ============================================
const CONFIG = {
    // Personal Info
    my_name: "Göktürk",
    friend_name: "Arda",
    friendship_years: "10",
    music_track_title: "Mutluluk Şırıngası",
    music_artist: "Sanjar",
    optional_short_note: "Aynı yoldan yürüdük.",

    // Passcode (disabled by default)
    passcode_enabled: false,
    passcode_value: "1234",

    // Hero background override (leave empty to use first photo)
    hero_background_override: "",

    // Fallback assets if manifest.json fails
    fallbackAssets: {
        photos: [
            "images/WhatsApp Image 2025-12-24 at 01.52.22.jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.23.jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.23 (1).jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.24.jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.24 (1).jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.24 (2).jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.25.jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.25 (1).jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.26.jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.26 (1).jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.27.jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.27 (1).jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.28.jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.28 (1).jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.28 (2).jpeg",
            "images/WhatsApp Image 2025-12-24 at 01.52.29.jpeg"
        ],
        video: "images/Arkadaşlık_Anıları_İçin_AI_Video_Oluşturma.mp4",
        audio: "images/mp3indirdur-Sanjar-Mutluluk-Siringasi-2.mp3"
    },

    // Highlight cards content
    // Highlight cards content
    highlights: [
        { icon: "smile-plus", title: "İlk Büyük Gülüş", desc: "Birbirimizi ilk kez güldürdüğümüz o an", story: "O gün, sıradan bir gündü aslında. Ama senin o beklenmedik esprin her şeyi değiştirdi. O günden beri, gülmek seninle çok daha kolay oldu. İşte o an, gerçek bir dostluğun başlangıcıydı." },
        { icon: "shield", title: "Krizi Beraber Atlattık", desc: "En zor günde yan yana", story: "Hayat bazen sert vurur. Ama o darbeleri tek başına almak zorunda olmadığımı seninle öğrendim. O zor günde yanımda olduğun için, kardeşim, asla unutmayacağım." },
        { icon: "eye", title: "Sessiz Anlaşma", desc: "Konuşmadan anlaştığımız o bakış", story: "Bazen kelimeler gereksiz oluyor. Bir bakış, bir gülümseme yetiyor. Seninle bu sessiz anlaşmayı yakalamak, hayatımın en değerli hazinelerinden biri." },
        { icon: "footprints", title: "Yoldaşlık", desc: "Aynı yolda yürüyen iki dost", story: "Farklı hayallerimiz, farklı hedeflerimiz olabilir. Ama yolumuz her zaman kesişiyor. Çünkü biz birbirimizi kaybetmeyecek kadar akıllıyız." },
        { icon: "music-2", title: "48 Kez Aynı Şarkı", desc: "Mutluluk Şırıngası maratonu", story: "O gece, aynı şarkıyı 48 kez dinledik. Deli miydik? Belki. Ama o an, dünya sadece bizim ve o melodinin etrafında dönüyordu. İşte gerçek mutluluk buydu." },
        { icon: "star", title: "Sonsuza Kadar", desc: "Bu dostluk ömürlük", story: "Yıllar geçti, değiştik, büyüdük. Ama aramızdaki bağ hiç değişmedi. Aksine, her geçen yıl daha da güçlendi. Bu dostluk sonsuza kadar, kardeşim." }
    ]
};

// ============================================
// App State
// ============================================
let assets = { photos: [], video: null, audio: null };
let bgMusic = null;
let mainVideo = null;
let originalMusicVolume = 0.5;

// ============================================
// DOM Elements
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================
// Asset Loading
// ============================================
async function loadManifest() {
    try {
        const resp = await fetch('manifest.json');
        if (!resp.ok) throw new Error('Manifest not found');
        const data = await resp.json();
        assets.photos = data.photos || [];
        assets.video = data.video || null;
        assets.audio = data.audio || null;
    } catch (e) {
        console.warn('Using fallback assets:', e.message);
        assets = { ...CONFIG.fallbackAssets };
    }
    // Filter out any failed assets
    assets.photos = await validateAssets(assets.photos);
}

async function validateAssets(photos) {
    const validated = [];
    for (const src of photos) {
        try {
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
            validated.push(src);
        } catch { console.warn('Asset failed:', src); }
    }
    return validated;
}

// ============================================
// Preloader
// ============================================
function initPreloader() {
    const progress = $('.preloader-progress');
    let pct = 0;
    const interval = setInterval(() => {
        pct += Math.random() * 15 + 5;
        if (pct >= 100) {
            pct = 100;
            clearInterval(interval);
            setTimeout(showGate, 400);
        }
        progress.style.width = pct + '%';
    }, 150);
}

function showGate() {
    $('#preloader').classList.add('hidden');
    const gate = $('#gate');
    const gateBg = $('.gate-bg');
    // Set gate background
    if (assets.photos.length > 0) {
        gateBg.style.backgroundImage = `url('${assets.photos[0]}')`;
    }
    gate.classList.add('visible');
    gate.setAttribute('aria-hidden', 'false');
}

// ============================================
// Gate
// ============================================
function initGate() {
    const gateBtn = $('#gate-btn');
    gateBtn.addEventListener('click', () => {
        const gate = $('#gate');
        gate.classList.remove('visible');
        gate.classList.add('hidden');
        setTimeout(() => {
            showMainContent();
        }, 600);
    });
}

function showMainContent() {
    const main = $('#main-content');
    main.classList.add('visible');
    main.setAttribute('aria-hidden', 'false');
    initHero();
    initStory();
    initHighlights();
    initVideo();
    initMusicPlayer();
    initScrollAnimations();
    $('#music-player').classList.add('visible');
}

// ============================================
// Hero
// ============================================
function initHero() {
    const heroBg = $('.hero-bg');
    const heroSrc = CONFIG.hero_background_override || (assets.photos.length > 0 ? assets.photos[0] : '');
    if (heroSrc) {
        heroBg.style.backgroundImage = `url('${heroSrc}')`;
    }
    // Scroll button
    const scrollBtn = $('.scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const target = $('#story');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// ============================================
// Story Section
// ============================================
function initStory() {
    const act1 = $('#act1-photos');
    const act2 = $('#act2-photos');
    const act3 = $('#act3-photos');
    // Distribute photos across acts
    const third = Math.ceil(assets.photos.length / 3);
    const act1Photos = assets.photos.slice(0, third);
    const act2Photos = assets.photos.slice(third, third * 2);
    const act3Photos = assets.photos.slice(third * 2);
    renderPhotoGrid(act1, act1Photos);
    renderPhotoGrid(act2, act2Photos);
    renderPhotoGrid(act3, act3Photos);
}

function renderPhotoGrid(container, photos) {
    if (!container) return;
    container.innerHTML = photos.map((src, i) => `
        <div class="photo-card" tabindex="0" role="button" aria-label="Fotoğrafı büyüt" data-src="${src}">
            <img src="${src}" alt="Anı fotoğrafı ${i + 1}" loading="lazy">
            <div class="photo-card-overlay"></div>
        </div>
    `).join('');
    // Add click listeners
    container.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('click', () => openPhotoModal(card.dataset.src));
        card.addEventListener('keydown', e => { if (e.key === 'Enter') openPhotoModal(card.dataset.src); });
    });
}

// ============================================
// Photo Modal
// ============================================
function openPhotoModal(src) {
    const modal = $('#photo-modal');
    const img = $('#modal-image');
    img.src = src;
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    trapFocus(modal);
    document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
    const modal = $('#photo-modal');
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// ============================================
// Highlights Section
// ============================================
function initHighlights() {
    const grid = $('#highlights-grid');
    if (!grid) return;
    grid.innerHTML = CONFIG.highlights.map((h, i) => `
        <div class="highlight-card" tabindex="0" role="button" aria-label="${h.title}" data-index="${i}">
            <div class="highlight-icon">
                <i data-lucide="${h.icon}" width="32" height="32"></i>
            </div>
            <h3 class="highlight-title">${h.title}</h3>
            <p class="highlight-desc">${h.desc}</p>
        </div>
    `).join('');

    // Initialize icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    grid.querySelectorAll('.highlight-card').forEach(card => {
        card.addEventListener('click', () => openHighlightModal(parseInt(card.dataset.index)));
        card.addEventListener('keydown', e => { if (e.key === 'Enter') openHighlightModal(parseInt(card.dataset.index)); });
    });
}

function openHighlightModal(index) {
    const h = CONFIG.highlights[index];
    const modal = $('#highlight-modal');
    const img = $('#highlight-modal-image');
    const title = $('#highlight-modal-title');
    const story = $('#highlight-modal-story');
    // Pick a photo for this highlight
    const photoIndex = index % assets.photos.length;
    img.src = assets.photos[photoIndex] || '';
    img.alt = h.title;
    title.textContent = h.title;
    story.textContent = h.story;
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    trapFocus(modal);
    document.body.style.overflow = 'hidden';
}

function closeHighlightModal() {
    const modal = $('#highlight-modal');
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// ============================================
// Video Section
// ============================================
function initVideo() {
    mainVideo = $('#main-video');
    const source = mainVideo.querySelector('source');
    if (assets.video) {
        source.src = assets.video;
        mainVideo.load();
        // Set poster from photos
        if (assets.photos.length > 2) {
            mainVideo.poster = assets.photos[2];
        }
    }
    const overlay = $('#video-overlay');
    const playBtn = $('#video-play-btn');
    const controls = $('#video-controls');
    const playPauseBtn = $('#vid-play-pause');
    const progressInput = $('#vid-progress');
    const progressFill = $('#progress-fill');
    const muteBtn = $('#vid-mute');

    playBtn.addEventListener('click', () => {
        mainVideo.play();
        overlay.classList.add('hidden');
        controls.classList.add('visible');
        playPauseBtn.classList.add('playing');
        duckMusic();
    });

    playPauseBtn.addEventListener('click', () => {
        if (mainVideo.paused) {
            mainVideo.play();
            playPauseBtn.classList.add('playing');
            duckMusic();
        } else {
            mainVideo.pause();
            playPauseBtn.classList.remove('playing');
            restoreMusic();
        }
    });

    mainVideo.addEventListener('timeupdate', () => {
        const pct = (mainVideo.currentTime / mainVideo.duration) * 100 || 0;
        progressInput.value = pct;
        progressFill.style.width = pct + '%';
    });

    mainVideo.addEventListener('ended', () => {
        playPauseBtn.classList.remove('playing');
        overlay.classList.remove('hidden');
        controls.classList.remove('visible');
        restoreMusic();
    });

    progressInput.addEventListener('input', () => {
        const time = (progressInput.value / 100) * mainVideo.duration;
        mainVideo.currentTime = time;
    });

    muteBtn.addEventListener('click', () => {
        mainVideo.muted = !mainVideo.muted;
        muteBtn.classList.toggle('muted', mainVideo.muted);
    });
}

function duckMusic() {
    if (bgMusic && !bgMusic.paused) {
        originalMusicVolume = bgMusic.volume;
        bgMusic.volume = Math.max(0, originalMusicVolume * 0.2);
    }
}

function restoreMusic() {
    if (bgMusic) {
        bgMusic.volume = originalMusicVolume;
    }
}

// ============================================
// Music Player
// ============================================
function initMusicPlayer() {
    bgMusic = $('#bg-music');
    const player = $('#music-player');

    // Inject enhanced structure if not present (removing old volume input)
    if (!player.querySelector('.music-visualizer')) {
        // Clear current content except what we want or just rebuild it to be safe (safest for the new design)
        player.innerHTML = `
            <button class="music-toggle" id="music-toggle" aria-label="Müziği aç/kapat">
                <svg class="music-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <svg class="music-pause" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
            </button>
            <div class="music-info">
                <span class="music-title">${CONFIG.music_track_title}</span>
                <span class="music-artist">${CONFIG.music_artist}</span>
            </div>
            <div class="music-visualizer">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
        `;
    }

    // Re-select elements after injection
    const newToggle = $('#music-toggle');
    const newTitleEl = $('.music-title');
    const newArtistEl = $('.music-artist');

    if (assets.audio) {
        bgMusic.src = assets.audio;
    }

    // Default volume (no slider in new design, maybe set fixed perfect volume)
    bgMusic.volume = 0.4;
    originalMusicVolume = bgMusic.volume;

    newToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(() => { });
            newToggle.classList.add('playing');
        } else {
            bgMusic.pause();
            newToggle.classList.remove('playing');
        }
    });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const acts = $$('.act');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    acts.forEach(act => observer.observe(act));
}

// ============================================
// Modals - Focus Trap & Close
// ============================================
function trapFocus(modal) {
    const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) focusable[0].focus();
}

function initModals() {
    // Photo modal
    $('#modal-close').addEventListener('click', closePhotoModal);
    $('#photo-modal').addEventListener('click', (e) => {
        if (e.target === $('#photo-modal')) closePhotoModal();
    });
    // Highlight modal
    $('#highlight-modal-close').addEventListener('click', closeHighlightModal);
    $('#highlight-modal').addEventListener('click', (e) => {
        if (e.target === $('#highlight-modal')) closeHighlightModal();
    });
    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePhotoModal();
            closeHighlightModal();
        }
    });
}

// ============================================
// Share / Copy
// ============================================
function initShare() {
    const copyBtn = $('#copy-share');
    const shareText = $('#share-text');
    shareText.textContent = `${CONFIG.my_name} & ${CONFIG.friend_name} - ${CONFIG.friendship_years} yıllık kardeşlik hikayesi 🤝`;
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shareText.textContent);
            copyBtn.querySelector('span').textContent = 'Kopyalandı!';
            setTimeout(() => {
                copyBtn.querySelector('span').textContent = 'Kopyala';
            }, 2000);
        } catch { console.warn('Clipboard access denied'); }
    });
}

// ============================================
// Parallax (lightweight)
// ============================================
function initParallax() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroBg = $('.hero-bg');
                if (heroBg) {
                    heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.2}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// FLOATING PARTICLES
// ============================================
function initParticles() {
    const container = $('#particles');
    if (!container) return;

    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 20 + 15;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDelay = delay + 's';
    particle.style.animationDuration = duration + 's';

    container.appendChild(particle);
}

// ============================================
// STARS FOR STARRY SKY SECTION
// ============================================
function initStars() {
    const canvas = $('#starry-canvas');
    if (!canvas) return;

    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const size = Math.random() * 3 + 1;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 2;

        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.top = top + '%';
        star.style.left = left + '%';
        star.style.animationDelay = delay + 's';
        star.style.animationDuration = duration + 's';

        canvas.appendChild(star);
    }
}

// ============================================
// CONFETTI EXPLOSION
// ============================================
function initConfetti() {
    const btn = $('#confetti-btn');
    const canvas = $('#confetti-canvas');
    if (!btn || !canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animating = false;

    function resizeCanvas() {
        const section = $('#celebration');
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createConfettiParticle() {
        const colors = ['#c9a962', '#f0d878', '#ff6b6b', '#4ecdc4', '#9b59b6', '#3498db', '#e74c3c', '#2ecc71'];
        return {
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.3,
            life: 1
        };
    }

    function explode() {
        particles = [];
        for (let i = 0; i < 150; i++) {
            particles.push(createConfettiParticle());
        }
        if (!animating) {
            animating = true;
            animate();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.life > 0);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotationSpeed;
            p.life -= 0.01;
            p.vx *= 0.99;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
            ctx.restore();
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            animating = false;
        }
    }

    btn.addEventListener('click', () => {
        explode();
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function initStatsCounter() {
    const statCards = $$('.stat-card');
    if (statCards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const counter = card.querySelector('.counter');
                const value = card.dataset.value;

                if (value === '∞') {
                    counter.textContent = '∞';
                    counter.classList.add('animated');
                } else {
                    animateCounter(counter, parseInt(value));
                }

                observer.unobserve(card);
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => observer.observe(card));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

// ============================================
// Initialize App
// ============================================
async function init() {
    await loadManifest();
    initPreloader();
    initGate();
    initModals();
    initShare();
    initParallax();
    // Premium features
    initParticles();
    initStars();
    initConfetti();
    initStatsCounter();
}

document.addEventListener('DOMContentLoaded', init);
