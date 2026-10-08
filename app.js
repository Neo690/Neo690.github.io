// L'Herbier Médicinal — logique applicative (vanilla JS, modules ES).
import { PLANTES, ASSOCIATIONS, AVIS } from "./data-loader.js?v=15";
import { QUESTIONNAIRE, recommander, chatReply } from "./assistant.js?v=15";
import { initQuizz } from "./quizz.js?v=2";
import {
  addPlante, addAssociation, removeEntry, resetAll, exportJSON, importJSON,
  getUserCounts, nomsPlantesConnus,
} from "./user-data.js";
import { initInstallPing } from "./ping-install.mjs";

const $ = (sel) => document.querySelector(sel);

const state = {
  tab: "plantes",
  query: "",
  activeChips: new Set(),
  favorites: new Set(JSON.parse(localStorage.getItem("herbier-favs") || "[]")),
};

/* ── Utilitaires ─────────────────────────────────────────────── */
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/* Échappement HTML : toute donnée non fiable (saisie du chat, ajouts perso,
   JSON importé) doit passer par esc() avant insertion dans innerHTML.
   Audit 2026-10-02 : injection confirmée via le chat sans échappement. */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const byNom = new Map(PLANTES.map((p) => [p.nom, p]));

/* Plantes présentes sur la carte archify → vue guidée + nœud d'histoire (12 duos) */
const SYNERGY_VIEWS = {
  aubepine: { view: "apaiser", beat: "duo-aub-mel" },
  melisse: { view: "apaiser", beat: "duo-aub-mel" },
  passiflore: { view: "apaiser", beat: "duo-pas-val" },
  valeriane: { view: "apaiser", beat: "duo-pas-val" },
  "sauge-officinale": { view: "apaiser", beat: "duo-mel-sau" },
  "camomille-matricaire": { view: "apaiser", beat: "duo-cam-men" },
  "menthe-poivree": { view: "apaiser", beat: "duo-cam-men" },
  "sureau-noir": { view: "defendre", beat: "duo-sur-ech" },
  echinacee: { view: "defendre", beat: "duo-sur-ech" },
  thym: { view: "defendre", beat: "duo-sur-thy" },
  gingembre: { view: "defendre", beat: "duo-gin-sur" },
  cassis: { view: "tonifier", beat: "duo-cas-ort" },
  ortie: { view: "tonifier", beat: "duo-cas-ort" },
  bardane: { view: "tonifier", beat: "duo-bar-pis" },
  pissenlit: { view: "tonifier", beat: "duo-bar-pis" },
};

function openSynergyMap(plantId) {
  const v = SYNERGY_VIEWS[plantId];
  openSynergyView(v ? v.view : null, v ? v.beat : null);
}

function openSynergyView(view, beat) {
  switchTab("carte");
  $("#synergy-frame").src = "carte-synergies.html" + (view ? `#view=${view}&beat=${beat}` : "");
}

/* Vue guidée portée par une association : la première de ses plantes présente sur la carte */
function synergyOfAssoc(a) {
  for (const nom of a.plantes) {
    const p = byNom.get(nom);
    if (p && SYNERGY_VIEWS[p.id]) return SYNERGY_VIEWS[p.id];
  }
  return null;
}

const SYNERGY_BTN = (v) =>
  v
    ? `<button class="btn ghost" data-synergy-view="${v.view}" data-synergy-beat="${v.beat}"
        title="Voir ces synergies sur la carte" aria-label="Voir sur la carte des synergies">🗺</button>`
    : "";

/* ── Recherche dans la carte : isoler les duos d'une plante ──── */
function highlightDuos(query) {
  const f = $("#synergy-frame");
  const w = f && f.contentWindow;
  if (!w || !w.Archify || !w.Archify.focus) return null;
  const d = f.contentDocument;
  const q = norm(query.trim());
  if (!q) {
    w.Archify.focus.clear();
    return { matched: [], query: "" };
  }
  const nodes = [...d.querySelectorAll(".diagram-container svg [data-node-id]")];
  const seen = new Set();
  const ids = [];
  for (const n of nodes) {
    const id = n.dataset.nodeId;
    if (seen.has(id)) continue;
    seen.add(id);
    if (id.startsWith("duo-") && norm(n.dataset.nodeLabel || "").includes(q)) ids.push(id);
  }
  // Sort de la vue guidée pour libérer data-chapter-handoff, puis focus
  const gv = w.Archify.guidedViews;
  if (gv && typeof gv.showAll === "function") gv.showAll();
  w.Archify.focus.setMany(ids);
  const labels = nodes
    .filter((n) => ids.includes(n.dataset.nodeId))
    .map((n) => n.dataset.nodeLabel);
  return { matched: labels, query: query.trim() };
}

function renderMapResult(res) {
  const out = $("#map-search-result");
  if (!res || !res.query) {
    out.hidden = true;
    out.innerHTML = "";
    return;
  }
  out.hidden = false;
  if (!res.matched.length) {
    out.innerHTML = `Aucun duo ne contient « ${res.query} ». Essayez : sureau, thym, mélisse, valériane, ortie…`;
    return;
  }
  out.innerHTML = `<strong>${res.matched.length}</strong> duo${res.matched.length > 1 ? "s" : ""} pour « ${res.query} » : ${res.matched.join(" · ")}`;
}

function bindMapSearch() {
  const input = $("#map-search");
  const res = $("#map-search-result");
  // Suggestions : les 16 plantes reliées à un duo
  $("#map-suggestions").innerHTML = [...new Set(Object.keys(SYNERGY_VIEWS))]
    .map((id) => PLANTES.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => `<option value="${p.nom}"></option>`)
    .join("");
  let timer = null;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => renderMapResult(highlightDuos(input.value)), 220);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      renderMapResult(highlightDuos(""));
      input.blur();
    }
  });
  // La carte se recharge (deep-liens) → réapplique la recherche en cours
  $("#synergy-frame").addEventListener("load", () => {
    if (input.value) setTimeout(() => renderMapResult(highlightDuos(input.value)), 700);
  });
}

function assocPourPlante(nomPlante) {
  return ASSOCIATIONS.filter((a) => a.plantes.includes(nomPlante));
}

function saveFavs() {
  localStorage.setItem("herbier-favs", JSON.stringify([...state.favorites]));
}

/* ── Rendu : chips de bienfaits ──────────────────────────────── */
function renderChips() {
  const counts = new Map();
  for (const p of PLANTES) for (const b of p.bienfaits) counts.set(b, (counts.get(b) || 0) + 1);
  const chips = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "fr"));
  $("#chips").innerHTML = chips
    .map(([b, n]) => {
      const active = state.activeChips.has(b) ? " active" : "";
      return `<button class="chip${active}" data-chip="${b}">${b} <small>(${n})</small></button>`;
    })
    .join("");
}

/* ── Rendu : grille des plantes ──────────────────────────────── */
function planteMatches(p) {
  const q = norm(state.query);
  const hay = [
    p.nom, p.latin, p.famille, p.usages, p.preparation,
    p.actifs || "", p.parties || "",
    ...(p.bienfaits || []),
  ].join(" ");
  const matchQuery = !q || norm(hay).includes(q);
  const matchChips = [...state.activeChips].every((c) => p.bienfaits.includes(c));
  return matchQuery && matchChips;
}

function renderPlantes() {
  const list = PLANTES.filter(planteMatches);
  $("#count-plantes").textContent = list.length;
  $("#plantes-empty").hidden = list.length > 0;
  $("#plantes-grid").innerHTML = list
    .map((p) => {
      const shown = p.bienfaits.slice(0, 3);
      const extra = p.bienfaits.length - shown.length;
      const fav = state.favorites.has(p.id) ? " on" : "";
      const media = p.image
        ? `<img src="${p.image}" alt="Illustration botanique de ${p.nom} (${p.latin})" loading="lazy" />`
        : `<div class="emoji-thumb" role="img" aria-label="Symbole de ${p.nom}">${p.emoji || "🌿"}</div>`;
      return `
      <article class="plant-card" data-id="${p.id}" tabindex="0" role="button"
               aria-label="Fiche de ${p.nom}">
        <div class="thumb">
          ${media}
          <span class="famille">${p.famille}</span>
          <button class="fav-btn${fav}" data-fav="${p.id}"
                  title="${state.favorites.has(p.id) ? "Retirer des favoris" : "Ajouter aux favoris"}"
                  aria-label="Favori ${p.nom}">♥</button>
        </div>
        <div class="body">
          <h3>${p.nom}</h3>
          <p class="latin">${p.latin}</p>
          <div class="tag-row">
            ${shown.map((b) => `<span class="tag">${b}</span>`).join("")}
            ${extra > 0 ? `<span class="tag more">+${extra}</span>` : ""}
          </div>
        </div>
      </article>`;
    })
    .join("");
}

/* ── Rendu : associations ────────────────────────────────────── */
function assocMatches(a) {
  const q = norm(state.query);
  return (
    !q ||
    norm(a.nom).includes(q) ||
    norm(a.objectif).includes(q) ||
    norm(a.effet).includes(q) ||
    a.plantes.some((p) => norm(p).includes(q))
  );
}

function renderAssociations() {
  const list = ASSOCIATIONS.filter(assocMatches);
  $("#count-assocs").textContent = list.length;
  $("#assoc-empty").hidden = list.length > 0;
  $("#assoc-grid").innerHTML = list
    .map((a) => {
      const img = byNom.get(a.plantes[0])?.image ?? "images/aubepine.jpg";
      const syn = synergyOfAssoc(a);
      return `
      <article class="assoc-card" data-assoc="${a.id}">
        <div class="head">
          <img src="${img}" alt="Planche botanique de l'association ${a.nom} : ${a.plantes.join(", ")}" loading="lazy" />
          <span class="objectif">${a.objectif}</span>
        </div>
        <div class="body">
          <h3>${a.nom}</h3>
          <div class="plantes-mini">
            ${a.plantes.map((p) => `<span class="tag">${p}</span>`).join("")}
          </div>
          <p class="effet">${a.effet}</p>
          <div class="assoc-actions">
            <button class="btn" data-toggle-recette="${a.id}">La recette</button>
            ${SYNERGY_BTN(syn)}
            <button class="btn ghost" data-print="${a.id}" title="Imprimer cette recette">🖨</button>
          </div>
          <div class="recette" id="recette-${a.id}">
            <h4>La recette</h4>
            <span class="temps">⏱ ${a.temps}</span>
            <p class="label">Ingrédients</p>
            <ul class="ingredients">
              ${a.ingredients.map((i) => `<li>${i}</li>`).join("")}
            </ul>
            <p class="label">Préparation</p>
            <ol>${a.preparation.map((s) => `<li>${s}</li>`).join("")}</ol>
            <p class="meta"><strong>Posologie :</strong> ${a.posologie}</p>
            <p class="meta"><strong>Conservation :</strong> ${a.conservation}</p>
            <p class="warn">⚠ ${a.avertissement}</p>
            <p class="meta no-print" style="margin-top:.6rem"><em>${AVIS}</em></p>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

/* ── Modale fiche plante ─────────────────────────────────────── */
function openModal(id) {
  const p = PLANTES.find((x) => x.id === id);
  if (!p) return;
  const img = $("#modal-img");
  if (p.image) {
    img.src = p.image;
    img.alt = `Illustration botanique de ${p.nom}`;
    img.style.display = "";
  } else {
    img.removeAttribute("src");
    img.alt = "";
    img.style.display = "none";
  }
  $("#modal-hero").classList.toggle("no-img", !p.image);
  $("#modal-emoji").textContent = p.image ? "" : p.emoji || "🌿";
  $("#modal-nom").textContent = p.nom;
  $("#modal-latin").textContent = p.latin;
  $("#modal-tags").innerHTML = p.bienfaits.map((b) => `<span class="tag">${b}</span>`).join("");
  $("#modal-famille").textContent = p.famille;
  $("#modal-parties").textContent = p.parties;
  $("#modal-usages").textContent = p.usages;
  $("#modal-preparation").textContent = p.preparation;
  $("#modal-actifs").textContent = p.actifs || "—";
  $("#modal-formes").textContent = p.formes || "—";
  $("#modal-posologie").textContent = p.posologie || p.preparation;
  $("#modal-interactions").textContent = p.interactions || "Aucune connue aux doses usuelles.";
  $("#modal-grossesse").textContent = p.grossesse || "Non documenté.";
  $("#modal-warn").innerHTML = p.precaution.startsWith("Très bien")
    ? `✓ ${p.precaution}`
    : `⚠ ${p.precaution}`;
  const assocs = assocPourPlante(p.nom);
  const sv = SYNERGY_VIEWS[p.id];
  $("#modal-assocs").innerHTML =
    (assocs.length
      ? `<p class="label" style="font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:.3rem">Présente dans</p>
       ${assocs
         .map(
           (a) =>
             `<button class="chip" data-goto-assoc="${a.id}" style="margin:.15rem">${a.nom}</button>`
         )
         .join("")}`
      : "") +
    (sv
      ? `<button class="btn" data-see-synergy="${p.id}" style="margin-top:.7rem;width:100%">🗺 Voir ses synergies sur la carte</button>`
      : "");
  $("#modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ── Carte des synergies ─────────────────────────────────────
   La carte est désormais un diagramme archify autonome (carte-synergies.html),
   intégré dans l'onglet via une iframe : voir index.html.
   ─────────────────────────────────────────────────────────── */

/* ── Pharmacopée (index A-Z) ─────────────────────────────────── */
const pharmaState = { letter: null, mode: "fr" };

function pharmaKey(p) {
  return pharmaState.mode === "latin" ? norm(p.latin).charAt(0).toUpperCase() : p.nom.charAt(0).toUpperCase();
}

function renderAzBar() {
  const counts = new Map();
  for (const p of PLANTES) {
    const L = pharmaKey(p);
    counts.set(L, (counts.get(L) || 0) + 1);
  }
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const letters = [...new Set([...alphabet, ...counts.keys()])].sort((a, b) =>
    a.localeCompare(b, "fr")
  );
  $("#az-bar").innerHTML = letters
    .map((L) => {
      const n = counts.get(L) || 0;
      const active = pharmaState.letter === L ? " active" : "";
      return `<button class="az-btn${active}" data-letter="${L}" ${n ? "" : "disabled"}
        title="${n ? n + " plante(s)" : "aucune plante"}">${L}</button>`;
    })
    .join("");
}

function renderPharma() {
  const q = norm(state.query);
  let list = PLANTES.filter(
    (p) =>
      (!q || norm(p.nom + " " + p.latin).includes(q)) &&
      (!pharmaState.letter || pharmaKey(p) === pharmaState.letter)
  );
  list.sort((a, b) =>
    pharmaState.mode === "latin"
      ? a.latin.localeCompare(b.latin, "fr")
      : a.nom.localeCompare(b.nom, "fr")
  );
  $("#pharma-empty").hidden = list.length > 0;
  const printCount = $("#pharma-print-count");
  if (printCount) printCount.textContent = PLANTES.length;
  const printDate = $("#pharma-print-date");
  if (printDate) printDate.textContent = new Date().toLocaleDateString("fr-FR");
  const groups = new Map();
  for (const p of list) {
    const L = pharmaKey(p);
    if (!groups.has(L)) groups.set(L, []);
    groups.get(L).push(p);
  }
  $("#pharma-index").innerHTML = [...groups.entries()]
    .map(
      ([L, arr]) => `
      <h3 class="pharma-letter">${L} <small>${arr.length} plante${arr.length > 1 ? "s" : ""}</small></h3>
      <ul class="pharma-list">
        ${arr
          .map((p) => {
            const main = pharmaState.mode === "latin" ? p.latin : p.nom;
            const sub = pharmaState.mode === "latin" ? p.nom : p.latin;
            return `<li><button class="pharma-row" data-open="${p.id}">
              ${p.image ? "" : `<span class="p-emoji">${p.emoji || "🌿"}</span>`}
              <span class="p-name">${main}</span>
              <span class="p-latin">${sub}</span>
              <span class="p-fam">${p.famille}</span>
            </button></li>`;
          })
          .join("")}
      </ul>`
    )
    .join("");
}

/* ── Impression d'une recette ────────────────────────────────── */
function printAssoc(id) {
  const card = document.querySelector(`[data-assoc="${id}"]`);
  if (!card) return;
  const rec = card.querySelector(".recette");
  rec.classList.add("open");
  const others = [...document.querySelectorAll(".assoc-card")].filter((c) => c !== card);
  const wasHidden = others.map((c) => (c.style.display = "none"));
  window.print();
  window.onafterprint = () => {
    others.forEach((c, i) => (c.style.display = ""));
    void wasHidden;
  };
  // Réaffiche après la boîte d'impression (fallback)
  setTimeout(() => others.forEach((c) => (c.style.display = "")), 500);
}

/* ── Impression de la pharmacopée A-Z ───────────────────────── */
let printPharmaState = null;

function printPharmaIndex() {
  const savedLetter = pharmaState.letter;
  const savedQuery = state.query;
  pharmaState.letter = null;
  state.query = "";
  $("#search").value = "";
  $("#clear-search").classList.remove("visible");
  renderAzBar();
  renderPharma();
  document.body.classList.add("print-pharma");
  window.print();
  window.onafterprint = restore;
  setTimeout(restore, 500); // fallback si onafterprint ne se déclenche pas
  function restore() {
    document.body.classList.remove("print-pharma");
    pharmaState.letter = savedLetter;
    state.query = savedQuery;
    $("#search").value = savedQuery;
    $("#clear-search").classList.toggle("visible", !!savedQuery);
    renderAzBar();
    renderPharma();
    window.onafterprint = null;
  }
}

/* ── Onglets ─────────────────────────────────────────────────── */
function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  $("#tab-plantes").hidden = tab !== "plantes";
  $("#tab-associations").hidden = tab !== "associations";
  $("#tab-pharmacopee").hidden = tab !== "pharmacopee";
  $("#tab-quizz").hidden = tab !== "quizz";
  $("#tab-assistant").hidden = tab !== "assistant";
  $("#tab-comparateur").hidden = tab !== "comparateur";
  $("#tab-carte").hidden = tab !== "carte";
  $("#tab-dossier").hidden = tab !== "dossier";
  $("#tab-maj").hidden = tab !== "maj";
  const ph =
    tab === "plantes"
      ? "Rechercher une plante ou un bienfait…"
      : tab === "associations"
      ? "Rechercher un problème (sommeil, digestion…)…"
      : tab === "pharmacopee"
      ? "Filtrer l'index (nom français ou latin)…"
      : "La recherche s'applique aux plantes et aux associations…";
  $("#search").placeholder = ph;
  if (tab === "pharmacopee") {
    renderAzBar();
    renderPharma();
  }
}

/* ── Thème ───────────────────────────────────────────────────── */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $("#theme-btn").textContent = t === "dark" ? "☀" : "🌙";
  localStorage.setItem("herbier-theme", t);
}

/* ── Événements ──────────────────────────────────────────────── */
function bindEvents() {
  $("#search").addEventListener("input", (e) => {
    state.query = e.target.value;
    $("#clear-search").classList.toggle("visible", !!state.query);
    renderPlantes();
    renderAssociations();
    if (state.tab === "pharmacopee") renderPharma();
  });
  $("#clear-search").addEventListener("click", () => {
    $("#search").value = "";
    state.query = "";
    $("#clear-search").classList.remove("visible");
    renderPlantes();
    renderAssociations();
    if (state.tab === "pharmacopee") renderPharma();
    $("#search").focus();
  });
  document.querySelectorAll(".tab-btn").forEach((b) =>
    b.addEventListener("click", () => switchTab(b.dataset.tab))
  );
  $("#chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const b = chip.dataset.chip;
    state.activeChips.has(b) ? state.activeChips.delete(b) : state.activeChips.add(b);
    chip.classList.toggle("active");
    renderPlantes();
  });
  $("#plantes-grid").addEventListener("click", (e) => {
    const fav = e.target.closest(".fav-btn");
    if (fav) {
      const id = fav.dataset.fav;
      state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
      saveFavs();
      fav.classList.toggle("on");
      return;
    }
    const card = e.target.closest(".plant-card");
    if (card) openModal(card.dataset.id);
  });
  $("#plantes-grid").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const card = e.target.closest(".plant-card");
      if (card) openModal(card.dataset.id);
    }
  });
  $("#az-bar").addEventListener("click", (e) => {
    const b = e.target.closest(".az-btn");
    if (!b || b.disabled) return;
    pharmaState.letter = pharmaState.letter === b.dataset.letter ? null : b.dataset.letter;
    renderAzBar();
    renderPharma();
  });
  document.querySelectorAll(".mode-btn").forEach((b) =>
    b.addEventListener("click", () => {
      if (pharmaState.mode === b.dataset.mode) return;
      pharmaState.mode = b.dataset.mode;
      pharmaState.letter = null;
      document.querySelectorAll(".mode-btn").forEach((x) => x.classList.toggle("active", x === b));
      renderAzBar();
      renderPharma();
    })
  );
  $("#pharma-index").addEventListener("click", (e) => {
    const row = e.target.closest(".pharma-row");
    if (row) openModal(row.dataset.open);
  });
  $("#pharma-print").addEventListener("click", printPharmaIndex);
  // Ctrl+P / menu du navigateur : si l'utilisateur est sur la pharmacopée,
  // imprimer l'index complet (filtre levé) plutôt que la lettre active.
  window.addEventListener("beforeprint", () => {
    if (state.tab === "pharmacopee" && !document.body.classList.contains("print-pharma")) {
      printPharmaState = { letter: pharmaState.letter, query: state.query };
      pharmaState.letter = null;
      state.query = "";
      document.body.classList.add("print-pharma");
      renderAzBar();
      renderPharma();
    }
  });
  window.addEventListener("afterprint", () => {
    if (printPharmaState) {
      pharmaState.letter = printPharmaState.letter;
      state.query = printPharmaState.query;
      $("#search").value = state.query;
      $("#clear-search").classList.toggle("visible", !!state.query);
      document.body.classList.remove("print-pharma");
      renderAzBar();
      renderPharma();
      printPharmaState = null;
    }
  });
  $("#assoc-grid").addEventListener("click", (e) => {
    const sv = e.target.closest("[data-synergy-view]");
    if (sv) {
      openSynergyView(sv.dataset.synergyView, sv.dataset.synergyBeat);
      return;
    }
    const t = e.target.closest("[data-toggle-recette]");
    if (t) {
      document.querySelector(`#recette-${t.dataset.toggleRecette}`).classList.toggle("open");
      return;
    }
    const pr = e.target.closest("[data-print]");
    if (pr) printAssoc(pr.dataset.print);
  });
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  $("#modal-assocs").addEventListener("click", (e) => {
    const syn = e.target.closest("[data-see-synergy]");
    if (syn) {
      closeModal();
      openSynergyMap(syn.dataset.seeSynergy);
      return;
    }
    const goto = e.target.closest("[data-goto-assoc]");
    if (!goto) return;
    closeModal();
    switchTab("associations");
    state.query = "";
    $("#search").value = "";
    renderAssociations();
    const el = document.querySelector(`[data-assoc="${goto.dataset.gotoAssoc}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.querySelector(".recette").classList.add("open");
      el.style.outline = "2px solid var(--accent)";
      setTimeout(() => (el.style.outline = ""), 1600);
    }
  });
  $("#theme-btn").addEventListener("click", () =>
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark")
  );
}

/* ── Assistant : questionnaire + chat ────────────────────────── */
const answers = { objectifTags: [], objectifLabel: "", formeFormes: null };

function renderAssistant() {
  const host = $("#assistant-steps");
  if (!host || host.dataset.built) return;
  host.dataset.built = "1";
  host.innerHTML = QUESTIONNAIRE.map(
    (q, qi) => `
    <fieldset class="q-step" data-qid="${q.id}">
      <legend>${qi + 1}. ${q.question}</legend>
      <div class="q-options">
        ${q.options
          .map(
            (o) => `
          <button class="q-opt" data-q="${q.id}" data-value="${o.value}"
                  data-tags='${JSON.stringify(o.tag || [])}' data-formes='${JSON.stringify(o.formes || null)}'
                  data-label="${o.label}">${o.label}</button>`
          )
          .join("")}
      </div>
    </fieldset>`
  ).join("");
}

function collectAnswers() {
  document.querySelectorAll(".q-opt.active").forEach((b) => {
    if (b.dataset.q === "objectif") {
      answers.objectifTags = JSON.parse(b.dataset.tags);
      answers.objectifLabel = b.dataset.label;
    }
    if (b.dataset.q === "antecedents") {
      answers[b.dataset.value] = true;
      if (b.dataset.value === "aucun") {
        QUESTIONNAIRE[1].options.forEach((o) => (answers[o.value] = o.value === "aucun"));
      } else answers["aucun"] = false;
    }
    if (b.dataset.q === "forme") answers.formeFormes = JSON.parse(b.dataset.formes);
  });
  return answers;
}

function renderRecoCards(recos) {
  return recos
    .map(({ a, reasons, warnings }) => {
      const img = byNom.get(a.plantes[0])?.image ?? "images/aubepine.jpg";
      const syn = synergyOfAssoc(a);
      return `
      <article class="reco-card">
        <img src="${img}" alt="" loading="lazy" />
        <div class="reco-body">
          <h4>${a.nom}</h4>
          <p class="reco-effet">${a.effet}</p>
          <div class="plantes-mini">${a.plantes.map((p) => `<span class="tag">${p}</span>`).join("")}</div>
          ${reasons.length ? `<p class="reco-why"><strong>Pourquoi :</strong> ${reasons.join(" · ")}</p>` : ""}
          ${warnings.length ? `<p class="reco-warn">⚠ ${warnings.join(" · ")}</p>` : ""}
          <div class="assoc-actions">
            <button class="btn" data-reco-open="${a.id}">Voir la recette</button>
            ${SYNERGY_BTN(syn)}
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function runRecommandation() {
  collectAnswers();
  const { top3, refused } = recommander(answers);
  const out = $("#assistant-results");
  let html = `<h3 class="reco-title">🌿 Vos 3 associations recommandées</h3>`;
  html += top3.length ? renderRecoCards(top3) : `<p class="empty">Sélectionnez au moins un objectif pour obtenir des recommandations.</p>`;
  if (refused.length) {
    html += `<h3 class="reco-title refused">⛔ Associations non retenues (contre-indication)</h3>`;
    html += refused
      .map(
        ({ a, warnings }) => `
      <div class="reco-blocked">
        <strong>${a.nom}</strong> — ${warnings.join(" · ")}
      </div>`
      )
      .join("");
  }
  html += `<p class="reco-disclaimer">⚠ Ces suggestions ne remplacent pas un avis médical. Consultez un professionnel en cas de traitement en cours.</p>`;
  out.innerHTML = html;
  out.hidden = false;
  out.scrollIntoView({ behavior: "smooth", block: "start" });
}

function addChatMsg(role, html) {
  const log = $("#chat-log");
  const div = document.createElement("div");
  div.className = "chat-msg " + role;
  div.innerHTML = html;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function recoByTags(tags) {
  return ASSOCIATIONS.map((a) => {
    let score = 0;
    for (const nom of a.plantes) {
      const p = byNom.get(nom);
      if (p) score += p.bienfaits.filter((b) => tags.includes(b)).length * 3;
    }
    return { a, score };
  })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 2)
    .map((x) => x.a);
}

function handleChat() {
  const input = $("#chat-input");
  const msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  addChatMsg("user", esc(msg));
  const r = chatReply(msg, recoByTags);
  setTimeout(() => {
    if (r.type === "texte") addChatMsg("bot", r.texte);
    else if (r.type === "plante") {
      const p = r.plante;
      addChatMsg(
        "bot",
        `<strong>${p.nom}</strong> <em>(${p.latin})</em> — ${p.usages}<br/>
         <small>${p.actifs || ""}</small><br/>
         <button class="btn chat-open" data-chat-open="${p.id}">Ouvrir la fiche</button>`
      );
    } else {
      const cards = renderRecoCards(
        r.recos.map((a) => ({ a, reasons: [], warnings: [] }))
      );
      addChatMsg("bot", r.intro + cards);
    }
  }, 350);
}

function bindAssistant() {
  renderAssistant();
  $("#assistant-steps").addEventListener("click", (e) => {
    const opt = e.target.closest(".q-opt");
    if (!opt) return;
    const q = QUESTIONNAIRE.find((x) => x.id === opt.dataset.q);
    if (!q.multi) {
      document
        .querySelectorAll(`.q-opt[data-q="${opt.dataset.q}"]`)
        .forEach((b) => b.classList.toggle("active", b === opt));
    } else {
      if (opt.dataset.value === "aucun") {
        document
          .querySelectorAll(`.q-opt[data-q="${opt.dataset.q}"]`)
          .forEach((b) => b.classList.toggle("active", b === opt));
      } else {
        document
          .querySelectorAll(`.q-opt[data-q="${opt.dataset.q}"][data-value="aucun"]`)
          .forEach((b) => b.classList.remove("active"));
        opt.classList.toggle("active");
      }
    }
  });
  $("#assistant-run").addEventListener("click", runRecommandation);
  $("#assistant-results").addEventListener("click", (e) => {
    const sv = e.target.closest("[data-synergy-view]");
    if (sv) {
      openSynergyView(sv.dataset.synergyView, sv.dataset.synergyBeat);
      return;
    }
    const b = e.target.closest("[data-reco-open]");
    if (!b) return;
    switchTab("associations");
    const el = document.querySelector(`[data-assoc="${b.dataset.recoOpen}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.querySelector(".recette").classList.add("open");
      el.style.outline = "2px solid var(--accent)";
      setTimeout(() => (el.style.outline = ""), 1800);
    }
  });
  $("#chat-send").addEventListener("click", handleChat);
  $("#chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleChat();
  });
  $("#chat-log").addEventListener("click", (e) => {
    const sv = e.target.closest("[data-synergy-view]");
    if (sv) {
      openSynergyView(sv.dataset.synergyView, sv.dataset.synergyBeat);
      return;
    }
    const b = e.target.closest("[data-chat-open]");
    if (b) openModal(b.dataset.chatOpen);
  });
  addChatMsg(
    "bot",
    "Bonjour ! 🌿 Je suis votre guide phytothérapeutique. Dites-moi ce qui vous préoccupe (sommeil, digestion, stress…) ou utilisez le questionnaire."
  );
}

/* ── Comparateur de plantes ─────────────────────────────────── */
const comp = { selected: new Set() };

function compWord(p) {
  return norm(p.nom + " " + p.latin + " " + (p.famille || ""));
}

function renderCompPicklist() {
  const q = norm($("#comp-search").value.trim());
  const pool = PLANTES.filter(
    (p) => (!q || compWord(p).includes(q)) && !comp.selected.has(p.id)
  );
  $("#comp-picklist").innerHTML = pool
    .slice(0, 24)
    .map(
      (p) => `
      <button class="comp-opt" data-comp-add="${p.id}" title="${p.bienfaits.join(", ")}">
        <span class="comp-thumb">${p.image ? `<img src="${p.image}" alt="" loading="lazy" />` : p.emoji || "🌿"}</span>
        <span class="comp-name">${p.nom}<small>${p.latin}</small></span>
      </button>`
    )
    .join("");
}

function renderCompSelected() {
  const host = $("#comp-selected");
  const plants = [...comp.selected].map((id) => PLANTES.find((p) => p.id === id)).filter(Boolean);
  host.innerHTML = plants.length
    ? plants
        .map(
          (p) => `
      <span class="comp-tag">
        ${p.nom}
        <button data-comp-remove="${p.id}" aria-label="Retirer ${p.nom}">✕</button>
      </span>`
        )
        .join("")
    : `<span class="comp-tag empty">Aucune plante sélectionnée</span>`;
}

function renderCompResults() {
  const plants = [...comp.selected].map((id) => PLANTES.find((p) => p.id === id)).filter(Boolean);
  const wrap = $("#comp-results");
  if (plants.length < 2) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  const wanted = new Set(plants.map((p) => p.id));
  const byNom = (n) => {
    const p = PLANTES.find((x) => norm(x.nom) === norm(n));
    return p ? p.id : null;
  };

  // 1) Associations réunissant toutes (ou partie) des plantes cochées
  const hits = ASSOCIATIONS.map((a) => {
    const ids = a.plantes.map(byNom).filter(Boolean);
    const common = [...wanted].filter((id) => ids.includes(id));
    return { a, common, n: common.length };
  })
    .filter((h) => h.n >= 2)
    .sort((x, y) => y.n - x.n);

  $("#comp-assocs").innerHTML = hits.length
    ? hits
        .map(({ a, common, n }) => {
          const badge =
            n === plants.length && plants.length > 2
              ? `<span class="comp-badge full">toutes</span>`
              : n > 2
              ? `<span class="comp-badge">${n} plantes communes</span>`
              : "";
          return `
          <article class="comp-assoc">
            <div class="comp-assoc-head">
              <h4>${a.nom} ${badge}</h4>
              <span class="tag">${a.objectif}</span>
            </div>
            <div class="plantes-mini">
              ${a.plantes
                .map((p) => {
                  const id = byNom(p);
                  return `<span class="tag${wanted.has(id) ? " comp-hit" : ""}">${p}</span>`;
                })
                .join("")}
            </div>
            <p class="reco-effet">${a.effet}</p>
            <button class="btn" data-goto-assoc="${a.id}">La recette</button>
          </article>`;
        })
        .join("")
    : `<p class="empty">Aucune association de la base ne réunit au moins deux de ces plantes. Elles restent utilisables séparément.</p>`;

  // 2) Précautions croisées : signaux tirés des champs sécurité des fiches cochées
  const signals = [];
  for (const p of plants) {
    const fields = [p.interactions, p.grossesse, p.precaution].filter(Boolean);
    for (const f of fields) {
      const flags = [];
      if (/CONTRE-INDIQU|éviter|deconseillé|déconseillé/i.test(f)) flags.push("à éviter selon la fiche");
      if (/grossesse/i.test(f)) flags.push("grossesse / allaitement");
      if (/avis médical|pharmacien|médecin/i.test(f)) flags.push("avis professionnel requis");
      if (/sédatif|somnifer|somnolence/i.test(f)) flags.push("sédation (conduite, somnifères)");
      if (/hépat/i.test(f)) flags.push("surveillance hépatique");
      if (/auto-?immun/i.test(f)) flags.push("maladies auto-immunes");
      if (/hormonodépendant|œstrog[eé]n/i.test(f)) flags.push("cancers hormonodépendants");
      if (/anticoagul|anticoagulant/i.test(f)) flags.push("anticoagulants");
      for (const fl of flags) {
        let sig = signals.find((s) => s.flag === fl);
        if (!sig) signals.push((sig = { flag: fl, plants: [] }));
        if (!sig.plants.includes(p.nom)) sig.plants.push(p.nom);
      }
    }
  }
  const cumuls = signals.filter((s) => s.plants.length >= 2);
  const singles = signals.filter((s) => s.plants.length === 1);
  $("#comp-warnings").innerHTML =
    (cumuls.length
      ? cumuls
          .map(
            (s) => `
        <div class="reco-blocked"><strong>Cumul — ${s.flag}</strong> : ${s.plants.join(", ")}</div>`
          )
          .join("")
      : `<p class="comp-ok">✓ Aucun signal commun détecté entre ces plantes aux doses usuelles.</p>`) +
    (singles.length
      ? `<details class="comp-single"><summary>Détail par plante (${singles.length})</summary>` +
        singles
          .map(
            (s) =>
              `<div class="reco-warn">${s.plants[0]} — ${s.flag}</div>`
          )
          .join("") +
        `</details>`
      : "");
}

function renderComp() {
  renderCompSelected();
  renderCompPicklist();
  renderCompResults();
}

function bindComparateur() {
  $("#comp-search").addEventListener("input", renderCompPicklist);
  $("#comp-picklist").addEventListener("click", (e) => {
    const b = e.target.closest("[data-comp-add]");
    if (!b || comp.selected.size >= 6) return;
    comp.selected.add(b.dataset.compAdd);
    renderComp();
  });
  $("#comp-selected").addEventListener("click", (e) => {
    const b = e.target.closest("[data-comp-remove]");
    if (!b) return;
    comp.selected.delete(b.dataset.compRemove);
    renderComp();
  });
  $("#comp-clear").addEventListener("click", () => {
    comp.selected.clear();
    renderComp();
  });
  $("#comp-favs").addEventListener("click", () => {
    for (const id of state.favorites) comp.selected.add(id);
    renderComp();
  });
  $("#comp-results").addEventListener("click", (e) => {
    const goto = e.target.closest("[data-goto-assoc]");
    if (!goto) return;
    switchTab("associations");
    const el = document.querySelector(`[data-assoc="${goto.dataset.gotoAssoc}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.querySelector(".recette").classList.add("open");
    }
  });
}

/* ── Installation PWA ───────────────────────────────────────── */
let deferredInstall = null;
const IS_IOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function showInstallButton(mode) {
  const btn = $("#install-btn");
  if (!btn) return;
  btn.classList.remove("hidden");
  btn.dataset.mode = mode; // "prompt" (Chrome/Android) ou "help" (iOS)
  btn.textContent = mode === "help" ? "📲" : "⬇";
  btn.title =
    mode === "help"
      ? "Sur iPhone : bouton Partager, puis « Sur l'écran d'accueil »"
      : "Installer l'application";
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstall = e;
  showInstallButton("prompt");
});
window.addEventListener("appinstalled", () => {
  deferredInstall = null;
  $("#install-btn")?.classList.add("hidden");
  pingInstallation();
});
// iOS : pas d'événement, on propose l'aide (sauf si déjà en mode app autonome)
if (IS_IOS && !matchMedia("(display-mode: standalone)").matches) {
  addEventListener("load", () => setTimeout(() => showInstallButton("help"), 1500));
}
function bindInstall() {
  const btn = $("#install-btn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    if (btn.dataset.mode === "prompt" && deferredInstall) {
      deferredInstall.prompt();
      const { outcome } = await deferredInstall.userChoice;
      if (outcome === "accepted") btn.classList.add("hidden");
      deferredInstall = null;
      return;
    }
    // Aide contextuelle (iOS ou navigateur sans prompt)
    addChatMsg(
      "bot",
      IS_IOS
        ? "📲 Sur iPhone : touchez le bouton <strong>Partager</strong> <em>(carré avec flèche)</em> en bas de Safari, puis faites défiler et choisissez <strong>« Sur l'écran d'accueil »</strong>. L'aura l'icône de l'Herbier, en plein écran et hors-ligne. 🌿"
        : "📲 Pour installer l'application : ouvrez le menu du navigateur (⋮) et choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>. Vous aurez une icône dédiée et l'app fonctionnera hors-ligne. 🌿"
    );
    switchTab("assistant");
  });
}

/* ── Compteurs depuis la source unique (export/stats.json) ──── */
fetch("export/stats.json", { cache: "no-cache" })
  .then((r) => (r.ok ? r.json() : null))
  .then((s) => {
    if (!s) return;
    // Compteurs = base officielle + ajouts locaux (option « Mise à jour »)
    const c = getUserCounts();
    $("#count-plantes").textContent = s.plantes + c.plantes;
    $("#count-assocs").textContent = s.associations + c.associations;
  })
  .catch(() => {});

/* ── Option « Mise à jour » : ajouts locaux de plantes/associations ── */
function refreshMajCount() {
  const c = getUserCounts();
  $("#count-maj").textContent = c.plantes + c.associations;
}

function renderMajList() {
  const box = $("#maj-list");
  const persos = [
    ...PLANTES.filter((p) => p.perso).map((p) => ({ type: "plante", id: p.id, nom: p.nom, detail: p.latin + " · " + p.bienfaits.join(", "), date: p.ajouteLe })),
    ...ASSOCIATIONS.filter((a) => a.perso).map((a) => ({ type: "assoc", id: a.id, nom: a.nom, detail: a.objectif + " · " + a.plantes.join(", "), date: a.ajouteLe })),
  ];
  if (!persos.length) {
    box.innerHTML = `<p class="empty">Aucun ajout personnel pour l'instant — la base officielle reste intacte.</p>`;
    return;
  }
  box.innerHTML = `<h3>Mes ajouts (${persos.length})</h3>` + persos
    .map((x) => `
      <div class="maj-item">
        <div>
          <strong>${x.type === "plante" ? "🌿" : "🤝"} ${x.nom}</strong>
          <small>${x.detail}</small>
          <small>ajouté le ${x.date || "—"}</small>
        </div>
        <button class="btn ghost" data-maj-remove="${x.id}" title="Supprimer cet ajout" aria-label="Supprimer ${x.nom}">✕</button>
      </div>`)
    .join("");
}

function majListePlantes(nomsSup = []) {
  const noms = [...PLANTES.map((p) => p.nom), ...nomsSup];
  $("#maj-plantes-list").innerHTML = noms.map((n) => `<option value="${n}"></option>`).join("");
}

function errBox(id, erreurs) {
  const el = $(id);
  if (!erreurs.length) { el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  el.innerHTML = erreurs.map((e) => `⚠ ${e}`).join("<br>");
}

/* Les tableaux PLANTES / ASSOCIATIONS sont figés à l'import du module :
   on y injecte (ou retire) les ajouts pour un effet immédiat, sans recharger. */
function injectPlante(p) {
  PLANTES.push(p);
  PLANTES.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}
function injectAssoc(a) { ASSOCIATIONS.push(a); }
function eject(id) {
  for (let i = PLANTES.length - 1; i >= 0; i--) if (PLANTES[i].id === id) PLANTES.splice(i, 1);
  for (let i = ASSOCIATIONS.length - 1; i >= 0; i--) if (ASSOCIATIONS[i].id === id) ASSOCIATIONS.splice(i, 1);
}

function bindMaj() {
  refreshMajCount();
  renderMajList();
  majListePlantes();

  $("#maj-form-plante").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const draft = Object.fromEntries(new FormData(f));
    const res = addPlante({
      ...draft,
      bienfaits: draft.bienfaits.split(",").map((s) => s.trim()).filter(Boolean),
    });
    if (!res.ok) { errBox("#maj-err-plante", res.erreurs); return; }
    errBox("#maj-err-plante", []);
    f.reset();
    injectPlante(res.plante);
    renderChips(); renderPlantes(); renderAzBar();
    if (state.tab === "pharmacopee") renderPharma();
    majListePlantes(); renderMajList(); refreshMajCount();
    addChatMsg("bot", `🌿 <strong>${res.plante.nom}</strong> ajoutée à votre herbier : elle apparaît désormais dans la recherche, la pharmacopée et le comparateur.`);
  });

  $("#maj-form-assoc").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const draft = Object.fromEntries(new FormData(f));
    const lignes = (s) => String(s).split("\n").map((x) => x.trim()).filter(Boolean);
    const res = addAssociation({
      ...draft,
      plantes: draft.plantes.split(",").map((s) => s.trim()).filter(Boolean),
      ingredients: lignes(draft.ingredients),
      preparation: lignes(draft.preparation),
    }, nomsPlantesConnus(PLANTES.map((p) => p.nom)));
    if (!res.ok) { errBox("#maj-err-assoc", res.erreurs); return; }
    errBox("#maj-err-assoc", []);
    f.reset();
    injectAssoc(res.assoc);
    renderAssociations();
    majListePlantes(); renderMajList(); refreshMajCount();
    addChatMsg("bot", `🤝 <strong>${res.assoc.nom}</strong> ajoutée : retrouvez-la dans l'onglet Associations et dans l'assistant.`);
  });

  $("#maj-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-maj-remove]");
    if (!btn) return;
    removeEntry(btn.dataset.majRemove);
    eject(btn.dataset.majRemove);
    renderChips(); renderPlantes(); renderAssociations(); renderAzBar(); renderMajList(); refreshMajCount();
    if (state.tab === "pharmacopee") renderPharma();
  });

  $("#maj-export").addEventListener("click", () => {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `herbier-ajouts-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#maj-import").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const texte = await file.text();
    const res = importJSON(texte, "merge");
    if (!res.ok) {
      addChatMsg("bot", `⚠ Import impossible : ${res.erreurs.join(" · ")}`);
      switchTab("maj");
      return;
    }
    // Import = nombreux changements : rechargement complet, la fusion refait tout proprement
    location.reload();
  });

  $("#maj-reset").addEventListener("click", () => {
    if (!confirm("Effacer tous vos ajouts personnels ? La base officielle reste intacte.")) return;
    resetAll();
    location.reload();
  });
}

/* ── Init ────────────────────────────────────────────────────── */
applyTheme(localStorage.getItem("herbier-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
renderChips();
renderPlantes();
renderAssociations();
bindEvents();
bindMapSearch();
initQuizz();
bindAssistant();
bindComparateur();
bindMaj();
bindInstall();
initInstallPing();
