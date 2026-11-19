// ==================== DONNÉES INITIALES (EXTRAITES DE TON EXCEL) ====================
const DEFAULT_SERVANTS = [
  { id: 1, name: "Hassan hundred persona", class: "Assassin", bondMax: false, priority: 1 },
  { id: 2, name: "Aoko aozaki", class: "Foreigner", bondMax: false, priority: 2 },
  { id: 3, name: "Setanta", class: "Saber", bondMax: false, priority: 3 },
  { id: 4, name: "Bedivere", class: "Saber", bondMax: false, priority: "attente" },
  { id: 5, name: "Ptolémée", class: "Archer", bondMax: false, priority: "attente" },
  { id: 6, name: "Boudica", class: "Rider", bondMax: false, priority: "attente" },
  { id: 7, name: "Hector", class: "Lancer", bondMax: false, priority: "attente" },
  { id: 8, name: "Richard 1er", class: "Saber", bondMax: false, priority: "attente" },
  { id: 9, name: "Britomart", class: "Lancer", bondMax: false, priority: "attente" },
  { id: 10, name: "Gray", class: "Assassin", bondMax: false, priority: "attente" },
  { id: 11, name: "Caligula", class: "Berserker", bondMax: true, priority: "max" },
  { id: 12, name: "Hassan of shining star", class: "Assassin", bondMax: true, priority: "max" },
  { id: 13, name: "Ishtar", class: "Rider", bondMax: true, priority: "max" },
  { id: 14, name: "Artoria alter", class: "Saber", bondMax: true, priority: "max" },
  { id: 15, name: "Hassan cursed arm", class: "Assassin", bondMax: true, priority: "max" },
  { id: 16, name: "Tenochtitlan", class: "Pretender", bondMax: true, priority: "max" },
  { id: 17, name: "Emiya", class: "Archer", bondMax: true, priority: "max" },
  { id: 18, name: "Muramasa", class: "Saber", bondMax: true, priority: "max" },
  { id: 19, name: "Mordred", class: "Saber", bondMax: true, priority: "max" },
  { id: 20, name: "Ishtar", class: "Archer", bondMax: true, priority: "max" },
  { id: 21, name: "Space ishtar", class: "Avenger", bondMax: true, priority: "max" },
  { id: 22, name: "Heracles", class: "Berserker", bondMax: true, priority: "max" },
  { id: 23, name: "First hassan", class: "Assassin", bondMax: true, priority: "max" },
  { id: 24, name: "Ereshkigal", class: "Lancer", bondMax: true, priority: "max" },
  { id: 25, name: "Achille", class: "Rider", bondMax: true, priority: "max" },
  { id: 26, name: "Angra manyu", class: "Avenger", bondMax: true, priority: "max" }
];

const FARM_DATA = [
  { item: "Proof of Hero", area: "Okeanos", quest: "Pirate Ship", drop: 65.5 },
  { item: "Primordial Lanugo", area: "Babylonia", quest: "Blood Fort", drop: 19.9 },
  { item: "Evil Bone", area: "Fuyuki", quest: "Unknown Coordinates X-C", drop: 21.2 },
  { item: "Cursed Beast Gallstone", area: "Id", quest: "Busy Streets", drop: 13.7 },
  { item: "Dragon Fang", area: "E Pluribus Unum", quest: "Deming", drop: 67.5 },
  { item: "Mysterious Divine Wine", area: "Traum", quest: "Defensive Mountains", drop: 14.8 },
  { item: "Void's Dust", area: "E Pluribus Unum", quest: "Charlotte", drop: 69.3 },
  { item: "Reactor Core of Dawn", area: "Olympus", quest: "West Interstellar City", drop: 23.3 },
  { item: "Fool's Chain", area: "Camelot", quest: "Wastelands of Death", drop: 73.4 },
  { item: "Tsukumo Mirror", area: "Shimosa", quest: "Rear Mountain (Trembling in Fear)", drop: 13.7 },
  { item: "Deadly Poisonous Needle", area: "Babylonia", quest: "Field of Reeds", drop: 72.6 },
  { item: "Egg of Truth", area: "Yugakshetra", quest: "Dival", drop: 13.5 },
  { item: "Mystic Spinal Fluid", area: "Shinjuku", quest: "Shinjuku Station", drop: 73.7 },
  { item: "Fragment of a Twinkling Star", area: "Atlantis", quest: "Sailing Point", drop: 13.6 },
  { item: "Stake of Wailing Night", area: "Salem", quest: "Gallows Hill", drop: 76.6 },
  { item: "Mystic Gunpowder", area: "Anastasia", quest: "Yaga Smolensk", drop: 72.9 },
  { item: "Small Bell of Absolution", area: "Avalon le Fae", quest: "Mist Coast", drop: 72.2 },
  { item: "Ceremonial Sword of Twilight", area: "Traum", quest: "Sirmium", drop: 72.5 },
  { item: "Ashes of Remembrance", area: "Traum", quest: "Fort Jovianus", drop: 72.8 },
  { item: "Obsidian Blade", area: "Nahui Mictlān", quest: "Crash Site", drop: 73.3 },
  { item: "Remnants of Madness", area: "Paper Moon", quest: "Build Partition Headquarters", drop: 73.7 },
  { item: "Seed of Yggdrasil", area: "Bleached Earth", quest: "Southern African Area", drop: 142.5 },
  { item: "Ghost Lantern", area: "Babylonia", quest: "Kutha", drop: 46.5 },
  { item: "Octuplet Crystal", area: "Agartha", quest: "Peach Blossom Shangri-La", drop: 44.2 },
  { item: "Serpent Jewel", area: "Agartha", quest: "Chasm in the Earth", drop: 45.3 },
  { item: "Phoenix Feather", area: "Salem", quest: "Town Hall", drop: 38.8 },
  { item: "Eternal Gear", area: "Shinjuku", quest: "Barrel Tower", drop: 52.0 },
  { item: "Forbidden Page", area: "Shinjuku", quest: "Shinjuku 2-chome", drop: 34.3 },
  { item: "Homunculus Baby", area: "Salem", quest: "Whateley Residence", drop: 44.9 },
  { item: "Meteor Horseshoe", area: "Camelot", quest: "Land of the Void", drop: 50.6 },
  { item: "Great Knight Medal", area: "Camelot", quest: "Royal Castle", drop: 39.9 },
  { item: "Shell of Reminiscense", area: "Bleached Earth", quest: "Hawaiian Area (Everlasting Summer Holidays)", drop: 128.1 },
  { item: "Refined Magatama", area: "Shimosa", quest: "Castle Town", drop: 48.3 },
  { item: "Eternal Ice", area: "Bleached Earth", quest: "Russian Area", drop: 126.1 },
  { item: "Giant's Ring", area: "Götterdämmerung", quest: "Giant's Flower Garden", drop: 45.8 },
  { item: "Aurora Steel", area: "Bleached Earth", quest: "Scandinavian Area", drop: 125.6 },
  { item: "Soundless Bell", area: "Bleached Earth", quest: "Eastern Asia Area", drop: 127.0 },
  { item: "Arrowhead of Malice", area: "Yugakshetra", quest: "God's Skyboulder Ruins", drop: 46.1 },
  { item: "Crown of Silvery Light", area: "Atlantis", quest: "Thanatos Island", drop: 45.8 },
  { item: "Divine Leyline Spiritron", area: "Olympus", quest: "Underground Structure", drop: 44.8 },
  { item: "Ball of Rainbow Thread", area: "Heian-kyo", quest: "Gojou Bridge", drop: 46.0 },
  { item: "Scales of Fantasy", area: "Avalon le Fae", quest: "Londinium", drop: 45.4 },
  { item: "Solar Hide", area: "Nahui Mictlān", quest: "Burnt Maize Field", drop: 45.5 },
  { item: "Ether Converger", area: "Paper Moon", quest: "Defend Partition Headquarters", drop: 45.5 },
  { item: "Flower of the End", area: "Id", quest: "Home", drop: 45.1 },
  { item: "Universal Cube", area: "Non disponible (NA)", quest: "-", drop: null },
  { item: "Divine Lens", area: "Non disponible (NA)", quest: "-", drop: null },
  { item: "Claw of Chaos", area: "Yugakshetra", quest: "Western Fault Line", drop: 23.1 },
  { item: "Heart of the Foreign God", area: "Salem", quest: "Carter Residence", drop: 12.1 },
  { item: "Dragon's Reverse Scale", area: "Babylonia", quest: "Nippur", drop: 12.1 },
  { item: "Spirit Root", area: "Camelot", quest: "Holy City", drop: 13.0 },
  { item: "Warhorse's Young Horn", area: "Yugakshetra", quest: "Initiate Point", drop: 23.4 },
  { item: "Tearstone of Blood", area: "Shinjuku", quest: "Shinjuku 2-chome", drop: 19.8 },
  { item: "Black Beast Grease", area: "Yugakshetra", quest: "Secluded Cave", drop: 23.0 },
  { item: "Lamp of Evil-Sealing", area: "Bleached Earth", quest: "Southern Asian Area", drop: 100.0 },
  { item: "Scarab of Wisdom", area: "Atlantis", quest: "Deimos Island", drop: 13.6 },
  { item: "Fruit of Eternity", area: "Olympus", quest: "East Interstellar City", drop: 22.3 },
  { item: "Flaming Oni Lantern Plant", area: "Heian-kyo", quest: "Sanjou San-bou", drop: 13.6 },
  { item: "Golden Cauldron", area: "Id", quest: "Shinjuku Gyoen", drop: 17.8 },
  { item: "Moonlight Nucleus", area: "Non disponible (NA)", quest: "-", drop: null },
  { item: "Holy Water of Destiny", area: "Non disponible (NA)", quest: "-", drop: null }
];

// Dossiers "2027" (miniature cliquable -> image en grand)
// Place tes images extraites de l'Excel dans le dossier `assets/` de ton dépôt GitHub
const FUTURE_EVENTS_FOLDERS = [
  {
    folderName: "2027",
    tag: "Évents",
    image: "assets/events-2027.png"
  }
];

const FUTURE_BANNERS_FOLDERS = [
  {
    folderName: "2027",
    tag: "Bannières",
    image: "assets/banners-2027.png"
  }
];

// Données issues de l'onglet TRAINING GROUND
const TRAINING_GROUND_DAYS = [
  { day: "lundi", mark: null },
  { day: "mardi", mark: null },
  { day: "mercredi", mark: "+" },
  { day: "jeudi", mark: "+" },
  { day: "vendredi", mark: null },
  { day: "samedi", mark: null },
  { day: "dimanche", mark: null }
];

const TRAINING_GROUND_GEMS = [
  { label: "Gem / Étoile", r1: null, r2: 18, r3: 27, r4: 36, r5: 42 },
  { label: "Gem / Étoile (ligne 2)", r1: null, r2: 18, r3: 27, r4: 36, r5: 51 },
  { label: "Gem / Étoile (ligne 3)", r1: null, r2: 18, r3: 27, r4: 36, r5: 51 }
];

// ==================== ÉTAT & LOCALSTORAGE ====================
const STORAGE_KEY = "fgo_na_bond_servants_v1";

function loadServants() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Impossible de lire le localStorage :", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_SERVANTS));
}

function saveServants() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servants));
  } catch (e) {
    console.warn("Impossible de sauvegarder :", e);
  }
}

let servants = loadServants();

// ==================== LOGIQUE DE TRI BOND LEVEL ====================
function getSortedServants() {
  return [...servants].sort((a, b) => {
    if (a.bondMax !== b.bondMax) {
      return a.bondMax ? 1 : -1;
    }
    if (a.bondMax && b.bondMax) {
      return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
    }
    const aIsNum = typeof a.priority === "number";
    const bIsNum = typeof b.priority === "number";
    if (aIsNum && bIsNum) return a.priority - b.priority;
    if (aIsNum) return -1;
    if (bIsNum) return 1;
    return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
  });
}

// ==================== RENDU BOND LEVEL ====================
const bondTbody = document.getElementById("bond-tbody");
const bondCounter = document.getElementById("bond-counter");
const statPrio = document.getElementById("stat-prio");
const statWait = document.getElementById("stat-wait");
const statMax = document.getElementById("stat-max");

function renderBondTable() {
  const sorted = getSortedServants();
  bondTbody.innerHTML = "";

  let countPrio = 0;
  let countWait = 0;
  let countMax = 0;

  sorted.forEach((s) => {
    if (s.bondMax) countMax++;
    else if (typeof s.priority === "number") countPrio++;
    else countWait++;

    const tr = document.createElement("tr");
    if (s.bondMax) tr.classList.add("is-max");
    else if (typeof s.priority === "number") tr.classList.add("is-prio");

    const classSlug = s.class.replace(/\s+/g, "-");

    const prioCell = s.bondMax
      ? `<span class="prio-badge-max">Max</span>`
      : `
        <select class="prio-select ${typeof s.priority === "number" ? "prio-high" : ""}" data-id="${s.id}" aria-label="Priorité pour ${escapeHtml(s.name)}">
          <option value="1" ${s.priority === 1 ? "selected" : ""}>Priorité 1</option>
          <option value="2" ${s.priority === 2 ? "selected" : ""}>Priorité 2</option>
          <option value="3" ${s.priority === 3 ? "selected" : ""}>Priorité 3</option>
          <option value="4" ${s.priority === 4 ? "selected" : ""}>Priorité 4</option>
          <option value="5" ${s.priority === 5 ? "selected" : ""}>Priorité 5</option>
          <option value="attente" ${s.priority === "attente" ? "selected" : ""}>En attente</option>
        </select>
      `;

    tr.innerHTML = `
      <td>${prioCell}</td>
      <td><strong class="servant-name">${escapeHtml(s.name)}</strong></td>
      <td><span class="class-badge class-${classSlug}">${escapeHtml(s.class)}</span></td>
      <td class="col-check">
        <input type="checkbox" class="bond-checkbox" data-id="${s.id}" ${s.bondMax ? "checked" : ""} aria-label="Bond Max pour ${escapeHtml(s.name)}" />
      </td>
      <td class="col-del">
        <button class="btn-delete" data-id="${s.id}" title="Supprimer">×</button>
      </td>
    `;

    bondTbody.appendChild(tr);
  });

  bondCounter.textContent = `${countMax}/${servants.length}`;
  statPrio.textContent = countPrio;
  statWait.textContent = countWait;
  statMax.textContent = countMax;
}

bondTbody.addEventListener("change", (e) => {
  const target = e.target;
  const id = Number(target.dataset.id);
  const servant = servants.find((s) => s.id === id);
  if (!servant) return;

  if (target.classList.contains("bond-checkbox")) {
    servant.bondMax = target.checked;
    if (servant.bondMax) {
      servant.priority = "max";
    } else if (servant.priority === "max") {
      servant.priority = "attente";
    }
    saveServants();
    renderBondTable();
  }

  if (target.classList.contains("prio-select")) {
    const val = target.value;
    servant.priority = val === "attente" ? "attente" : Number(val);
    saveServants();
    renderBondTable();
  }
});

bondTbody.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-delete");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  servants = servants.filter((s) => s.id !== id);
  saveServants();
  renderBondTable();
});

// ==================== MODALE AJOUT SERVANT ====================
const modal = document.getElementById("servant-modal");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelModalBtn = document.getElementById("cancel-modal-btn");
const servantForm = document.getElementById("servant-form");
const nameInput = document.getElementById("servant-name");
const classInput = document.getElementById("servant-class");
const prioInput = document.getElementById("servant-priority");
const bondMaxInput = document.getElementById("servant-bondmax");

function openModal() {
  servantForm.reset();
  modal.classList.remove("hidden");
  nameInput.focus();
}

function closeModal() {
  modal.classList.add("hidden");
}

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

servantForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  const isMax = bondMaxInput.checked;
  const rawPrio = prioInput.value;
  const priority = isMax ? "max" : rawPrio === "attente" ? "attente" : Number(rawPrio);

  servants.push({
    id: Date.now(),
    name,
    class: classInput.value,
    bondMax: isMax,
    priority
  });

  saveServants();
  renderBondTable();
  closeModal();
});

document.getElementById("reset-bond-btn").addEventListener("click", () => {
  if (confirm("Réinitialiser la liste Bond Level avec les données d'origine de ton Excel ?")) {
    servants = JSON.parse(JSON.stringify(DEFAULT_SERVANTS));
    saveServants();
    renderBondTable();
  }
});

// ==================== RENDU & RECHERCHE FARM ====================
const farmTbody = document.getElementById("farm-tbody");
const farmSearch = document.getElementById("farm-search");
const clearSearchBtn = document.getElementById("clear-search");
const farmEmpty = document.getElementById("farm-empty");
const farmCounter = document.getElementById("farm-counter");

function getDropClass(drop) {
  if (drop === null || drop === undefined) return "drop-na";
  if (drop >= 65) return "drop-high";
  if (drop >= 30) return "drop-mid";
  return "drop-low";
}

function renderFarmTable(filter = "") {
  const query = filter.trim().toLowerCase();
  const filtered = FARM_DATA.filter((row) => {
    if (!query) return true;
    return (
      row.item.toLowerCase().includes(query) ||
      row.area.toLowerCase().includes(query) ||
      row.quest.toLowerCase().includes(query)
    );
  });

  farmTbody.innerHTML = "";
  farmCounter.textContent = filtered.length;

  if (filtered.length === 0) {
    farmEmpty.classList.remove("hidden");
    return;
  }
  farmEmpty.classList.add("hidden");

  filtered.forEach((row) => {
    const tr = document.createElement("tr");
    const dropText = row.drop !== null ? `${row.drop.toFixed(1)}%` : "N/A";
    const dropClass = getDropClass(row.drop);

    tr.innerHTML = `
      <td><strong>${escapeHtml(row.item)}</strong></td>
      <td><span class="area-tag">${escapeHtml(row.area)}</span></td>
      <td>${escapeHtml(row.quest)}</td>
      <td class="col-drop"><span class="drop-rate ${dropClass}">${dropText}</span></td>
    `;
    farmTbody.appendChild(tr);
  });
}

farmSearch.addEventListener("input", (e) => {
  const val = e.target.value;
  clearSearchBtn.classList.toggle("visible", val.length > 0);
  renderFarmTable(val);
});

clearSearchBtn.addEventListener("click", () => {
  farmSearch.value = "";
  clearSearchBtn.classList.remove("visible");
  renderFarmTable("");
  farmSearch.focus();
});

// ==================== DOSSIERS MINIATURES + LIGHTBOX (ÉVENTS & BANNIÈRES) ====================
const eventsGrid = document.getElementById("events-grid");
const bannersGrid = document.getElementById("banners-grid");
const lightbox = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const closeLightboxBtn = document.getElementById("close-lightbox-btn");

function openLightbox(title, src) {
  lightboxTitle.textContent = title;
  lightboxImg.src = src;
  lightboxImg.alt = title;
  lightbox.classList.remove("hidden");
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  lightboxImg.src = "";
}

closeLightboxBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!modal.classList.contains("hidden")) closeModal();
    if (!lightbox.classList.contains("hidden")) closeLightbox();
  }
});

function renderFolders(container, folders) {
  container.innerHTML = "";
  folders.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "folder-card";
    btn.innerHTML = `
      <div class="folder-thumb">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.tag)} ${escapeHtml(item.folderName)}" loading="lazy" />
        <span class="folder-zoom-hint">Agrandir</span>
      </div>
      <div class="folder-meta">
        <span class="folder-name">${escapeHtml(item.folderName)}</span>
        <span class="folder-tag">${escapeHtml(item.tag)}</span>
      </div>
    `;
    btn.addEventListener("click", () => openLightbox(`${item.tag} — ${item.folderName}`, item.image));
    container.appendChild(btn);
  });
}

// ==================== RENDU TRAINING GROUND ====================
function renderTrainingGround() {
  const daysTbody = document.getElementById("tg-days-tbody");
  const gemsTbody = document.getElementById("tg-gems-tbody");

  const dayTr = document.createElement("tr");
  dayTr.innerHTML = TRAINING_GROUND_DAYS.map((d) =>
    `<td>${d.mark ? `<span class="tg-plus">${escapeHtml(d.mark)}</span>` : `<span class="muted-small">—</span>`}</td>`
  ).join("");
  daysTbody.innerHTML = "";
  daysTbody.appendChild(dayTr);

  gemsTbody.innerHTML = "";
  TRAINING_GROUND_GEMS.forEach((row) => {
    const tr = document.createElement("tr");
    const fmt = (v) => (v !== null && v !== undefined ? `<strong>${v}</strong>` : `<span class="muted-small">—</span>`);
    tr.innerHTML = `
      <td>${escapeHtml(row.label)}</td>
      <td>${fmt(row.r1)}</td>
      <td>${fmt(row.r2)}</td>
      <td>${fmt(row.r3)}</td>
      <td>${fmt(row.r4)}</td>
      <td>${fmt(row.r5)}</td>
    `;
    gemsTbody.appendChild(tr);
  });
}

// ==================== NAVIGATION PAR ONGLETS ====================
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetTab = btn.dataset.tab;

    tabBtns.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${targetTab}`);
    });
  });
});

// ==================== UTILITAIRE SÉCURITÉ HTML ====================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Initialisation
renderBondTable();
renderFarmTable();
renderFolders(eventsGrid, FUTURE_EVENTS_FOLDERS);
renderFolders(bannersGrid, FUTURE_BANNERS_FOLDERS);
renderTrainingGround();
