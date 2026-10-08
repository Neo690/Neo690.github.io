// quizz.js — Quizz « La forme dit-elle la fonction ? » (doctrine des signatures)
//
// Une douzaine d'aliments dont la silhouette rappelle un organe (carotte/œil,
// noix/cerveau, haricots rouges/reins…). Les réponses suivent le texte de
// référence de la doctrine des signatures fourni par le propriétaire de l'app
// (02/10/2026) : la forme de l'aliment signale l'organe qu'il soutient, et
// chaque question est commentée — l'observation visuelle, puis la signature.
// Aucune affirmation du texte de référence n'est marquée Exagéré/Faux : les
// verdicts « Vrai » sont la réponse attendue.
// Note : les questions « olive » ont été retirées (absentes du texte de
// référence du 02/10/2026).
//
// Deux types de questions :
//   - qcm : à quoi ressemble cet aliment / que vise-t-il ?
//   - vf  : l'affirmation ci-dessous est-elle exacte ? (Vrai / Exagéré / Faux)
// Module autonome (aucune dépendance), comme assistant.js.

const ORGANS = [
  { t: "un cœur", ok: false },
  { t: "un rein", ok: false },
  { t: "un cerveau", ok: true },
  { t: "un poumon", ok: false },
];

const V = [
  { t: "Vrai", court: "vrai" },
  { t: "Exagéré", court: "exagere" },
  { t: "Faux", court: "faux" },
];

export const QUESTIONS = [
  /* ── Noix / cerveau ─────────────────────────────────────────── */
  {
    id: "noix-forme",
    type: "qcm",
    niv: 1,
    emoji: "🌰",
    aliment: "La noix",
    question: "Une noix coupée en deux, avec ses plis et son cervelet : à quoi ressemble-t-elle ?",
    options: ORGANS,
    legende:
      "Deux moitiés symétriques, un sillon central, des plis : la silhouette du cerveau est la plus lisible de toute la série.",
    science:
      "Un hémisphère gauche et droit, des circonvolutions comme le néo-cortex : la signature du cerveau se lit sur la noix entière.",
  },
  {
    id: "noix-neuro",
    type: "vf",
    niv: 2,
    emoji: "🌰",
    aliment: "La noix",
    question:
      "« Les noix aident à développer plus de trois douzaines de neuro-émetteurs pour la fonction du cerveau. »",
    options: V,
    ok: 0,
    legende: "La noix porte la signature du cerveau : hémisphères supérieurs, cervelets inférieurs, plis du néo-cortex.",
    science:
      "Nous savons maintenant que les noix aident à développer plus de 3 douzaines de neuro-émetteurs pour la fonction du cerveau.",
  },

  /* ── Carotte / œil ─────────────────────────────────────────── */
  {
    id: "carotte-forme",
    type: "qcm",
    niv: 1,
    emoji: "🥕",
    aliment: "La carotte",
    question: "Une carotte tranchée en rondelles : à quoi ressemble chaque rondelle ?",
    options: [
      { t: "un œil", ok: true },
      { t: "un rein", ok: false },
      { t: "un cœur", ok: false },
      { t: "un poumon", ok: false },
    ],
    legende:
      "Le centre sombre fait iris et pupille, les rayons de la tranche prolongent l'iris : l'œil est « dessiné » par la coupe.",
    science:
      "Une carotte coupée en tranches ressemble à l'œil humain : la pupille, l'iris et les lignes de rayonnement.",
  },
  {
    id: "carotte-flux",
    type: "vf",
    niv: 2,
    emoji: "🥕",
    aliment: "La carotte",
    question: "« Les carottes augmentent considérablement le flux de sang vers les yeux. »",
    options: V,
    ok: 0,
    legende: "La signature de la tranche : iris, pupille, rayonnement.",
    science:
      "Oui : la science prouve aujourd'hui que les carottes augmentent considérablement le flux de sang vers les yeux.",
  },

  /* ── Tomate / cœur ──────────────────────────────────────────── */
  {
    id: "tomate-forme",
    type: "qcm",
    niv: 1,
    emoji: "🍅",
    aliment: "La tomate",
    question: "Une tomate coupée en deux : à quoi ressemble son intérieur ?",
    options: [
      { t: "un cœur à quatre cavités", ok: true },
      { t: "un rein", ok: false },
      { t: "une vessie", ok: false },
      { t: "un utérus", ok: false },
    ],
    legende: "Quatre loges rouges, disposées comme les quatre cavités du cœur.",
    science:
      "Une tomate a quatre chambres et est rouge. Le cœur est rouge et a quatre chambres.",
  },
  {
    id: "tomate-coeur",
    type: "vf",
    niv: 2,
    emoji: "🍅",
    aliment: "La tomate",
    question: "« Les tomates sont un aliment pur pour le cœur et le sang. »",
    options: V,
    ok: 0,
    legende: "Forme, couleur rouge, quatre loges : le cœur et le sang sont « visés ».",
    science:
      "Toutes les recherches montrent que les tomates sont en effet un aliment pur pour le cœur et le sang.",
  },

  /* ── Raisin / cœur et sang ──────────────────────────────────── */
  {
    id: "raisin-forme",
    type: "qcm",
    niv: 1,
    emoji: "🍇",
    aliment: "Le raisin",
    question: "Une grappe de raisins suspendue à son pédicelle : quelle forme dessine-t-elle ?",
    options: [
      { t: "un cœur", ok: true },
      { t: "un rein", ok: false },
      { t: "un poumon", ok: false },
      { t: "un utérus", ok: false },
    ],
    legende: "Les grains groupés sur un axe central forment une silhouette cardiaque.",
    science:
      "Les raisins s'accrochent en une forme qui est celle du cœur : la grappe entière dessine la silhouette cardiaque.",
  },
  {
    id: "raisin-sang",
    type: "vf",
    niv: 2,
    emoji: "🍇",
    aliment: "Le raisin",
    question:
      "« Chaque grain de raisin ressemble à un globule sanguin et le raisin est un aliment fortement vitalisant pour le cœur et le sang. »",
    options: V,
    ok: 0,
    legende: "Petit disque translucide, globule sanguin : la déduction est complète.",
    science:
      "Chaque grain de raisin ressemble à un globule sanguin, et toutes les recherches aujourd'hui montrent que les raisins sont un aliment fortement vitalisant pour le cœur et le sang.",
  },

  /* ── Haricots rouges / reins ────────────────────────────────── */
  {
    id: "haricot-forme",
    type: "qcm",
    niv: 1,
    emoji: "🫘",
    aliment: "Le haricot rouge",
    question: "Deux haricots rouges posés côte à côte : à quoi ressemblent-ils ?",
    options: [
      { t: "deux reins", ok: true },
      { t: "deux poumons", ok: false },
      { t: "deux cœurs", ok: false },
      { t: "deux utérus", ok: false },
    ],
    legende: "La forme recourbée du haricot imite celle du rein.",
    science:
      "Oui : les haricots rouges ressemblent exactement aux reins humains.",
  },
  {
    id: "haricot-guerir",
    type: "vf",
    niv: 3,
    emoji: "🫘",
    aliment: "Le haricot rouge",
    question: "« Les haricots rouges guérissent réellement et aident à maintenir la fonction du rein. »",
    options: V,
    ok: 0,
    legende: "La forme du haricot « vise » la fonction du rein.",
    science:
      "Les haricots rouges guérissent réellement et aident à maintenir la fonction du rein — et ils ressemblent exactement aux reins humains.",
  },

  /* ── Céleri, bok choy, rhubarbe / os ───────────────────────── */
  {
    id: "os-forme",
    type: "qcm",
    niv: 1,
    emoji: "🦴",
    aliment: "Céleri, bok choy, rhubarbe",
    question: "Ces légumes allongés et clairs comme des os longs : ils « visent » quoi ?",
    options: [
      { t: "la force des os", ok: true },
      { t: "la force des tendons", ok: false },
      { t: "la santé des dents", ok: false },
      { t: "la salinité du sang", ok: false },
    ],
    legende: "Le céleri et le bok choy ressemblent à des os longs : ils visent le squelette.",
    science:
      "Le céleri, le bok choy (chou chinois), la rhubarbe et leurs semblables ressemblent aux os : ces aliments visent spécifiquement la force des os.",
  },
  {
    id: "os-sodium",
    type: "vf",
    niv: 3,
    emoji: "🦴",
    aliment: "Céleri, bok choy, rhubarbe",
    question:
      "« Les os sont composés à 23 % de sodium, ces légumes aussi : si le sodium manque dans l'alimentation, le corps le tire des os et les rend faibles. »",
    options: V,
    ok: 0,
    legende: "La comparaison chiffrée « 23 % / 23 % » : la signature complète les besoins du squelette.",
    science:
      "Les os sont composés à 23 % de sodium et ces aliments sont aussi composés à 23 % de sodium. Si vous n'avez pas assez de sodium dans votre régime alimentaire, le corps le tire des os, les rendant faibles : ces aliments complètent les besoins du squelette du corps.",
  },

  /* ── Aubergine, avocat, poire / utérus ─────────────────────── */
  {
    id: "aubergine-forme",
    type: "qcm",
    niv: 1,
    emoji: "🍆",
    aliment: "L'aubergine, l'avocat, la poire",
    question: "Ces fruits allongés et arrondis rappellent, en coupe :",
    options: [
      { t: "un utérus", ok: true },
      { t: "un rein", ok: false },
      { t: "un pancréas", ok: false },
      { t: "un estomac", ok: false },
    ],
    legende: "Forme ovoïde évocatrice, surtout en coupe longitudinale.",
    science:
      "L'aubergine, l'avocat et la poire ressemblent justement à l'utérus et au col de l'utérus (cervix) : ils visent la santé et la fonction de ces organes.",
  },
  {
    id: "avocat-semaine",
    type: "vf",
    niv: 3,
    emoji: "🥑",
    aliment: "L'avocat",
    question:
      "« Manger un avocat par semaine équilibre les hormones, élimine l'excès de poids après une naissance et prévient les cancers du col de l'utérus. »",
    options: V,
    ok: 0,
    legende: "Trois promesses sur la même signature — et sur les neuf mois de grossesse.",
    science:
      "La recherche d'aujourd'hui prouve qu'une femme qui mange un avocat par semaine équilibre ses hormones, élimine l'excès de poids après une naissance et prévient les cancers du col de l'utérus.",
  },
  {
    id: "avocat-9mois",
    type: "vf",
    niv: 2,
    emoji: "🥑",
    aliment: "L'avocat",
    question: "« Il faut exactement 9 mois pour cultiver un avocat, de la fleur au fruit mûr. »",
    options: V,
    ok: 0,
    legende: "Le chiffre des 9 mois de grossesse, transposé sur l'avocat.",
    science:
      "Et à quel point cela est profond : il faut exactement 9 mois pour cultiver un avocat de la fleur au fruit mûr. Ces aliments contiennent plus de 14 000 constituants nutritifs — la science moderne n'en a étudié et nommé qu'environ 141.",
  },

  /* ── Figue / utérus et fertilité ───────────────────────────── */
  {
    id: "figue-forme",
    type: "qcm",
    niv: 1,
    emoji: "🫐",
    aliment: "La figue",
    question:
      "Une figue ouverte en deux, pleine de petites graines, et qui s'accroche par deux : elle évoque :",
    options: [
      { t: "un utérus ou un ovaire", ok: true },
      { t: "un rein", ok: false },
      { t: "un pancréas", ok: false },
      { t: "un œil", ok: false },
    ],
    legende:
      "L'inflorescence du figuier s'ouvre par le bas, en deux valves, comme une coupe utérine.",
    science:
      "Les figues sont pleines de graines et s'accrochent par deux quand elles se développent : la signature de la fertilité.",
  },
  {
    id: "figue-fertilite",
    type: "vf",
    niv: 3,
    emoji: "🫐",
    aliment: "La figue",
    question:
      "« Les figues augmentent la mobilité du sperme et le nombre de cellules spermatiques pour surmonter la stérilité masculine. »",
    options: V,
    ok: 0,
    legende: "Tradition ancienne du figuier (Ficus carica) comme symbole de fécondité.",
    science:
      "Les figues augmentent la mobilité du sperme et augmentent le nombre de cellules du sperme pour surmonter la stérilité masculine.",
  },

  /* ── Agrumes / seins et lymphe ──────────────────────────────── */
  {
    id: "agrume-forme",
    type: "qcm",
    niv: 1,
    emoji: "🍊",
    aliment: "Les agrumes (pamplemousse, orange)",
    question: "La chair d'un agrume coupée en deux évoque :",
    options: [
      { t: "un sein en coupe", ok: true },
      { t: "un rein", ok: false },
      { t: "un cœur", ok: false },
      { t: "un estomac", ok: false },
    ],
    legende: "Les quartiers disposés en couronne rappellent la silhouette d'un sein.",
    science:
      "Les pamplemousses, les oranges et autres agrumes ressemblent justement aux glandes mammaires.",
  },
  {
    id: "agrume-lymph",
    type: "vf",
    niv: 2,
    emoji: "🍊",
    aliment: "Les agrumes",
    question: "« Les agrumes aident réellement à la santé des seins et au mouvement de la lymphe dans et hors des seins. »",
    options: V,
    ok: 0,
    legende: "De la forme au drainage : la signature glisse vers la fonction.",
    science:
      "Les agrumes aident réellement à la santé des seins et au mouvement de la lymphe dans et hors des seins.",
  },

  /* ── Oignon et ail ──────────────────────────────────────────── */
  {
    id: "oignon-larmes",
    type: "vf",
    niv: 2,
    emoji: "🧅",
    aliment: "L'oignon",
    question: "« L'oignon fait pleurer parce qu'il produit des larmes qui nettoient les couches épithéliales des yeux. »",
    options: V,
    ok: 0,
    legende: "L'oignon ressemble aux cellules du corps : jusqu'à ses larmes, il travaille au nettoyage.",
    science:
      "Les oignons ressemblent aux cellules du corps. Ils font même produire des larmes qui nettoient les couches épithéliales des yeux.",
  },
  {
    id: "ail-bacterien",
    type: "vf",
    niv: 2,
    emoji: "🧄",
    aliment: "L'ail",
    question: "« L'ail est un bactéricide puissant : son action antibactérienne et son effet sur la tension sont documentés. »",
    options: V,
    ok: 0,
    legende: "Compagnon de l'oignon, l'ail travaille au nettoyage du corps.",
    science:
      "L'ail aide aussi à éliminer les déchets et les radicaux libres du corps : c'est un bactéricide puissant, avec un effet documenté sur la tension.",
  },
  {
    id: "ail-tumoral",
    type: "vf",
    niv: 3,
    emoji: "🧄",
    aliment: "L'ail",
    question:
      "« L'ail a des propriétés anti-tumorales, et l'oignon aide à éliminer les déchets de toutes les cellules du corps. »",
    options: V,
    ok: 0,
    legende: "La liste des propriétés s'allonge avec la signature.",
    science:
      "On attribue à l'ail les propriétés suivantes : anti-athérosclérose, anticoagulant, antibiotique, anti-hypertenseur et anti-tumoral. Et l'oignon, qui ressemble aux cellules du corps, aide à éliminer les déchets de toutes les cellules — la recherche d'aujourd'hui le prouve.",
  },

  /* ── Patate douce / pancréas ───────────────────────────────── */
  {
    id: "patate-forme",
    type: "qcm",
    niv: 1,
    emoji: "🍠",
    aliment: "La patate douce",
    question: "La patate douce coupée en deux ressemble à :",
    options: [
      { t: "un pancréas", ok: true },
      { t: "un rein", ok: false },
      { t: "un utérus", ok: false },
      { t: "un cœur", ok: false },
    ],
    legende: "Forme allongée et aplatie, orange : la silhouette du pancréas.",
    science:
      "La patate douce ressemble au pancréas : même silhouette allongée et lobée.",
  },
  {
    id: "patate-ig",
    type: "vf",
    niv: 2,
    emoji: "🍠",
    aliment: "La patate douce",
    question: "« La patate douce équilibre réellement l'index glycémique des diabétiques. »",
    options: V,
    ok: 0,
    legende: "La signature du pancréas annonce la fonction.",
    science:
      "La patate douce ressemble au pancréas et équilibre réellement l'index glycémique des diabétiques.",
  },
];

/* ── Moteur du quizz ──────────────────────────────────────────── */
const KEY_BEST = "herbier-quizz-best";
const TIRAGE = 10;

const melanger = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const lireBest = () => {
  try {
    const b = JSON.parse(localStorage.getItem(KEY_BEST) || "null");
    return b && b.score >= b.total * 0.5 ? b : null;
  } catch {
    return null;
  }
};

export function initQuizz() {
  const el = document.querySelector("#tab-quizz");
  if (!el) return;

  let tirage = [];
  let i = 0;
  let score = 0;
  let reponses = [];

  const intro = () => {
    const b = lireBest();
    el.innerHTML = `
      <div class="quiz-wrap">
        <div class="quiz-intro">
          <h2>🧠 La forme dit-elle la fonction ?</h2>
          <p class="quiz-lead">
            Carotte/œil, noix/cerveau, tomate/cœur, haricots rouges/reins…
            Dans la doctrine des signatures, la forme de chaque aliment signale
            l'organe qu'il soutient. Ce quizz parcourt ces correspondances :
            <strong>10 questions tirées au sort parmi ${QUESTIONS.length}</strong>,
            et pour chacune l'observation visuelle et la signature qu'elle révèle.
          </p>
          <p class="quiz-rule">
            🎯 Objectif : reconnaître la signature — la forme annonce la fonction,
            l'organe visé et l'effet qui l'accompagne. Verdicts possibles :
            <b class="v-vrai">Vrai</b> · <b class="v-exagere">Exagéré</b> · <b class="v-faux">Faux</b>.
          </p>
          <div class="quiz-actions">
            <button class="btn quiz-start" id="quiz-start">Commencer le quizz</button>
            ${b ? `<button class="btn ghost" id="quiz-reset-best">🗑 Effacer mon record (${b.score}/${b.total})</button>` : ""}
          </div>
          ${
            b
              ? `<p class="quiz-best">🏅 Meilleur score : <strong>${b.score}/${b.total}</strong> — ${b.date}</p>`
              : `<p class="quiz-best">Aucun score enregistré pour l'instant.</p>`
          }
        </div>
      </div>`;

    el.querySelector("#quiz-start")?.addEventListener("click", start);
    el.querySelector("#quiz-reset-best")?.addEventListener("click", () => {
      localStorage.removeItem(KEY_BEST);
      intro();
    });
  };

  const start = () => {
    tirage = melanger(QUESTIONS).slice(0, TIRAGE);
    i = 0;
    score = 0;
    reponses = [];
    question();
  };

  const question = () => {
    const q = tirage[i];
    const opts = q.options
      .map(
        (o, k) =>
          `<button class="quiz-opt" data-k="${k}"><span class="quiz-opt-txt">${o.t}</span></button>`
      )
      .join("");

    el.innerHTML = `
      <div class="quiz-wrap">
        <div class="quiz-bar">
          <div class="quiz-prog"><span style="width:${(i / TIRAGE) * 100}%"></span></div>
          <span class="quiz-count">Question ${i + 1} / ${TIRAGE}</span>
          <span class="quiz-score">Score : ${score}</span>
        </div>
        <div class="quiz-card">
          <p class="quiz-aliment"><span class="quiz-emoji">${q.emoji || "🌿"}</span>${q.aliment}</p>
          <h3 class="quiz-q">${q.question}</h3>
          <div class="quiz-opts">${opts}</div>
          <div class="quiz-fb" id="quiz-fb" hidden aria-live="polite"></div>
          <div class="quiz-nav">
            <button class="btn ghost" id="quiz-quit">Quitter</button>
            <button class="btn" id="quiz-next" hidden>${
              i === TIRAGE - 1 ? "Voir mon résultat" : "Question suivante →"
            }</button>
          </div>
        </div>
      </div>`;

    el.querySelectorAll(".quiz-opt").forEach((b) =>
      b.addEventListener("click", () => repondre(q, b))
    );
    el.querySelector("#quiz-next")?.addEventListener("click", suivant);
    el.querySelector("#quiz-quit")?.addEventListener("click", intro);
  };

  const okIdx = (q) => (q.ok ?? q.options.findIndex((o) => o.ok));

  const repondre = (q, btn) => {
    const k = Number(btn.dataset.k);
    const good = okIdx(q);
    const juste = k === good;

    el.querySelectorAll(".quiz-opt").forEach((b) => {
      const kk = Number(b.dataset.k);
      b.disabled = true;
      if (kk === good) b.classList.add("good");
      else if (kk === k) b.classList.add("bad");
    });
    if (juste) score++;

    const verdict =
      q.type === "qcm"
        ? juste
          ? '<b class="v-vrai">Bonne réponse</b>'
          : '<b class="v-faux">Réponse attendue en vert ci-dessus</b>'
        : `<b class="v-${q.options[good].court}">Verdict : ${q.options[good].t}</b>`;

    el.querySelector("#quiz-fb").hidden = false;
    el.querySelector("#quiz-fb").innerHTML = `
      ${verdict}
      <p class="quiz-legend">👀 <strong>L'observation :</strong> ${q.legende}</p>
      <p class="quiz-sci">🌿 <strong>La signature :</strong> ${q.science}</p>`;
    el.querySelector("#quiz-next").hidden = false;
    el.querySelector(".quiz-score").textContent = `Score : ${score}`;
    reponses.push({ q, ok: juste, choisi: q.options[k].t });
    el.querySelector("#quiz-next").focus();
  };

  const suivant = () => {
    i++;
    i < TIRAGE ? question() : resultat();
  };

  const resultat = () => {
    const pct = Math.round((score / TIRAGE) * 100);
    const msg =
      pct === 100
        ? "Parfait : les signatures n'ont plus de secret pour vous."
        : pct >= 80
        ? "Très bon : une ou deux signatures à revoir."
        : pct >= 60
        ? "Correct : l'essentiel des signatures est en place."
        : pct >= 40
        ? "Passable : quelques signatures se sont effacées de la mémoire."
        : "Les signatures demandent une relecture — parcourez les explications ci-dessous.";

    const b = lireBest();
    const record = !b || score > b.score;
    if (record) {
      localStorage.setItem(
        KEY_BEST,
        JSON.stringify({ score, total: TIRAGE, date: new Date().toLocaleDateString("fr-FR") })
      );
    }

    el.innerHTML = `
      <div class="quiz-wrap">
        <div class="quiz-intro">
          <h2>${score}/${TIRAGE} — ${pct} %</h2>
          <p class="quiz-lead">${msg}</p>
          ${
            record
              ? '<p class="quiz-record">🏅 Nouveau record enregistré sur cet appareil.</p>'
              : b
              ? `<p class="quiz-best">🏅 Meilleur score : <strong>${b.score}/${b.total}</strong> — ${b.date}</p>`
              : ""
          }
          <div class="quiz-actions">
            <button class="btn quiz-start" id="quiz-again">Rejouer (nouveau tirage)</button>
            <button class="btn ghost" id="quiz-home">Retour à l'accueil du quizz</button>
          </div>
        </div>
        <details class="quiz-recap" open>
          <summary>📖 Reprendre les ${TIRAGE} réponses</summary>
          ${reponses
            .map(
              (r) => `
            <div class="quiz-recap-item">
              <p class="quiz-recap-q">${r.q.emoji || "🌿"} <strong>${r.q.aliment}</strong> — ${r.ok ? "✅" : "❌"} ${r.q.question}</p>
              <p class="quiz-recap-ans">Votre réponse : ${r.choisi}${
                r.ok ? "" : ` — attendu : <em>${r.q.options[okIdx(r.q)].t}</em>`
              }</p>
              <p class="quiz-recap-sci">🌿 ${r.q.science}</p>
            </div>`
            )
            .join("")}
        </details>
      </div>`;

    el.querySelector("#quiz-again").addEventListener("click", start);
    el.querySelector("#quiz-home").addEventListener("click", intro);
  };

  intro();
}
