/* ==========================================
   FATE / GRAND ORDER — CHALDEA HELPER
========================================== */
const $ = selector => document.querySelector(selector);
const STORAGE_KEY = "fgo-servants-v1";
let servants = [];
let farm = [];

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "servant-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function normalizeText(value) { return String(value ?? "").toLocaleLowerCase("fr"); }
function saveServants() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(servants)); }
  catch (error) { console.error("Erreur de sauvegarde :", error); alert("Impossible de sauvegarder les servants dans ce navigateur."); }
}

function getClassSymbol(classe) {
  const symbols = {
    Saber: "⚔", Archer: "➶", Lancer: "✦", Rider: "♞", Caster: "✧",
    Assassin: "☾", Berserker: "✹", Ruler: "♜", Avenger: "◇",
    Alterego: "◇", "Alter Ego": "◇", MoonCancer: "☽", "Moon Cancer": "☽",
    Foreigner: "✧", Pretender: "◈", Beast: "♛", Shielder: "⬡"
  };
  return symbols[classe] || "✦";
}

function sortServants(a, b) {
  if (Boolean(a.bondMax) !== Boolean(b.bondMax)) return a.bondMax ? 1 : -1;
  const pa = Number(a.priority), pb = Number(b.priority);
  const validA = a.priority !== "" && Number.isFinite(pa);
  const validB = b.priority !== "" && Number.isFinite(pb);
  if (validA !== validB) return validA ? -1 : 1;
  if (validA && pa !== pb) return pa - pb;
  return String(a.name).localeCompare(String(b.name), "fr");
}

function renderStats() {
  const total = servants.length;
  const max = servants.filter(s => s.bondMax).length;
  $("#totalCount").textContent = total;
  $("#activeCount").textContent = total - max;
  $("#maxCount").textContent = max;
}

function renderBond() {
  const query = normalizeText($("#bondSearch")?.value);
  const list = servants.slice().sort(sortServants).filter(servant =>
    normalizeText([servant.name, servant.classe, servant.priority].join(" ")).includes(query)
  );
  renderStats();
  $("#servantList").innerHTML = list.length ? list.map(servant => `
    <article class="servant ${servant.bondMax ? "done" : ""}">
      <span class="name">${escapeHTML(servant.name)}</span>
      <span class="class-tag"><span class="class-symbol">${getClassSymbol(servant.classe)}</span>${escapeHTML(servant.classe || "Classe inconnue")}</span>
      <label class="priority-edit">Priorité
        <input type="number" min="1" step="1" value="${escapeHTML(servant.priority)}" data-priority="${escapeHTML(servant.id)}" placeholder="—" aria-label="Priorité de ${escapeHTML(servant.name)}">
      </label>
      <label class="bond"><input type="checkbox" data-bond="${escapeHTML(servant.id)}" ${servant.bondMax ? "checked" : ""}> Bond Max</label>
      <button type="button" class="small-btn" data-delete="${escapeHTML(servant.id)}" title="Supprimer ce servant" aria-label="Supprimer ${escapeHTML(servant.name)}">×</button>
    </article>
  `).join("") : '<p class="empty">Aucun servant trouvé.</p>';
}

function renderFarm() {
  const query = normalizeText($("#farmSearch")?.value);
  const list = farm.filter(item => normalizeText([item.material, item.area, item.mission, item.node, item.code].join(" ")).includes(query));
  $("#farmList").innerHTML = list.length ? list.map(item => `
    <article class="farm-entry">
      <div class="farm-top">
        <strong>${escapeHTML(item.material || "Matériau inconnu")}</strong>
        <span class="drop">${item.dropRate === null || item.dropRate === undefined || item.dropRate === "" ? "Drop inconnu" : escapeHTML(item.dropRate) + " %"}</span>
      </div>
      <div class="farm-meta">${escapeHTML(item.area || "Lieu inconnu")} · ${escapeHTML(item.node || "Zone inconnue")} · ${escapeHTML(item.mission || "Mission inconnue")}</div>
    </article>
  `).join("") : '<p class="empty">Aucun matériau trouvé.</p>';
}

/* NAVIGATION */
document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab === button));
    document.querySelectorAll(".panel").forEach(panel => panel.classList.toggle("active", panel.id === target));
  });
});

/* RECHERCHE */
$("#bondSearch").addEventListener("input", renderBond);
$("#farmSearch").addEventListener("input", renderFarm);

/* MODIFICATION DU BOND MAX ET DES PRIORITÉS */
$("#servantList").addEventListener("change", event => {
  const bondId = event.target.dataset.bond;
  if (bondId) {
    const servant = servants.find(s => s.id === bondId);
    if (!servant) return;
    servant.bondMax = event.target.checked;
    saveServants();
    renderBond();
    return;
  }
  const priorityId = event.target.dataset.priority;
  if (priorityId) {
    const servant = servants.find(s => s.id === priorityId);
    if (!servant) return;
    const value = event.target.value.trim();
    if (value === "") servant.priority = "";
    else {
      const number = Number(value);
      if (Number.isInteger(number) && number >= 1) servant.priority = String(number);
      else { event.target.value = servant.priority; return; }
    }
    saveServants();
    renderBond();
  }
});

/* SUPPRESSION */
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

/* AJOUT D'UN SERVANT */
$("#addServant").addEventListener("click", () => $("#servantDialog").showModal());
$("#cancelDialog").addEventListener("click", () => $("#servantDialog").close());
$("#servantForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const classe = String(form.get("classe") || "").trim();
  const priorityValue = String(form.get("priority") || "").trim();
  let priority = "";
  if (priorityValue !== "") {
    const number = Number(priorityValue);
    if (!Number.isInteger(number) || number < 1) {
      alert("La priorité doit être un nombre entier supérieur ou égal à 1.");
      return;
    }
    priority = String(number);
  }
  if (!name) return;
  servants.push({ id: createId(), name, classe, priority, bondMax: false });
  saveServants();
  $("#bondSearch").value = "";
  renderBond();
  $("#servantDialog").close();
  event.currentTarget.reset();
});

/* CHARGEMENT JSON */
async function loadJSON(filename) {
  const response = await fetch(filename, { cache: "no-store" });
  if (!response.ok) throw new Error(`${filename} introuvable (HTTP ${response.status})`);
  return response.json();
}


async function loadServants() {
  let stored = null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) stored = parsed;
    }
  } catch (error) {
    console.error("Sauvegarde des servants invalide :", error);
  }

  try {
    // Charger la liste officielle depuis le JSON
    const defaults = await loadJSON("./servants-default.json");

    if (!Array.isArray(defaults)) {
      throw new Error("servants-default.json doit contenir une liste.");
    }

    if (stored !== null) {
      // Conserver les modifications déjà faites dans le navigateur
      const storedById = new Map(
        stored.map(servant => [servant.id, servant])
      );

      const defaultIds = new Set(defaults.map(servant => servant.id));

      // Ajouter les nouveaux servants sans perdre les anciennes données
      servants = [
        ...defaults.map(servant =>
          storedById.get(servant.id) || servant
        ),
        ...stored.filter(servant => !defaultIds.has(servant.id))
      ];
    } else {
      servants = defaults;
    }
  } catch (error) {
    console.error("Erreur de chargement des servants :", error);
    servants = stored || [];
  }

  servants = servants.map(servant => ({
    id: servant.id || createId(),
    name: String(servant.name || "Servant sans nom"),
    classe: String(servant.classe || ""),
    priority: String(servant.priority ?? ""),
    bondMax: Boolean(servant.bondMax)
  }));

  saveServants();
}


async function loadFarm() {
  $("#farmList").innerHTML = '<p class="loading-message">Chargement des matériaux...</p>';
  try {
    const data = await loadJSON("./farm-data.json");
    if (!Array.isArray(data)) throw new Error("farm-data.json doit contenir une liste.");
    farm = data;
    renderFarm();
  } catch (error) {
    console.error("Erreur de chargement du farm :", error);
    farm = [];
    $("#farmList").innerHTML = '<p class="error-message">Impossible de charger farm-data.json. Vérifie que le fichier est dans le même dossier que fgo.html.</p>';
  }
}

async function init() {
  await Promise.all([loadServants(), loadFarm()]);
  renderBond();
}
init();
