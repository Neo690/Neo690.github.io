// Assistant santé : questionnaire → 3 associations adaptées + chat conversationnel.
import { ASSOCIATIONS, PLANTES } from "./data-loader.js?v=15";

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/* ── Modèle du questionnaire ─────────────────────────────────── */
export const QUESTIONNAIRE = [
  {
    id: "objectif",
    question: "Quel est votre objectif principal ?",
    multi: false,
    options: [
      { value: "sommeil", label: "Mieux dormir", tag: ["Sommeil", "Anxiété", "Nerfs"] },
      { value: "digestion", label: "Améliorer ma digestion", tag: ["Digestion", "Ballonnements", "Estomac"] },
      { value: "stress", label: "Gérer stress et anxiété", tag: ["Anxiété", "Nerfs", "Sommeil"] },
      { value: "immunite", label: "Renforcer mon immunité", tag: ["Immunité", "Antiviral", "Infections ORL"] },
      { value: "articulations", label: "Soulager mes articulations", tag: ["Articulations", "Anti-inflammatoire"] },
      { value: "circulation", label: "Améliorer ma circulation", tag: ["Circulation", "Drainage"] },
      { value: "energie", label: "Retrouver énergie et tonus", tag: ["Tonique", "Reminéralisant", "Surrénales"] },
      { value: "foie", label: "Soutenir mon foie / détox", tag: ["Foie", "Drainage", "Digestion"] },
      { value: "peau", label: "Améliorer ma peau", tag: ["Peau", "Cicatrisant", "Drainage"] },
      { value: "hormones", label: "Équilibre hormonal / ménopause", tag: ["Bouffées de chaleur", "Humeur"] },
    ],
  },
  {
    id: "antecedents",
    question: "Avez-vous des antécédents ou traitements ? (plusieurs choix possibles)",
    multi: true,
    options: [
      { value: "grossesse", label: "Grossesse ou allaitement" },
      { value: "anticoagulant", label: "Traitement anticoagulant / antiagrégant" },
      { value: "hypertension", label: "Hypertension artérielle" },
      { value: "diabete", label: "Diabète (traité)" },
      { value: "thyroide", label: "Trouble thyroïdien" },
      { value: "autoimmun", label: "Maladie auto-immune" },
      { value: "foiePath", label: "Maladie du foie" },
      { value: "sedatif", label: "Traitement sédatif / anxiolytique / somnifère" },
      { value: "hormonal", label: "Traitement hormonal (pilule, THM, tamoxifène)" },
      { value: "antidépresseur", label: "Antidépresseur (ISRS, IMAO…)" },
      { value: "operateur", label: "Chirurgie programmée < 15 jours" },
      { value: "enfant", label: "Pour un enfant (< 12 ans)" },
      { value: "aucun", label: "Aucun de ces cas" },
    ],
  },
  {
    id: "forme",
    question: "Quelle forme préférez-vous ?",
    multi: false,
    options: [
      { value: "tisane", label: "Tisane / infusion", formes: ["infusion", "décoction", "macérat"] },
      { value: "gélule", label: "Gélules / extraits secs", formes: ["extrait", "gélule", "poudre"] },
      { value: "HE", label: "Huiles essentielles", formes: ["HE", "huile essentielle"] },
      { value: "indifferent", label: "Sans préférence", formes: null },
    ],
  },
];

/* ── Base de contre-indications par mot-clé ──────────────────── */
const CONTRA_FLAGS = [
  { flag: "grossesse", pattern: /grossesse|enceinte|allaitement|avortif|CONTRE-INDIQUÉE.*grossesse/i, hard: true, msg: "contre-indiquée pendant la grossesse / allaitement" },
  { flag: "anticoagulant", pattern: /anticoagulant|antiagrégant|warfarine/i, hard: false, msg: "prudence avec les anticoagulants" },
  { flag: "hypertension", pattern: /hypertension/i, hard: true, msg: "contre-indiquée en cas d'hypertension" },
  { flag: "diabete", pattern: /antidiabét|glycémie|diabète/i, hard: false, msg: "peut modifier la glycémie" },
  { flag: "thyroide", pattern: /thyroïd/i, hard: false, msg: "agit sur la thyroïde" },
  { flag: "autoimmun", pattern: /auto-immune|immunosuppresseur/i, hard: true, msg: "contre-indiquée en maladie auto-immune" },
  { flag: "foiePath", pattern: /hépatotoxique|hépatite/i, hard: true, msg: "risque hépatique" },
  { flag: "sedatif", pattern: /sédatif|somnifère|anxiolytique/i, hard: false, msg: "potentialise les sédatifs" },
  { flag: "hormonal", pattern: /tamoxifène|œstrog|oestrog|hormonal|hormonodépendant|isoflavone|pilule/i, hard: true, msg: "interaction hormonale" },
  { flag: "antidépresseur", pattern: /antidépresseur|IMAO|ISRS/i, hard: true, msg: "interaction avec les antidépresseurs" },
  { flag: "operateur", pattern: /chirurgie|anticoagulants.*arrêt/i, hard: false, msg: "à arrêter avant une chirurgie" },
  { flag: "enfant", pattern: /enfant|nourrisson/i, hard: true, msg: "prudence ou contre-indication chez l'enfant" },
];

/* ── Moteur de recommandation ────────────────────────────────── */
function planteProblemFlags(p, answers) {
  const text = [p.precaution, p.interactions, p.grossesse, p.actifs].join(" ");
  const flags = new Set();
  for (const c of CONTRA_FLAGS) {
    if (answers[c.flag] && c.pattern.test(text)) flags.add(c);
  }
  return flags;
}

function scoreAssoc(a, answers) {
  const objectifs = answers.objectifTags || [];
  const forme = answers.formeFormes || null;
  let score = 0;
  const reasons = [];
  const warnings = [];
  let hardBlock = false;

  // 1. Correspondance objectif ↔ plantes de l'association
  for (const nomPlante of a.plantes) {
    const p = PLANTES.find((x) => x.nom === nomPlante);
    if (!p) continue;
    const common = p.bienfaits.filter((b) => objectifs.includes(b));
    score += common.length * 3;
    if (common.length) reasons.push(`${p.nom} (${common.join(", ").toLowerCase()})`);

    // 2. Contre-indications
    const flags = planteProblemFlags(p, answers);
    for (const f of flags) {
      if (f.hard) { hardBlock = true; warnings.push(`${p.nom} : ${f.msg}`); }
      else { score -= 2; warnings.push(`${p.nom} : ${f.msg} — avis conseillé`); }
    }

    // 3. Préférence de forme
    if (forme) {
      const gal = (p.formes || "").toLowerCase() + " " + (p.preparation || "").toLowerCase();
      if (forme.some((f) => gal.includes(f))) score += 1;
    }
  }

  // Bonus : Objectif mentionné dans l'effet de l'association
  const objNorm = norm(answers.objectifLabel || "");
  if (objNorm && (norm(a.objectif).includes(objNorm.split(" ")[0]) || norm(a.effet).includes(objNorm.split(" ")[0]))) {
    score += 4;
  }

  return { a, score, reasons, warnings, hardBlock };
}

export function recommander(answers) {
  const scored = ASSOCIATIONS.map((a) => scoreAssoc(a, answers));
  const valid = scored.filter((s) => !s.hardBlock);
  const refused = scored.filter((s) => s.hardBlock);
  valid.sort((x, y) => y.score - x.score);
  const top3 = valid.slice(0, 3).filter((s) => s.score > 0);
  return { top3, refused: refused.slice(0, 3) };
}

/* ── Chat : détection d'intention à mots-clés ────────────────── */
const INTENTS = [
  { key: /^Bonjour|Bonsoir|Salut|Hello/i, reply: () => "Bonjour ! 🌿 Je suis votre guide phytothérapeutique. Dites-moi ce qui vous préoccupe (sommeil, digestion, stress…) ou lancez le questionnaire complet." },
  { key: /sommeil|dorm|dors|dort|insomnie|nuit|endorm/i, reply: (ctx) => ctx.reco(["Sommeil", "Anxiété"], "Pour le sommeil, le trio classique valériane-passiflore-lavande est le plus documenté. Évitez les écrans avant la tisane 😴") },
  { key: /stress|anxi|angoisse|nerf|calme/i, reply: (ctx) => ctx.reco(["Anxiété", "Nerfs"], "Pour le stress, mélisse + aubépine + passiflore apaisent sans somnolence marquée. La respiration lente double l'effet 🌿") },
  { key: /digestion|ballonn|ventre|estomac|gaz/i, reply: (ctx) => ctx.reco(["Digestion", "Ballonnements"], "Après les repas : camomille, menthe et fenouil sont la base. Évitez la menthe en cas de reflux ⚠") },
  { key: /immunit|rhume|grippe|défens|defense|toux/i, reply: (ctx) => ctx.reco(["Immunité", "Antiviral"], "En prévention : échinacée en cures courtes. À l'installation : sureau + thym + gingembre en décoction chaude 🔥") },
  { key: /articul|arthrose|douleur|rhumat|genou|dos/i, reply: (ctx) => ctx.reco(["Articulations", "Anti-inflammatoire"], "Le curcuma (avec poivre et corps gras !), le cassis et l'harpagophytum forment le trio anti-inflammatoire de référence 🦴") },
  { key: /circul|jambes|veine/i, reply: (ctx) => ctx.reco(["Circulation", "Drainage"], "Vigne rouge + cyprès en interne, douches froides en complément. Bougez vos mollets 🚶") },
  { key: /foie|détox|detox/i, reply: (ctx) => ctx.reco(["Foie", "Drainage"], "Romarin + pissenlit + artichaut en cure de 3 semaines au changement de saison. Attention si obstruction biliaire ⚠") },
  { key: /peau|acné|acne|ecz[eé]/i, reply: (ctx) => ctx.reco(["Peau", "Cicatrisant"], "La peau se traite de l'intérieur : bardane + pensée + pissenlit en drainage, et de l'extérieur avec des macérats huileux 🌼") },
  { key: /m[eé]nopause|bouff[eé]/i, reply: (ctx) => ctx.reco(["Bouffées de chaleur"], "Sauge (sauf antécédent hormonodépendant !), actée à grappes noires et trèfle rouge sont les plus étudiés 🌸") },
  { key: /merci/i, reply: () => "Avec plaisir ! N'oubliez pas : les plantes sont des médecines — respectez les posologies et consultez en cas de doute 💚" },
  { key: /grossesse|enceinte/i, reply: () => "⚠ Pendant la grossesse, beaucoup de plantes sont contre-indiquées (sauge, réglisse, millepertuis…). Lancez le questionnaire avec « Grossesse » coché : je filtrerai les recommandations." },
  { key: /help|aide|comment/i, reply: () => "Je peux : ① vous recommander des associations par mots-clés (tape « sommeil », « digestion »…), ② filtrer selon vos traitements via le questionnaire complet, ③ expliquer une plante (tape son nom)." },
];

export function chatReply(message, recoFn) {
  const msg = message.trim();
  const ctx = {
    reco: (tags, intro) => {
      const recos = recoFn(tags);
      return { intro, recos };
    },
  };
  // Plante par nom exact ?
  const p = PLANTES.find((x) => norm(x.nom) === norm(msg) || norm(x.latin) === norm(msg));
  if (p) return { type: "plante", plante: p };
  for (const intent of INTENTS) {
    if (intent.key.test(msg)) {
      const r = intent.reply(ctx);
      if (typeof r === "string") return { type: "texte", texte: r };
      return { type: "reco", intro: r.intro, recos: r.recos };
    }
  }
  return {
    type: "texte",
    texte: "Je n'ai pas saisi le sujet. Essayez un mot-clé : sommeil, stress, digestion, immunité, articulations, circulation, foie, peau, ménopause… ou lancez le questionnaire complet ci-dessus 🌿",
  };
}
