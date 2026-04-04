const API_URL = "http://localhost:5000/api/upload";
    let selectedFile = null;

    // ── Drag and drop ──────────────────────────────────────────────────────────
    const dropZone = document.getElementById("dropZone");

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragging");
    });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragging");
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        setFile(file);
      } else {
        showError("Only PDF files are accepted.");
      }
    });

    // ── File selection ─────────────────────────────────────────────────────────
    function handleFileSelect(input) {
      if (input.files[0]) setFile(input.files[0]);
    }

    function setFile(file) {
      selectedFile = file;
      const label = document.getElementById("fileName");
      label.textContent = `✓ ${file.name}`;
      label.classList.remove("hidden");
      clearError();
      hideResults();
    }

    // ── Upload ─────────────────────────────────────────────────────────────────
    async function upload() {
      clearError();

      if (!selectedFile) {
        showError("Please select a PDF file before uploading.");
        return;
      }

      const btn = document.getElementById("uploadBtn");
      btn.textContent = "Analysing…";
      btn.disabled = true;

      try {
        const formData = new FormData();
        formData.append("resume", selectedFile);

        const res  = await fetch(API_URL, { method: "POST", body: formData });
        const json = await res.json();

        if (!res.ok) throw new Error(json.message || `Server error: ${res.status}`);

        renderResults(json.data);

      } catch (err) {
        showError(err.message);
      } finally {
        btn.textContent = "Upload & Analyse";
        btn.disabled = false;
      }
    }

    // ── Render results ─────────────────────────────────────────────────────────
    function renderResults(data) {
      const score  = data.score  ?? 0;
      const skills = Array.isArray(data.skills)
        ? data.skills
        : typeof data.skills === "string" && data.skills
          ? data.skills.split(",").map(s => s.trim())
          : [];

      // Score
      document.getElementById("scoreValue").textContent = score;
      const bar = document.getElementById("scoreBar");
      bar.style.width = "0%";
      bar.className = `h-full rounded-full transition-all duration-700 ${scoreColor(score)}`;
      // Animate bar after paint
      requestAnimationFrame(() => setTimeout(() => { bar.style.width = `${score}%`; }, 50));

      // Skills
      const list     = document.getElementById("skillsList");
      const noSkills = document.getElementById("noSkills");
      list.innerHTML  = "";

      if (skills.length === 0) {
        noSkills.classList.remove("hidden");
      } else {
        noSkills.classList.add("hidden");
        skills.forEach(skill => {
          const li = document.createElement("li");
          li.className = "bg-zinc-800 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full border border-zinc-700";
          li.textContent = skill;
          list.appendChild(li);
        });
      }

      document.getElementById("results").classList.remove("hidden");
      document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function scoreColor(score) {
      if (score >= 70) return "bg-emerald-500";
      if (score >= 40) return "bg-amber-400";
      return "bg-red-500";
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    function showError(msg) {
      const el = document.getElementById("errorMsg");
      el.textContent = msg;
      el.classList.remove("hidden");
    }

    function clearError() {
      const el = document.getElementById("errorMsg");
      el.textContent = "";
      el.classList.add("hidden");
    }

    function hideResults() {
      document.getElementById("results").classList.add("hidden");
    }