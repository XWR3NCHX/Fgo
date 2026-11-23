
/* ==========================================
   FATE / GRAND ORDER — CHALDEA HELPER
   Compatible avec fgo.html et fgo.css
========================================== */

const $ = selector => document.querySelector(selector);

const STORAGE_KEY = "fgo-servants-v1";

let servants = [];
let farm = [];

/* ==========================================
   OUTILS
========================================== */

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "servant-" + Date.now() + "-" +
    Math.random().toString(16).slice(2);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function normalizeText(value) {
  return String(value ?? "").toLocaleLowerCase("fr");
}

function saveServants() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servants));
  } catch (error) {
    console.error("Erreur de sauvegarde :", error);
    alert("Impossible de sauvegarder les servants dans ce navigateur.");
  }
}

/* ==========================================
   SYMBOLES DES CLASSES
========================================== */

function getClassSymbol(classe) {
  const symbols = {
    Saber: "⚔",
    Archer: "➶",
    Lancer: "✦",
    Rider: "♞",
    Caster: "✧",
    Assassin: "☾",
    Berserker: "✹",
    Ruler: "♜",
    Avenger: "◇",
    Alterego: "◇",
    "Alter Ego": "◇",
    MoonCancer: "☽",
    "Moon Cancer": "☽",
    Foreigner: "✧",
    Pretender: "◈",
    Beast: "♛",
    Shielder: "⬡"
  };

  return symbols[classe] || "✦";
}

/* ==========================================
   TRI DES SERVANTS
========================================== */

function sortServants(a, b) {
  // Bond Max toujours en dernier
  if (Boolean(a.bondMax) !== Boolean(b.bondMax)) {
    return a.bondMax ? 1 : -1;
  }

  const pa = Number(a.priority);
  const pb = Number(b.priority);

  const validA = a.priority !== "" && Number.isFinite(pa);
  const validB = b.priority !== "" && Number.isFinite(pb);

  // Les priorités renseignées passent avant les vides
  if (validA !== validB) {
    return validA ? -1 : 1;
  }

  // Priorité la plus petite en premier
  if (validA && pa !== pb) {
    return pa - pb;
  }

  return String(a.name).localeCompare(String(b.name), "fr");
}

/* ==========================================
   AFFICHAGE DES COMPTEURS
========================================== */

function renderStats() {
  const total = servants.length;
  const max = servants.filter(s => s.bondMax).length;
  const active = total - max;

  $("#totalCount").textContent = total;
  $("#activeCount").textContent = active;
  $("#maxCount").textContent = max;
}

/* ==========================================
   AFFICHAGE BOND LEVEL
========================================== */

function renderBond() {
  const searchInput = $("#bondSearch");
  const query = normalizeText(searchInput?.value);

  const list = servants
    .slice()
    .sort(sortServants)
    .filter(servant => {
      const searchable = [
        servant.name,
        servant.classe,
        servant.priority
      ].join(" ");

      return normalizeText(searchable).includes(query);
    });

  renderStats();

  $("#servantList").innerHTML = list.length
    ? list.map(servant => `
      <article class="servant ${servant.bondMax ? "done" : ""}">

        <span class="name">
          ${escapeHTML(servant.name)}
        </span>

        <span class="class-tag">
          <span class="class-symbol">
            ${getClassSymbol(servant.classe)}
          </span>
          ${escapeHTML(servant.classe || "Classe inconnue")}
        </span>

        <span class="priority-indicator">
          ${servant.priority !== ""
            ? "P" + escapeHTML(servant.priority)
            : "—"}
        </span>

        <label>
          Priorité
          <input
            type="text"
            inputmode="numeric"
            value="${escapeHTML(servant.priority)}"
            data-priority="${escapeHTML(servant.id)}"
            aria-label="Priorité de ${escapeHTML(servant.name)}"
          >
        </label>

        <label class="bond">
          <input
            type="checkbox"
            data-bond="${escapeHTML(servant.id)}"
            ${servant.bondMax ? "checked" : ""}
          >
          Bond Max
        </label>

        <button
          type="button"
          class="small-btn"
          data-delete="${escapeHTML(servant.id)}"
          title="Supprimer ce servant"
          aria-label="Supprimer ${escapeHTML(servant.name)}"
        >
          ×
        </button>

      </article>
    `).join("")
    : '<p class="empty">Aucun servant trouvé.</p>';
}

/* ==========================================
   AFFICHAGE FARM
========================================== */

function renderFarm() {
  const query = normalizeText($("#farmSearch")?.value);

  const list = farm.filter(item => {
    const searchable = [
      item.material,
      item.area,
      item.mission,
      item.node,
      item.code
    ].join(" ");

    return normalizeText(searchable).includes(query);
  });

  $("#farmList").innerHTML = list.length
    ? list.map(item => `
      <article class="farm-entry">

        <div class="farm-top">
          <strong>${escapeHTML(item.material || "Matériau inconnu")}</strong>

          <span class="drop">
            ${item.dropRate === null || item.dropRate === undefined || item.dropRate === ""
              ? "Drop inconnu"
              : escapeHTML(item.dropRate) + " %"}
          </span>
        </div>

        <div class="farm-meta">
          ${escapeHTML(item.area || "Lieu inconnu")}
          · ${escapeHTML(item.node || "Zone inconnue")}
          · ${escapeHTML(item.mission || "Mission inconnue")}
        </div>

      </article>
    `).join("")
    : '<p class="empty">Aucun matériau trouvé.</p>';
}

/* ==========================================
   NAVIGATION ENTRE LES ONGLETS
========================================== */

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.toggle("active", tab === button);
    });

    document.querySelectorAll(".panel").forEach(panel => {
      panel.classList.toggle("active", panel.id === target);
    });
  });
});

/* ==========================================
   RECHERCHE
========================================== */

$("#bondSearch").addEventListener("input", renderBond);
$("#farmSearch").addEventListener("input", renderFarm);

/* ==========================================
   MODIFICATION DU BOND MAX
========================================== */

$("#servantList").addEventListener("change", event => {
  const id = event.target.dataset.bond;

  if (!id) return;

  const servant = servants.find(s => s.id === id);
  if (!servant) return;

  servant.bondMax = event.target.checked;

  saveServants();
  renderBond();
});

/* ==========================================
   MODIFICATION DES PRIORITÉS
========================================== */

$("#servantList").addEventListener("input", event => {
  const id = event.target.dataset.priority;

  if (!id) return;

  const servant = servants.find(s => s.id === id);
  if (!servant) return;

  servant.priority = event.target.value.trim();

  saveServants();
});

$("#servantList").addEventListener("focusout", event => {
  if (event.target.dataset.priority) {
    renderBond();
  }
});

/* ==========================================
   SUPPRESSION
========================================== */

$("#servantList").addEventListener("click", event => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;

  const id = button.dataset.delete;
  const servant = servants.find(s => s.id === id);

  if (!servant) return;

  if (confirm(`Supprimer ${servant.name} de ta liste ?`)) {
    servants = servants.filter(s => s.id !== id);

    saveServants();
    renderBond();
  }
});

/* ==========================================
   AJOUT D'UN SERVANT
========================================== */

$("#addServant").addEventListener("click", () => {
  $("#servantDialog").showModal();
});

$("#cancelDialog").addEventListener("click", () => {
  $("#servantDialog").close();
});

$("#servantForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);

  const name = String(form.get("name") || "").trim();
  const classe = String(form.get("classe") || "").trim();
  const priority = String(form.get("priority") || "").trim();

  if (!name) return;

  servants.push({
    id: createId(),
    name,
    classe,
    priority,
    bondMax: false
  });

  saveServants();

  // Réinitialise la recherche pour afficher le nouveau servant
  $("#bondSearch").value = "";

  renderBond();
  $("#servantDialog").close();
  event.currentTarget.reset();
});

/* ==========================================
   CHARGEMENT DES FICHIERS JSON
========================================== */

async function loadJSON(filename) {
  const response = await fetch(filename, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(
      `${filename} introuvable (HTTP ${response.status})`
    );
  }

  return response.json();
}

/* ==========================================
   CHARGEMENT DES SERVANTS
========================================== */

async function loadServants() {
  let stored = null;

  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("Lecture du stockage impossible :", error);
  }

  if (stored !== null) {
    try {
      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        throw new Error("La sauvegarde n'est pas une liste.");
      }

      servants = parsed;
    } catch (error) {
      console.error("Sauvegarde des servants invalide :", error);
      servants = [];
    }
  } else {
    try {
      const defaults = await loadJSON("./servants-default.json");

      if (!Array.isArray(defaults)) {
        throw new Error("servants-default.json doit contenir une liste.");
      }

      servants = defaults;
    } catch (error) {
      console.error(error);
      servants = [];
    }
  }

  // Ajoute les identifiants manquants et normalise les données
  servants = servants.map(servant => ({
    id: servant.id || createId(),
    name: String(servant.name || "Servant sans nom"),
    classe: String(servant.classe || ""),
    priority: String(servant.priority ?? ""),
    bondMax: Boolean(servant.bondMax)
  }));

  saveServants();
}

/* ==========================================
   CHARGEMENT DES MATÉRIAUX
========================================== */

async function loadFarm() {
  $("#farmList").innerHTML =
    '<p class="loading-message">Chargement des matériaux...</p>';

  try {
    const data = await loadJSON("./farm-data.json");

    if (!Array.isArray(data)) {
      throw new Error("farm-data.json doit contenir une liste.");
    }

    farm = data;
    renderFarm();
  } catch (error) {
    console.error("Erreur de chargement du farm :", error);

    farm = [];

    $("#farmList").innerHTML = `
      <p class="error-message">
        Impossible de charger farm-data.json.
        Vérifie que le fichier est dans le même dossier que fgo.html.
      </p>
    `;
  }
}

/* ==========================================
   INITIALISATION
========================================== */

async function init() {
  await Promise.all([
    loadServants(),
    loadFarm()
  ]);

  renderBond();
}

init();
