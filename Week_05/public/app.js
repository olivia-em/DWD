document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("secret-form");
  const poemSection = document.getElementById("poem-section");
  const main = document.getElementById("main-content");

  function showForm() {
    form.style.display = "";
    poemSection.style.display = "none";
  }

  function showPoem() {
    form.style.display = "none";
    poemSection.style.display = "";
    // Add back link if not present
    if (!document.getElementById("back-to-form")) {
      const backLink = document.createElement("a");
      backLink.href = "#";
      backLink.id = "back-to-form";
      backLink.className = "back-link";
      backLink.textContent = "← Back to form";
      backLink.onclick = (e) => {
        e.preventDefault();
        showForm();
      };
      poemSection.appendChild(backLink);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const res = await fetch("/share", {
      method: "POST",
      body: formData,
    });
    if (res.redirected || res.ok) {
      // After sharing, fetch the latest poem and show it
      await fetchPoem();
      showPoem();
    }
  });

  async function fetchPoem() {
    const res = await fetch("/secrets");
    const html = await res.text();
    // Extract the poem HTML from the response
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const poemContainer = doc.querySelector(".poem-container");
    poemSection.innerHTML = poemContainer
      ? poemContainer.innerHTML
      : "<p>No secrets yet.</p>";
  }

  // Initial load: show form, hide poem
  showForm();
});
