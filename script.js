// --- Background Node Network ---
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const count = window.innerWidth < 768 ? 40 : 80;
            for(let i=0; i<count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 2
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
                ctx.fillStyle = 'rgba(0, 245, 255, 0.4)';
                ctx.fill();

                for(let j=i+1; j<particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if(dist < 150) {
                        ctx.strokeStyle = `rgba(138, 43, 226, ${0.15 * (1 - dist/150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(drawParticles);
        }

        // --- Typing Effect ---
        function initTypewriter() {
            const el = document.getElementById('typewriter');
            const phrases = ["Web Developer ", "Passionate AI Engineer"];
            let phraseIdx = 0;
            let charIdx = 0;
            let isDeleting = false;

            function type() {
                const current = phrases[phraseIdx];
                if(isDeleting) {
                    el.textContent = current.substring(0, charIdx - 1);
                    charIdx--;
                } else {
                    el.textContent = current.substring(0, charIdx + 1);
                    charIdx++;
                }

                let speed = isDeleting ? 50 : 100;
                if(!isDeleting && charIdx === current.length) {
                    speed = 2000;
                    isDeleting = true;
                } else if(isDeleting && charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    speed = 500;
                }
                setTimeout(type, speed);
            }
            type();
        }

        // --- Scroll Utilities ---
        function initScroll() {
            const reveals = document.querySelectorAll('.scroll-reveal');
            const navbar = document.getElementById('navbar');
            const navLinks = document.querySelectorAll('.nav-links a');
            const sections = document.querySelectorAll('section, header');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if(e.isIntersecting) e.target.classList.add('active');
                });
            }, { threshold: 0.1 });

            reveals.forEach(r => observer.observe(r));

            window.addEventListener('scroll', () => {
                // Navbar transformation
                if(window.scrollY > 50) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');

                // Progress Bar
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                document.getElementById("scroll-progress").style.width = scrolled + "%";

                // Active Link Highlighting
                let current = "";
                sections.forEach(s => {
                    const top = s.offsetTop;
                    if(pageYOffset >= top - 150) current = s.getAttribute('id');
                });
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    if(l.getAttribute('href').includes(current)) l.classList.add('active');
                });
            });
        }

        // --- Init ---
        window.addEventListener('resize', initCanvas);
        window.onload = () => {
            initCanvas();
            drawParticles();
            initTypewriter();
            initScroll();
            
            // Subtle Fade In for Body
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 1s ease';
            setTimeout(() => document.body.style.opacity = '1', 100);
        };
