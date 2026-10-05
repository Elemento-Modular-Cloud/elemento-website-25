(function () {
  function performSearch() {
    const searchInput = document.getElementById("error-page-search");
    const query = searchInput ? searchInput.value.trim() : "";
    const dest = query
      ? `/blog.html?search=${encodeURIComponent(query)}`
      : "/blog.html";
    window.location.href = dest;
  }

  window.performSearch = performSearch;

  document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("error-page-search");
    if (!searchInput) return;
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") performSearch();
    });
  });
})();
