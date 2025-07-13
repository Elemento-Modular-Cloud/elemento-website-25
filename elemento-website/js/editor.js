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
</head>
<body class='theme-default'>
  <nav class='navbar'>
    <a href='../index.html' class='logo'>Elemento</a>
    <ul class='nav-menu'>
      <li><a href='../index.html'>Home</a></li>
      <li><a href='../products.html'>Products</a></li>
      <li><a href='../technology.html'>Technology</a></li>
      <li><a href='../about.html'>About</a></li>
      <li><a href='../contact.html'>Contact</a></li>
      <li><a href='../blog.html' class='active'>Blog</a></li>
    </ul>
  </nav>
  <main class='container'>
    <article class='blog-post'>
      <h1>${title}</h1>
      <p class='blog-meta'>By ${author} &mdash; ${date}</p>
      <p class='blog-summary'>${summary}</p>
      <div class='blog-content'>${content}</div>
    </article>
  </main>
  <footer class='footer'>
    <div class='footer-bottom'>&copy; 2024 Elemento. All rights reserved. | <a href='../blog.html'>Blog</a></div>
  </footer>
</body>
</html>`;
    const blob = new Blob([html], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  });
}); 