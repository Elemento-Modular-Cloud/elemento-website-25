// Blog Post Editor Boilerplate
// Requires Quill.js (include via CDN in editor.html)

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('blog-form');
  const quill = new Quill('#editor', {
    theme: 'snow'
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = form.title.value.trim();
    const author = form.author.value.trim();
    const date = form.date.value;
    const summary = form.summary.value.trim();
    const content = quill.root.innerHTML;
    const filename = `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    const html = `<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>${title} | Elemento Blog</title>
  <link rel='stylesheet' href='../css/style.css'>
  <link rel='stylesheet' href='../css/themes.css'>
  <link rel="icon" href="../favicon.ico">
</head>
<body class='theme-default'>
  <!-- Background Canvas for animated gradients -->

  
  <!-- Navigation -->
  <div id="navbar-placeholder"></div>
  
  <main class='container'>
    <article class='blog-post'>
      <h1>${title}</h1>
      <p class='blog-meta'>By ${author} &mdash; ${date}</p>
      <p class='blog-summary'>${summary}</p>
      <div class='blog-content'>${content}</div>
    </article>
  </main>
  
  <footer class='footer'>
    <div class='container'>
      <div class='footer-content'>
        <div class='footer-section'>
          <img src='../assets/logos/Elemento.svg' alt='Elemento Logo' style='width: 40px; height: 40px; margin-bottom: 1rem;'>
          <h4>Elemento</h4>
          <p>Vendor-neutral, high-performance cloud platform that's cost-effective, green, and self-hostable.</p>
        </div>
      </div>
      <div class='footer-bottom'>&copy; 2024 Elemento. All rights reserved. | <a href='../blog.html'>Blog</a></div>
    </div>
  </footer>
  
  <script src="../js/navbar.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>`;
    const blob = new Blob([html], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  });
}); 