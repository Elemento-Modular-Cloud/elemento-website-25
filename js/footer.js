// Footer loader
document.addEventListener('DOMContentLoaded', function() {
    function injectLinkedInInsightTag() {
        if (document.getElementById('linkedin-insight-tag-script')) {
            return;
        }

        window._linkedin_partner_id = "10034337";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        if (!window._linkedin_data_partner_ids.includes(window._linkedin_partner_id)) {
            window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
        }

        if (!window.lintrk) {
            window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
            window.lintrk.q = [];
        }

        const insightScript = document.createElement('script');
        insightScript.id = 'linkedin-insight-tag-script';
        insightScript.type = 'text/javascript';
        insightScript.async = true;
        insightScript.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
        document.head.appendChild(insightScript);

        const noScript = document.createElement('noscript');
        noScript.id = 'linkedin-insight-tag-noscript';
        noScript.innerHTML = '<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=10034337&fmt=gif" />';
        document.body.appendChild(noScript);
    }

    injectLinkedInInsightTag();

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
                                        <div class="footer-logo-container footer-logo-masked" role="img" aria-label="Elemento Modular Cloud"></div>
                                    </div>
                                    <p>Vendor-neutral, high-performance cloud platform that's cost-effective, green, and self-hostable.</p>
                                </div>
                            </div>
                            <div class="footer-bottom">
                                <p>&copy; 2026 Elemento. All rights reserved.</p>
                            </div>
                        </div>
                    </section>
                `;
                footerPlaceholder.innerHTML = fallbackHtml;
                
                // Apply the masking styles for the fallback case
                const fallbackLogo = footerPlaceholder.querySelector('.footer-logo-masked');
                if (fallbackLogo) {
                    const logoPath = (isInBlogPost || isInSolutions || isInTechnology) ? '../assets/logos/ElementoMCR.svg' : 'assets/logos/ElementoMCR.svg';
                    fallbackLogo.style.backgroundColor = 'var(--text-color)';
                    fallbackLogo.style.mask = `url('${logoPath}') no-repeat center / contain`;
                    fallbackLogo.style.webkitMask = `url('${logoPath}') no-repeat center / contain`;
                }
            });
    }
}); 