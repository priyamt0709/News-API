function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}


async function fetchNews() {
  const query = document.getElementById("query").value.trim();
  const lang = document.getElementById("lang").value;
  const container = document.getElementById("newsContainer");

  container.innerHTML = `
    <div class="text-center w-100">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Loading news...</p>
    </div>`;

  if (!query) {
    container.innerHTML = `<div class="alert alert-info">Please enter a search term (e.g. politics, delhi, cricket).</div>`;
    return;
  }

  let url = `/news?q=${encodeURIComponent(query)}&lang=${lang}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("👉 Fetched data:", data);
    container.innerHTML = "";

    if (!Array.isArray(data)) {
      container.innerHTML = `<div class="alert alert-warning">⚠️ ${data.error || "Something went wrong."}</div>`;
      return;
    }

    if (data.length === 0) {
      container.innerHTML = `<p class="text-muted">No news found for your query.</p>`;
      return;
    }

    data.forEach((article) => {
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4";
      card.innerHTML = `
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text mt-auto">
              <small class="text-muted">${article.source} | ${new Date(article.publishedAt).toLocaleString()}</small>
            </p>
            <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">Read more</a>
          </div>
        </div>`;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    container.innerHTML = `<div class="alert alert-danger">Error fetching news.</div>`;
  }
}

// On load: apply saved theme
window.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").checked = true;
  }
});

