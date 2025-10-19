// Footer loader
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        // Determine the correct path to the footer component
        const isInBlogPost = window.location.pathname.includes('blog-posts/');
        const isInSolutions = window.location.pathname.includes('solutions/');
        const isInTechnology = window.location.pathname.includes('technology/');
        let footerPath;
        
        if (isInBlogPost) {
            footerPath = '../components/footer.html';
        } else if (isInSolutions) {
            footerPath = '../components/footer.html';
        } else if (isInTechnology) {
            footerPath = '../components/footer.html';
        } else {
            footerPath = 'components/footer.html';
        }
        
        fetch(footerPath)
            .then(response => response.text())
            .then(html => {
                // If we're in a blog post, solutions, or technology page, we need to adjust the asset paths
                if (isInBlogPost || isInSolutions || isInTechnology) {
                    html = html.replace(/src="assets\//g, 'src="../assets/');
                    html = html.replace(/href="([^"]*\.html)"/g, 'href="../$1"');
                }
                footerPlaceholder.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Fallback footer if loading fails
                const fallbackHtml = `
                    <section class="section">
                        <div class="container">
                            <div class="footer-content">
                                <div class="footer-section">
                                    <div class="footer-logo-section">
                                        <div class="footer-logo-container footer-logo-masked"></div>
                                        <h3>Elemento</h3>
                                    </div>
                                    <p>Vendor-neutral, high-performance cloud platform that's cost-effective, green, and self-hostable.</p>
                                </div>
                            </div>
                            <div class="footer-bottom">
                                <p>&copy; 2024 Elemento. All rights reserved.</p>
                            </div>
                        </div>
                    </section>
                `;
                footerPlaceholder.innerHTML = fallbackHtml;
                
                // Apply the masking styles for the fallback case
                const fallbackLogo = footerPlaceholder.querySelector('.footer-logo-masked');
                if (fallbackLogo) {
                    const logoPath = (isInBlogPost || isInSolutions || isInTechnology) ? '../assets/logos/Elemento.svg' : 'assets/logos/Elemento.svg';
                    fallbackLogo.style.filter = 'brightness(0) saturate(100%)';
                    fallbackLogo.style.mask = `url('${logoPath}') no-repeat center`;
                    fallbackLogo.style.maskSize = 'contain';
                    fallbackLogo.style.webkitMask = `url('${logoPath}') no-repeat center`;
                    fallbackLogo.style.webkitMaskSize = 'contain';
                    fallbackLogo.style.backgroundColor = 'currentColor';
                    fallbackLogo.style.color = 'inherit';
                }
            });
    }
}); 