/**
 * Jasus Crafts - Premium Futuristic 3D Website Logic
 * Main Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initThreeJS();
    initCardTilt();
    initScrollAnimations();
});

/* ==========================================================================
   LOADING SCREEN HANDLER
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    const statusText = document.querySelector('.loader-status');
    
    let progress = 0;
    const intervalTime = 20; // ms
    const totalDuration = 1200; // ms
    const increment = (100 / (totalDuration / intervalTime));

    const loadingPhrases = [
        "INITIALIZING CREATIVE DIMENSION...",
        "CONFIGURING NEON CORES...",
        "LOADING 3D GEOMETRIES...",
        "MATERIALIZING ART SUPPLIES...",
        "READY TO CREATE."
    ];

    const timer = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            
            statusText.textContent = loadingPhrases[loadingPhrases.length - 1];
            loaderBar.style.width = '100%';
            
            setTimeout(() => {
                loader.classList.add('loaded');
            }, 300);
        } else {
            loaderBar.style.width = `${progress}%`;
            // Update phrasing based on progress percentage
            const phraseIdx = Math.min(
                Math.floor((progress / 100) * loadingPhrases.length),
                loadingPhrases.length - 2
            );
            statusText.textContent = loadingPhrases[phraseIdx];
        }
    }, intervalTime);
}

/* ==========================================================================
   NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Change styles on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Set active class
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/* ==========================================================================
   THREE.JS 3D CANVAS BACKGROUND
   ========================================================================== */
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true // transparency to let CSS backgrounds show through
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Particle System 1 (Neon Pink)
    const particleGeo1 = new THREE.BufferGeometry();
    const particleCount1 = 800;
    const posArray1 = new Float32Array(particleCount1 * 3);

    for (let i = 0; i < particleCount1 * 3; i++) {
        posArray1[i] = (Math.random() - 0.5) * 80;
    }
    particleGeo1.setAttribute('position', new THREE.BufferAttribute(posArray1, 3));
    
    const particleMat1 = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xff008c, // Neon Pink
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particlesPink = new THREE.Points(particleGeo1, particleMat1);
    scene.add(particlesPink);

    // 5. Particle System 2 (Soft Yellow / White)
    const particleGeo2 = new THREE.BufferGeometry();
    const particleCount2 = 600;
    const posArray2 = new Float32Array(particleCount2 * 3);

    for (let i = 0; i < particleCount2 * 3; i++) {
        posArray2[i] = (Math.random() - 0.5) * 100;
    }
    particleGeo2.setAttribute('position', new THREE.BufferAttribute(posArray2, 3));
    
    const particleMat2 = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xfff275, // Soft Yellow
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particlesYellow = new THREE.Points(particleGeo2, particleMat2);
    scene.add(particlesYellow);

    // 6. Floating Abstract 3D Geometric Meshes
    // Torus (representing ribbons/loops)
    const torusGeo = new THREE.TorusGeometry(5, 1.2, 8, 24);
    const wireframeMatPink = new THREE.MeshBasicMaterial({
        color: 0xff008c,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const torusMesh = new THREE.Mesh(torusGeo, wireframeMatPink);
    torusMesh.position.set(-18, 10, -10);
    scene.add(torusMesh);

    // Cone (representing pens/tools)
    const coneGeo = new THREE.ConeGeometry(3, 8, 4, 1);
    const wireframeMatYellow = new THREE.MeshBasicMaterial({
        color: 0xfff275,
        wireframe: true,
        transparent: true,
        opacity: 0.06
    });
    const coneMesh = new THREE.Mesh(coneGeo, wireframeMatYellow);
    coneMesh.position.set(22, -12, -8);
    scene.add(coneMesh);

    // Dodecahedron (representing crafts/materials)
    const dodecGeo = new THREE.DodecahedronGeometry(4);
    const dodecMesh = new THREE.Mesh(dodecGeo, wireframeMatPink);
    dodecMesh.position.set(12, 14, -12);
    scene.add(dodecMesh);

    // 7. Mouse Interactivity Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - windowHalfX) * 0.05;
        mouseY = (e.clientY - windowHalfY) * 0.05;
    });

    // 8. Parallax Scrolling variables
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // 9. Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 10. Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Rotate particles slowly
        particlesPink.rotation.y = elapsedTime * 0.02;
        particlesYellow.rotation.y = -elapsedTime * 0.015;
        particlesPink.rotation.x = elapsedTime * 0.005;

        // Rotate and float geometric meshes
        torusMesh.rotation.x = elapsedTime * 0.15;
        torusMesh.rotation.y = elapsedTime * 0.2;
        torusMesh.position.y = 10 + Math.sin(elapsedTime * 0.5) * 1.5;

        coneMesh.rotation.z = -elapsedTime * 0.1;
        coneMesh.rotation.y = elapsedTime * 0.15;
        coneMesh.position.y = -12 + Math.cos(elapsedTime * 0.6) * 1.2;

        dodecMesh.rotation.x = -elapsedTime * 0.08;
        dodecMesh.rotation.z = elapsedTime * 0.12;
        dodecMesh.position.y = 14 + Math.sin(elapsedTime * 0.4) * 1.8;

        // Mouse lag interpolation (Lerp) for camera movement
        targetX = targetX + (mouseX - targetX) * 0.05;
        targetY = targetY + (mouseY - targetY) * 0.05;

        camera.position.x = targetX;
        camera.position.y = -targetY;

        // Scroll Parallax camera adjustments
        // Moves the camera slightly downwards as we scroll, creating deep 3D perspective scroll effects
        camera.position.y -= (scrollY * 0.015 - camera.position.y) * 0.1;

        // Look at the center of the scene
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}

/* ==========================================================================
   3D GLASS CARD TILT PHYSICS & SPOTLIGHT EFFECT
   ========================================================================== */
function initCardTilt() {
    const cards = document.querySelectorAll('.glass-card');
    
    // Check if the device has touch input (skip tilt physics on touch to prevent jumping)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    cards.forEach(card => {
        const glowSpot = card.querySelector('.glow-spot') || card.querySelector('.glow-spot-contact');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse coordinates relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalized values (-0.5 to 0.5)
            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.height) - 0.5;
            
            // Calculate tilt angles (max 12 degrees)
            const tiltX = -normY * 12;
            const tiltY = normX * 12;
            
            // Apply 3D transform rotation
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
            card.style.transition = 'transform 0.05s ease-out, border-color 0.4s ease, box-shadow 0.4s ease';

            // Positioning the cursor glow spotlight
            if (glowSpot) {
                glowSpot.style.left = `${x}px`;
                glowSpot.style.top = `${y}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            // Reset rotation back to zero with a smooth animation transition
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            card.style.transition = 'transform 0.5s ease-out, border-color 0.4s ease, box-shadow 0.4s ease';
        });
    });
}

/* ==========================================================================
   SCROLL FADE-IN & NAVBAR LINK HIGHLIGHTING
   ========================================================================== */
function initScrollAnimations() {
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // 1. Intersection Observer for Fade In elements on scroll
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target); // Animates once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // triggers slightly before entering viewport fully
    });

    showcaseItems.forEach(item => {
        fadeObserver.observe(item);
    });

    // 2. Highlight active nav menu links on scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 300)) {
                currentSection = section.getAttribute('id');
            }
        });

        // Specific adjustments for scroll positions
        if (window.scrollY < 200) {
            currentSection = 'hero';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            }
            // Group showcase sections under "Showcase" tab
            if (currentSection && currentSection !== 'hero' && currentSection !== 'contact') {
                if (href === 'showcase' && !document.getElementById(currentSection).classList.contains('contact-section')) {
                    if (currentSection === 'services' || currentSection === 'showcase') {
                        link.classList.add('active');
                    } else {
                        // If it is one of the showcase sections
                        const sectionEl = document.getElementById(currentSection);
                        if (sectionEl && sectionEl.closest('main')) {
                            // If it's a child of main, it's inside showcase/services
                            const showcaseLink = document.querySelector('a[href="#showcase"]');
                            if (showcaseLink) showcaseLink.classList.add('active');
                        }
                    }
                }
                
                // Highlight services
                if (href === 'services' && (currentSection === 'services')) {
                    link.classList.add('active');
                    // Remove showcase active
                    const showcaseLink = document.querySelector('a[href="#showcase"]');
                    if (showcaseLink) showcaseLink.classList.remove('active');
                }
            }
        });
    });
}
