// Atmosphere Hero loader
function loadAtmosphereHero() {
    const atmosphereHeroPlaceholder = document.getElementById('atmosphere-hero-placeholder');
    if (atmosphereHeroPlaceholder) {
        // Determine the correct path to the atmosphere hero component
        const isInBlogPost = window.location.pathname.includes('blog-posts/');
        const isInSolutions = window.location.pathname.includes('solutions/');
        const atmosphereHeroPath = (isInBlogPost || isInSolutions) ? '../components/atmosphere_hero.html' : 'components/atmosphere_hero.html';
        
        fetch(atmosphereHeroPath)
            .then(response => response.text())
            .then(html => {
                // If we're in a blog post or solutions directory, we need to adjust the asset paths
                if (isInBlogPost || isInSolutions) {
                    html = html.replace(/src="assets\//g, 'src="../assets/');
                    html = html.replace(/href="([^"]*\.html)"/g, 'href="../$1"');
                }
                atmosphereHeroPlaceholder.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading atmosphere hero:', error);
                // Fallback atmosphere hero if loading fails
                const fallbackHtml = `
                    <div class="atmosphere-container">
                        <div class="fadeout"></div>
                        
                        <!-- Static atmosphere elements -->
                        <div class="atmosphere-wrapper">
                            <div class="atmosphere"></div>
                            <div class="center-glow"></div>
                            <div class="atmosphere-left"></div>
                            <div class="atmosphere-right"></div>
                        </div>

                        <div class="orbit-object orbit-object-center"></div>
                        <div class="orbit-object orbit-object-bottom-center"></div>
                        <div class="planet-radial-glow"></div>
                        <div class="planet-linear-glow"></div>
                        <div class="planet"></div>
                        <div class="planet-halo"></div>
                        
                        <!-- Particle System -->
                        <div class="particles-container">
                            <div class="particle particle-1"></div>
                            <div class="particle particle-2"></div>
                            <div class="particle particle-3"></div>
                            <div class="particle particle-4"></div>
                            <div class="particle particle-5"></div>
                            <div class="particle particle-6"></div>
                            <div class="particle particle-7"></div>
                            <div class="particle particle-8"></div>
                            <div class="particle particle-9"></div>
                            <div class="particle particle-10"></div>
                            <div class="particle particle-11"></div>
                            <div class="particle particle-12"></div>
                            <div class="particle particle-13"></div>
                            <div class="particle particle-14"></div>
                            <div class="particle particle-15"></div>
                            <div class="particle particle-16"></div>
                            <div class="particle particle-17"></div>
                            <div class="particle particle-18"></div>
                            <div class="particle particle-19"></div>
                            <div class="particle particle-20"></div>
                            <div class="particle particle-21"></div>
                            <div class="particle particle-22"></div>
                            <div class="particle particle-23"></div>
                            <div class="particle particle-24"></div>
                            <div class="particle particle-25"></div>
                            <div class="particle particle-26"></div>
                            <div class="particle particle-27"></div>
                            <div class="particle particle-28"></div>
                            <div class="particle particle-29"></div>
                            <div class="particle particle-30"></div>
                            <div class="particle particle-31"></div>
                            <div class="particle particle-32"></div>
                            <div class="particle particle-33"></div>
                            <div class="particle particle-34"></div>
                            <div class="particle particle-35"></div>
                            <div class="particle particle-36"></div>
                            <div class="particle particle-37"></div>
                            <div class="particle particle-38"></div>
                            <div class="particle particle-39"></div>
                            <div class="particle particle-40"></div>
                            <div class="particle particle-41"></div>
                            <div class="particle particle-42"></div>
                            <div class="particle particle-43"></div>
                            <div class="particle particle-44"></div>
                            <div class="particle particle-45"></div>
                            <div class="particle particle-46"></div>
                            <div class="particle particle-47"></div>
                            <div class="particle particle-48"></div>
                            <div class="particle particle-49"></div>
                            <div class="particle particle-50"></div>
                        </div>
                    </div>
                `;
                atmosphereHeroPlaceholder.innerHTML = fallbackHtml;
            });
    } else {
        console.log('Atmosphere hero placeholder not found, will retry...');
    }
}

// Try to load atmosphere hero immediately
loadAtmosphereHero();

// Also try after a short delay in case components are still loading
setTimeout(loadAtmosphereHero, 1000);

// Listen for custom event when components are loaded
document.addEventListener('componentsLoaded', loadAtmosphereHero);

