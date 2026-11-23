
const $ = selector => document.querySelector(selector);

let servants = [];
let farm = [];

const STORAGE_KEY = "fgo-servants-v1";

// ==========================================
// SAUVEGARDE
// ==========================================

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(servants));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

// ==========================================
// SYMBOLES DES CLASSES FGO
// ==========================================

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
    Avenger: "☠",
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

// ==========================================
// TRI DES SERVANTS
// ==========================================

function sortServants(a, b) {

  // Bond Max toujours en dernier
  if (a.bondMax !== b.bondMax) {
    return a.bondMax ? 1 : -1;
  }

  const pa = parseFloat(a.priority);
  const pb = parseFloat(b.priority);

  const validA = Number.isFinite(pa);
  const validB = Number.isFinite(pb);

  // Servants avec priorité avant ceux sans priorité
  if (validA !== validB) {
    return validA ? -1 : 1;
  }

  // Priorité 1 avant priorité 2, etc.
  if (validA && pa !== pb) {
    return pa - pb;
  }

  return a.name.localeCompare(b.name);
}

// ==========================================
// AFFICHAGE BOND LEVEL
// ==========================================

function renderBond() {

  const query = $("#bondSearch").value.toLowerCase();

  const list = servants
    .slice()
    .sort(sortServants)
    .filter(s =>
      (s.name + " " + s.classe + " " + s.priority)
        .toLowerCase()
        .includes(query)
    );

  // COMPTEURS
  const total = servants.length;

  const max = servants.filter(s => s.bondMax).length;

  const active = total - max;

  $("#totalCount").textContent = total;
  $("#activeCount").textContent = active;
  $("#maxCount").textContent = max;

  // LISTE DES SERVANTS
  $("#servantList").innerHTML = list.length

    ? list.map(s => `
      <article class="servant ${s.bondMax ? "done" : ""}">

        <span class="name">
          ${escapeHTML(s.name)}
        </span>

        <span class="class-tag">
          <span class="class-symbol">
            ${getClassSymbol(s.classe)}
          </span>

          ${escapeHTML(s.classe || "Classe ?")}
        </span>

        ${
          s.priority
            ? `
              <span class="priority-indicator">
                P${escapeHTML(s.priority)}
              </span>
            `
            : ""
        }

        <label>
          Priorité

          <input
            type="text"
            value="${escapeHTML(s.priority || "")}"
            data-priority="${escapeHTML(s.id)}"
            placeholder="—"
            style="width:85px"
          >
        </label>

        <label class="bond">
          <input
            type="checkbox"
            data-bond="${escapeHTML(s.id)}"
            ${s.bondMax ? "checked" : ""}
          >

          Bond max
        </label>

        <button
          class="small-btn"
          data-delete="${escapeHTML(s.id)}"
          title="Supprimer"
        >
          ×
        </button>

      </article>
    `).join("")

    : '<p class="empty">Aucun servant trouvé.</p>';
}

// ==========================================
// AFFICHAGE FARM
// ==========================================

function renderFarm() {

  const query = $("#farmSearch").value.toLowerCase();

  const list = farm.filter(item =>
    (
      item.material +
      " " +
      item.area +
      " " +
      item.mission +
      " " +
      item.node
    ).toLowerCase().includes(query)
  );

  $("#farmList").innerHTML = list.length

    ? list.map(item => `
      <article class="farm-entry">

        <div class="farm-top">

          <strong>
            ${escapeHTML(item.material)}
          </strong>

          <span class="drop">
            ${
              item.dropRate == null
                ? "Drop inconnu"
                : escapeHTML(item.dropRate) + " %"
            }
          </span>

        </div>

        <div class="farm-meta">
          ${escapeHTML(item.area)}
          · ${escapeHTML(item.node)}
          · ${escapeHTML(item.mission)}
        </div>

      </article>
    `).join("")

    : '<p class="empty">Aucun matériau trouvé.</p>';
}

// ==========================================
// NAVIGATION ENTRE LES ONGLETS
// ==========================================

document.querySelectorAll(".tab").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".tab, .panel")
      .forEach(element => element.classList.remove("active"));

    button.classList.add("active");

    $("#" + button.dataset.tab).classList.add("active");

  });

});

// ==========================================
// RECHERCHE
// ==========================================

$("#bondSearch").addEventListener("input", renderBond);

$("#farmSearch").addEventListener("input", renderFarm);

// ==========================================
// BOND MAX
// ==========================================

$("#servantList").addEventListener("change", event => {

  const id = event.target.dataset.bond;

  if (!id) return;

  const servant = servants.find(s => s.id === id);

  if (!servant) return;

  servant.bondMax = event.target.checked;

  save();

  // Actualise la liste et les compteurs
  renderBond();

});

// ==========================================
// MODIFICATION DE LA PRIORITÉ
// ==========================================

$("#servantList").addEventListener("input", event => {

  const id = event.target.dataset.priority;

  if (!id) return;

  const servant = servants.find(s => s.id === id);

  if (servant) {

    servant.priority = event.target.value;

    save();

  }

});

// Re-tri quand on termine la saisie
$("#servantList").addEventListener("focusout", event => {

  if (event.target.dataset.priority) {

    renderBond();

  }

});

// ==========================================
// SUPPRESSION
// ==========================================

$("#servantList").addEventListener("click", event => {

  const id = event.target.dataset.delete;

  if (!id) return;

  const servant = servants.find(s => s.id === id);

  if (!servant) return;

  if (confirm("Supprimer " + servant.name + " de la liste ?")) {

    servants = servants.filter(s => s.id !== id);

    save();

    renderBond();

  }

});

// ==========================================
// AJOUT D'UN SERVANT
// ==========================================

$("#addServant").addEventListener("click", () => {

  $("#servantDialog").showModal();

});

$("#cancelDialog").addEventListener("click", () => {

  $("#servantDialog").close();

});

$("#servantForm").addEventListener("submit", event => {

  event.preventDefault();

  const form = new FormData(event.target);

  const name = form.get("name").trim();

  if (!name) return;

  servants.push({

    id: crypto.randomUUID(),

    name: name,

    classe: form.get("classe").trim(),

    priority: form.get("priority").trim(),

    bondMax: false

  });

  save();

  renderBond();

  $("#servantDialog").close();

  event.target.reset();

});

// ==========================================
// INITIALISATION
// ==========================================

async function init() {

  // Chargement des données FARM
  try {

    farm = await fetch("./farm-data.json").then(r => {

      if (!r.ok) {
        throw new Error("Farm data indisponible");
      }

      return r.json();

    });

    renderFarm();

  } catch (error) {

    $("#farmList").innerHTML =
      '<p class="empty">Impossible de charger farm-data.json</p>';

  }

  // Chargement des servants
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {

    try {

      servants = JSON.parse(stored);

      if (!Array.isArray(servants)) {
        throw new Error("Données invalides");
      }

    } catch {

      servants = [];

    }

  } else {

    try {

      servants = await fetch("./servants-default.json")
        .then(r => r.json());

      if (!Array.isArray(servants)) {
        throw new Error("Liste invalide");
      }

      save();

    } catch {

      servants = [];

    }

  }

  // Ajout d'identifiants aux anciennes données
  servants = servants.map(s => ({

    ...s,

    id: s.id || crypto.randomUUID(),

    bondMax: Boolean(s.bondMax)

  }));

  save();

  // Affichage initial
  renderBond();

}

init();
