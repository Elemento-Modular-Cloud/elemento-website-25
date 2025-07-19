// Footer loader
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        // Determine the correct path to the footer component
        const isInBlogPost = window.location.pathname.includes('blog-posts/');
        const footerPath = isInBlogPost ? '../components/footer.html' : 'components/footer.html';
        
        fetch(footerPath)
            .then(response => response.text())
            .then(html => {
                // If we're in a blog post, we need to adjust the asset paths
                if (isInBlogPost) {
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
                                    <img src="${isInBlogPost ? '../assets/logos/Elemento.svg' : 'assets/logos/Elemento.svg'}" alt="Elemento Logo" style="width: 40px; height: 40px; margin-bottom: 1rem;">
                                    <h4>Elemento</h4>
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
            });
    }
}); 