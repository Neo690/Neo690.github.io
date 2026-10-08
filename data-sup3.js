// Quatrième vague d'enrichissement — 20 plantes + 16 associations/recettes.
// Même schéma que data-sup.js / data-sup2.js (ESCOP, OMS, Wood, monographies EMA).
// Les associations citent exclusivement des noms de fiches exacts (base + vagues 1-3).

export const PLANTES_SUP3 = [
  {
    id: "baobab",
    nom: "Baobab",
    latin: "Adansonia digitata",
    famille: "Malvacées",
    image: null,
    emoji: "🌳",
    bienfaits: ["Énergie", "Digestion", "Antioxydant", "Microbiote"],
    parties: "Pulpe de fruit, feuilles",
    usages: "Fatigue passagère, transit paresseux, apport en fibres et vitamine C.",
    preparation: "1 à 2 c. à soupe de poudre de pulpe dans de l'eau ou un smoothie, 1 à 2 fois par jour.",
    actifs: "Fibres (50 %, dont pectines), vitamine C, polyphénols, minéraux (calcium, potassium, magnésium).",
    formes: "Poudre de pulpe, gélules, infusion de feuilles.",
    posologie: "5 à 15 g de poudre par jour, en dehors des prises de médicaments.",
    interactions: "Les fibres peuvent gêner l'absorption des médicaments : espacer de 2 heures.",
    grossesse: "Autorisée aux doses alimentaires.",
    precaution: "Commencer par de petites doses (fibres laxatives)."
  },
  {
    id: "calendula",
    nom: "Calendula (souci)",
    latin: "Calendula officinalis",
    famille: "Astéracées",
    image: null,
    emoji: "🌼",
    bienfaits: ["Peau", "Cicatrisant", "Anti-inflammatoire", "Digestion"],
    parties: "Fleurs",
    usages: "Peaux irritées, petites plaies, gerçures ; en interne, troubles digestifs inflammatoires.",
    preparation: "Compresse : décoction 10 min (2 g/tasse) appliquée tiède ; interne : infusion 10 min.",
    actifs: "Triterpènes (faradiol), flavonoïdes, caroténoïdes, huile essentielle.",
    formes: "Macérat huileux, onguent, compresse, infusion, teinture-mère.",
    posologie: "1 à 2 tasses par jour en interne ; applications locales 1 à 2 fois par jour.",
    interactions: "Pas d'interaction majeure connue en usage externe.",
    grossesse: "Usage externe autorisé ; usage interne modéré.",
    precaution: "Allergie possible aux Astéracées ; ne pas appliquer sur plaie infectée."
  },
  {
    id: "ciste",
    nom: "Ciste ladanifère",
    latin: "Cistus ladanifer",
    famille: "Cistacées",
    image: null,
    emoji: "🌺",
    bienfaits: ["Immunité", "Antiseptique", "Gorge", "Antioxydant"],
    parties: "Feuilles, rameaux",
    usages: "Prévention hivernale, maux de gorge, infections ORL à répétition.",
    preparation: "Infusion 10 min (1,5 g/tasse), en gargarisme ou en boisson.",
    actifs: "Polyphénols (labdanes, flavonoïdes), huile essentielle, tanins.",
    formes: "Infusion, gargarisme, gélules, huile essentielle (avis professionnel).",
    posologie: "2 à 3 tasses par jour en période à risque ; gargarisme 3 fois par jour.",
    interactions: "Pas d'interaction majeure connue.",
    grossesse: "Autorisée aux doses usuelles.",
    precaution: "Ne remplace pas un traitement antibiotique prescrit en cas d'infection déclarée."
  },
  {
    id: "chaga",
    nom: "Chaga",
    latin: "Inonotus obliquus",
    famille: "Hymenochaetacées",
    image: null,
    emoji: "🍄",
    bienfaits: ["Immunité", "Antioxydant", "Énergie", "Digestion"],
    parties: "Sclérote (conk)",
    usages: "Renforcement immunitaire, fatigue, soutien antioxydant en hiver.",
    preparation: "Décoction douce 20 min (2 g/tasse) ou infusion prolongée de morceaux.",
    actifs: "Bêta-glucanes, triterpènes (acides betuliniques), mélanine, polysaccharides.",
    formes: "Décoction, poudre, gélules, teinture.",
    posologie: "1 à 2 tasses par jour en cure de 3 à 4 semaines.",
    interactions: "Prudence avec les anticoagulants et les antidiabétiques.",
    grossesse: "Déconseillée (données insuffisantes).",
    precaution: "Éviter en cas de maladie rénale (oxalates) ou de traitement anticoagulant."
  },
  {
    id: "eglantier",
    nom: "Églantier (rose musquée)",
    latin: "Rosa canina",
    famille: "Rosacées",
    image: null,
    emoji: "🌹",
    bienfaits: ["Articulations", "Immunité", "Antioxydant", "Vitamine C"],
    parties: "Faux-fruits (cynorhodons), pétales",
    usages: "Douleurs articulaires légères (arthrose du genou), renfort immunitaire hivernal.",
    preparation: "Décoction des fruits séchés 15 min (2 g/tasse) ; poudre standardisée en gélules.",
    actifs: "Vitamine C, galactolipides (GOPO), caroténoïdes, pectines.",
    formes: "Décoction, poudre, gélules, sirop, confiture.",
    posologie: "5 à 10 g de poudre par jour (arthrose : 5 g standardisés) en cure de 3 mois.",
    interactions: "Pas d'interaction majeure connue.",
    grossesse: "Autorisée aux doses usuelles.",
    precaution: "Retirer les poils internes (irritants) avant préparation."
  },
  {
    id: "framboisier",
    nom: "Framboisier",
    latin: "Rubus idaeus",
    famille: "Rosacées",
    image: null,
    emoji: "🫐",
    bienfaits: ["Féminin", "Utérus", "Astringent", "Digestion"],
    parties: "Feuilles",
    usages: "Préparation au dernier trimestre de grossesse (tradition), règles douloureuses, diarrhée légère.",
    preparation: "Infusion 10 min (1,5 à 2 g/tasse), 1 à 3 tasses par jour selon l'usage.",
    actifs: "Fragarine (tanin), flavonoïdes, acides fruités, vitamine C.",
    formes: "Infusion, teinture-mère, gélules.",
    posologie: "Grossesse : uniquement à partir du 3e trimestre, sur avis de sage-femme.",
    interactions: "Pas d'interaction majeure connue.",
    grossesse: "Début de grossesse : déconseillé ; 3e trimestre : avis professionnel.",
    precaution: "Ne déclenche pas l'accouchement mais tonifie l'utérus : encadrement requis."
  },
  {
    id: "fumeterre",
    nom: "Fumeterre",
    latin: "Fumaria officinalis",
    famille: "Papavéracées",
    image: null,
    emoji: "🌿",
    bienfaits: ["Foie", "Digestion", "Peau", "Drainage"],
    parties: "Sommités fleuries",
    usages: "Cures de drainage hépatique et biliaire, digestion difficile, peaux mixtes à imperfections.",
    preparation: "Infusion 5 à 10 min (1,5 g/tasse), 2 tasses par jour en cure courte.",
    actifs: "Alcaloïdes (fumarine, protopine), flavonoïdes, acides organiques.",
    formes: "Infusion, extrait fluide, teinture-mère.",
    posologie: "Cures de 10 jours par mois maximum (1,5 à 3 g/jour).",
    interactions: "Potentialisation possible des hypotenseurs et des somnifères.",
    grossesse: "Déconseillée.",
    precaution: "Toxicité hépatique possible à forte dose ou en cures prolongées : respecter les cures courtes."
  },
  {
    id: "goji",
    nom: "Baie de goji",
    latin: "Lycium barbarum",
    famille: "Solanacées",
    image: null,
    emoji: "🔴",
    bienfaits: ["Antioxydant", "Vision", "Énergie", "Immunité"],
    parties: "Baies (fraîches ou séchées)",
    usages: "Fatigue oculaire, soutien antioxydant, énergie générale.",
    preparation: "10 à 20 g de baies réhydratées par jour, ou décoction douce 10 min.",
    actifs: "Zéaxanthine, polysaccharides (LBP), caroténoïdes, vitamine C.",
    formes: "Baies séchées, poudre, jus.",
    posologie: "10 à 30 g de baies séchées par jour en cure de 1 à 3 mois.",
    interactions: "Interaction documentée avec la warfarine (risque hémorragique).",
    grossesse: "Autorisée aux doses alimentaires.",
    precaution: "Allergies croisées possibles (pollens) ; prudence avec les anticoagulants."
  },
  {
    id: "griffonia",
    nom: "Griffonia",
    latin: "Griffonia simplicifolia",
    famille: "Fabacées",
    image: null,
    emoji: "🫘",
    bienfaits: ["Humeur", "Sommeil", "Compulsions", "Stress"],
    parties: "Graines",
    usages: "Humeur dépressive légère, sommeil difficile, grignotage émotionnel.",
    preparation: "Extrait sec titré en 5-HTP, en gélules, au coucher ou en 2 prises.",
    actifs: "5-hydroxytryptophane (5-HTP, 3 à 7 % des graines), leptine végétale.",
    formes: "Extrait sec standardisé (gélules) uniquement.",
    posologie: "50 à 200 mg de 5-HTP par jour, en cure de 6 à 8 semaines.",
    interactions: "Formellement contre-indiqué avec les antidépresseurs (risque de syndrome sérotoninergique).",
    grossesse: "Déconseillé.",
    precaution: "Ne pas associer à un traitement sérotoninergique sans avis médical strict."
  },
  {
    id: "lithothamne",
    nom: "Lithothamne",
    latin: "Lithothamnium calcareum",
    famille: "Corallinacées (algue rouge)",
    image: null,
    emoji: "🪸",
    bienfaits: ["Ossature", "Digestion", "Minéralisation", "Reflux"],
    parties: "Thalle calcaire (maërl)",
    usages: "Reminéralisation, prévention de la perte osseuse, acidité d'estomac (antiacide doux).",
    preparation: "1 c. à café de poudre dans un grand verre d'eau, en dehors des repas.",
    actifs: "Calcium (32-34 %) assimilable, magnésium, silicium, 74 minéraux et oligo-éléments.",
    formes: "Poudre, gélules, comprimés.",
    posologie: "1 à 3 g de poudre par jour, cures de 1 à 3 mois.",
    interactions: "Espace de 2 heures avec les antibiotiques et le fer (calcium).",
    grossesse: "Autorisée aux doses usuelles.",
    precaution: "Éviter en cas de lithiase calcique (calculs) ou d'hypercalcémie."
  },
  {
    id: "maca",
    nom: "Maca",
    latin: "Lepidium meyenii",
    famille: "Brassicacées",
    image: null,
    emoji: "🥔",
    bienfaits: ["Énergie", "Libido", "Endurance", "Humeur"],
    parties: "Racine",
    usages: "Asténie physique et sexuelle, soutien de l'endurance, humeur.",
    preparation: "1 à 2 c. à café de poudre de racine cuite (gelatinisée) par jour.",
    actifs: "Macamides, macaènes, glucosinolates, acides aminés, fer.",
    formes: "Poudre gelatinisée, gélules, extraits secs.",
    posologie: "1,5 à 5 g par jour, en cure de 6 à 8 semaines, le matin.",
    interactions: "Prudence avec les traitements de la thyroïde (goitrigènes).",
    grossesse: "Déconseillée (données insuffisantes).",
    precaution: "Débuter par de petites doses ; éviter en cas d'hyperthyroïdie."
  },
  {
    id: "melilot",
    nom: "Mélilot",
    latin: "Melilotus officinalis",
    famille: "Fabacées",
    image: null,
    emoji: "🌼",
    bienfaits: ["Jambes", "Circulation", "Lymphatique", "Anti-inflammatoire"],
    parties: "Sommités fleuries",
    usages: "Jambes lourdes, hémorroïdes, insuffisance veineuse et lymphatique légère.",
    preparation: "Infusion 5 min (1 g/tasse), 1 à 2 tasses par jour.",
    actifs: "Coumarines (mélilotoside), flavonoïdes, saponines.",
    formes: "Infusion, extrait sec, teinture-mère, cataplasme.",
    posologie: "1 à 2 g par jour en cures de 3 semaines.",
    interactions: "Potentialisation possible des anticoagulants (coumarines).",
    grossesse: "Déconseillée.",
    precaution: "Ne jamais laisser macérer (coumarines → dicoumarol) ; arrêt avant chirurgie."
  },
  {
    id: "marron-dinde",
    nom: "Marron d'Inde",
    latin: "Aesculus hippocastanum",
    famille: "Sapindacées",
    image: null,
    emoji: "🌰",
    bienfaits: ["Jambes", "Veines", "Hémorroïdes", "Anti-inflammatoire"],
    parties: "Écorce de graine (standardisée)",
    usages: "Insuffisance veineuse, jambes lourdes, hémorroïdes, varices.",
    preparation: "Extrait sec titré en escine (gélules) ; décoction réservée à l'usage externe.",
    actifs: "Escine (saponines triterpéniques), aesculine, flavonoïdes.",
    formes: "Extrait sec standardisé, gel veineux, bains dérivatifs.",
    posologie: "100 à 150 mg d'escine par jour, en cure de 2 à 3 mois.",
    interactions: "Prudence avec les anticoagulants et antidiabétiques.",
    grossesse: "Déconseillé (usage interne).",
    precaution: "Graines et écorce crues toxiques : uniquement des extraits standardisés."
  },
  {
    id: "orme-rouge",
    nom: "Orme rouge (orme glabre)",
    latin: "Ulmus rubra",
    famille: "Ulmacées",
    image: null,
    emoji: "🌳",
    bienfaits: ["Gorge", "Digestion", "Ulcères", "Apaisant"],
    parties: "Écorce interne",
    usages: "Irritations de la gorge, toux sèche, gastrite, pyrosis, transit irrité.",
    preparation: "1 c. à café de poudre délayée à froid puis chauffée (bouillie mucilagineuse).",
    actifs: "Mucilages (50 %), tanins, procyanidines.",
    formes: "Poudre, pastilles à sucer, bouillie, gélules.",
    posologie: "2 à 3 prises par jour, à distance des médicaments.",
    interactions: "Les mucilages ralentissent l'absorption des médicaments : espacer de 2 heures.",
    grossesse: "Autorisée aux doses usuelles.",
    precaution: "Espèces d'orme menacées : privilégier des sources certifiées durables."
  },
  {
    id: "pensee-sauvage",
    nom: "Pensée sauvage",
    latin: "Viola tricolor",
    famille: "Violacées",
    image: null,
    emoji: "🌸",
    bienfaits: ["Peau", "Eczéma", "Drainage", "Toux"],
    parties: "Parties aériennes fleuries",
    usages: "Acné, eczéma sec, dartres (cure de fond), toux sèche irritative.",
    preparation: "Infusion 10 min (1,5 g/tasse), 2 à 3 tasses par jour en cure de 3 semaines.",
    actifs: "Flavonoïdes (violanthine), saponines, mucilages, salicylates traces.",
    formes: "Infusion, teinture-mère, extrait fluide, cataplasme.",
    posologie: "3 à 6 g par jour en cures de 3 semaines (cures « beauté de la peau »).",
    interactions: "Association possible avec les salicylés : prudence cumulée.",
    grossesse: "Autorisée aux doses usuelles.",
    precaution: "Allergie possible aux violacées (rares)."
  },
  {
    id: "queue-de-cheval",
    nom: "Prêle des champs (queue-de-cheval)",
    latin: "Equisetum arvense",
    famille: "Équisétacées",
    image: null,
    emoji: "🌿",
    bienfaits: ["Drainage", "Ossature", "Cicatrisant", "Circulation"],
    parties: "Tiges stériles",
    usages: "Drainage rénal doux, œdèmes légers, reminéralisation (silicium), cicatrisation.",
    preparation: "Infusion 10 min (2 g/tasse) ou macération à froid 12 h (diurèse plus douce).",
    actifs: "Silice (5-8 %), flavonoïdes (quercétine), saponines (équisétonine), potassium.",
    formes: "Infusion, macération, extrait sec, poudre.",
    posologie: "2 à 3 tasses par jour, cures de 3 semaines maximum.",
    interactions: "Possible potentialisation des diurétiques et antihypertenseurs.",
    grossesse: "Déconseillée (diurétisme).",
    precaution: "Éviter en cas d'œdème cardiaque ou rénal ; la thiaminase impose des cures courtes."
  },
  {
    id: "rose",
    nom: "Rose (pétales)",
    latin: "Rosa gallica",
    famille: "Rosacées",
    image: null,
    emoji: "🌹",
    bienfaits: ["Peau", "Humeur", "Astringent", "Antioxydant"],
    parties: "Pétales",
    usages: "Peaux sensibles (tonique externe), coup de blues léger, diarrhée légère.",
    preparation: "Infusion 5 min (1,5 g de pétales/tasse) ; eau de rose en brumisation externe.",
    actifs: "Huile essentielle (citronellol, géraniol), tanins, anthocyanes, flavonoïdes.",
    formes: "Infusion, eau de rose, macérat huileux, poudre.",
    posologie: "1 à 2 tasses par jour ; externe : 1 à 2 brumisations par jour.",
    interactions: "Pas d'interaction majeure connue.",
    grossesse: "Autorisée aux doses usuelles.",
    precaution: "Utiliser des pétales non traités (culture bio) et débarrassés de leurs parties blanches."
  },
  {
    id: "saule-blanc",
    nom: "Saule blanc",
    latin: "Salix alba",
    famille: "Salicacées",
    image: null,
    emoji: "🌳",
    bienfaits: ["Douleurs", "Articulations", "Fièvre", "Anti-inflammatoire"],
    parties: "Écorce",
    usages: "Douleurs articulaires et lombaires légères, céphalées, états fébriles bénins.",
    preparation: "Décoction 10 min (2,5 g d'écorce/tasse), 2 à 3 tasses par jour.",
    actifs: "Salicosides (précurseur de la salicyline), tanins, flavonoïdes.",
    formes: "Décoction, extrait sec titré, poudre.",
    posologie: "60 à 240 mg de salicine équivalente par jour, en cure courte.",
    interactions: "Cumul à éviter avec l'aspirine et les AINS ; potentialise les anticoagulants.",
    grossesse: "Contre-indiquée.",
    precaution: "Allergie à l'aspirine, asthme, ulcère actif : ne pas utiliser ; enfant de moins de 16 ans : non."
  },
  {
    id: "sarrasin",
    nom: "Sarrasin (blé noir)",
    latin: "Fagopyrum esculentum",
    famille: "Polygonacées",
    image: null,
    emoji: "🌾",
    bienfaits: ["Circulation", "Capillaires", "Antioxydant", "Microbiote"],
    parties: "Graines, parties aériennes",
    usages: "Fragilité capillaire (ecchymoses, varices), santé cardiovasculaire, transit.",
    preparation: "Infusion de parties aériennes 10 min ; graines germinées ou farine en alimentation.",
    actifs: "Rutine (2-5 % des parties aériennes), quercétine, protéines riches en lysine.",
    formes: "Infusion, poudre de graines, gélules de rutine, germinations.",
    posologie: "2 tasses par jour, ou 1 à 2 c. à soupe de poudre par jour.",
    interactions: "Prudence théorique avec les anticoagulants.",
    grossesse: "Autorisée aux doses alimentaires.",
    precaution: "Allergie au sarrasin possible (rare mais potentiellement sévère)."
  },
  {
    id: "verveine-officinale",
    nom: "Verveine officinale",
    latin: "Verbena officinalis",
    famille: "Verbénacées",
    image: null,
    emoji: "🌿",
    bienfaits: ["Digestion", "Stress", "Tension nerveuse", "Foie"],
    parties: "Parties aériennes",
    usages: "Tensions digestives liées au stress, irritabilité, soutien hépatique léger.",
    preparation: "Infusion 10 min (1,5 g/tasse), 1 à 3 tasses par jour.",
    actifs: "Iridoïdes (verbascoside), flavonoïdes, acide silicique.",
    formes: "Infusion, teinture-mère, extrait sec.",
    posologie: "1,5 à 4,5 g par jour, en cures de 2 à 3 semaines.",
    interactions: "Potentialisation possible des sédatifs.",
    grossesse: "Déconseillée (action éménagogue traditionnelle).",
    precaution: "À ne pas confondre avec la verveine citronnée (Aloysia) ni la mélisse."
  },
];

export const ASSOCIATIONS_SUP3 = [
  {
    id: "humeur-et-sommeil-leger",
    nom: "Humeur et sommeil léger",
    objectif: "Humeur fragile et sommeil léger",
    plantes: ["Griffonia", "Mélisse"],
    effet: "Le 5-HTP du griffonia soutient la production de sérotonine, la mélisse détend le système nerveux.",
    temps: "2 min + 10 min d'infusion",
    ingredients: [
      "1 c. à café de feuilles de mélisse (1,5 g)",
      "300 ml d'eau",
      "extrait de griffonia selon la posologie du flacon (le soir)"
    ],
    preparation: [
      "Verser l'eau frémissante sur la mélisse.",
      "Couvrir et infuser 10 minutes.",
      "Filtrer, boire tiède 30 min avant le coucher.",
      "Prendre la gélule de griffonia en même temps."
    ],
    posologie: "1 tasse + 1 prise le soir, cure de 6 à 8 semaines.",
    conservation: "Mélange sec : 12 mois au sec et à l'abri de la lumière.",
    avertissement: "Formellement incompatible avec les antidépresseurs et les traitements sérotoninergiques."
  },
  {
    id: "souplesse-articulaire",
    nom: "Souplesse articulaire",
    objectif: "Douleurs articulaires légères",
    plantes: ["Saule blanc", "Églantier (rose musquée)"],
    effet: "Les salicosides du saule calment la douleur, les galactolipides de l'églantier protègent le cartilage.",
    temps: "10 min de décoction",
    ingredients: [
      "2,5 g d'écorce de saule blanc",
      "2 g de cynorhodons d'églantier coupés",
      "400 ml d'eau"
    ],
    preparation: [
      "Porter l'eau à ébullition avec le saule blanc.",
      "Ajouter l'églantier et laisser frémir 10 minutes à couvert.",
      "Filtrer, boire chaud ou tiède."
    ],
    posologie: "2 tasses par jour, cure de 3 semaines à 3 mois.",
    conservation: "Écorces et fruits secs : 18 mois au sec.",
    avertissement: "À éviter avec l'aspirine, les AINS et les anticoagulants ; contre-indiqué en grossesse et avant 16 ans."
  },
  {
    id: "circulation-au-quotidien",
    nom: "Circulation au quotidien",
    objectif: "Insuffisance veineuse légère",
    plantes: ["Mélilot", "Marron d'Inde"],
    effet: "Les coumarines du mélilot et l'escine du marron d'Inde améliorent le tonus veineux et réduisent la sensation de jambes lourdes.",
    temps: "5 min d'infusion + gélules",
    ingredients: [
      "1 g de sommités fleuries de mélilot",
      "250 ml d'eau",
      "extrait de marron d'Inde titré en escine (le matin)"
    ],
    preparation: [
      "Infuser le mélilot 5 minutes à couvert (ne jamais laisser macérer).",
      "Filtrer et boire le matin.",
      "Prendre l'extrait de marron d'Inde au petit-déjeuner."
    ],
    posologie: "1 tasse + 1 prise le matin, cure de 2 mois.",
    conservation: "Mélilot sec : 6 mois (tanins et coumarines volatiles).",
    avertissement: "Prudence avec les anticoagulants ; arrêt avant toute chirurgie."
  },
  {
    id: "peau-qui-repare",
    nom: "Peau qui répare",
    objectif: "Peaux irritées et imperfections",
    plantes: ["Calendula (souci)", "Pensée sauvage"],
    effet: "La pensée sauvage draine par l'intérieur, le calendula apaise et répare par l'extérieur.",
    temps: "10 min d'infusion + compresse",
    ingredients: [
      "1,5 g de pensée sauvage",
      "2 g de fleurs de calendula (pour la compresse)",
      "300 ml d'eau",
      "1 c. à soupe de macérat huileux de calendula (après la compresse)"
    ],
    preparation: [
      "Infuser la pensée sauvage 10 minutes, filtrer, boire 2 tasses par jour.",
      "Préparer une décoction de calendula (10 min), laisser tiédir.",
      "Imbiber une gaze et poser 10 minutes sur la zone.",
      "Terminer par une fine couche de macérat huileux."
    ],
    posologie: "Cure interne de 3 semaines ; soin local 1 à 2 fois par jour.",
    conservation: "Plantes sèches : 12 mois ; macérat : 12 mois au frais.",
    avertissement: "Ne pas appliquer sur plaie infectée ; tester le macérat au pli du coude."
  },
  {
    id: "gorge-d-hiver",
    nom: "Gorge d'hiver",
    objectif: "Gorge irritée et prévention ORL",
    plantes: ["Ciste ladanifère", "Orme rouge (orme glabre)"],
    effet: "Le ciste assainit les muqueuses ORL, les mucilages de l'orme rouge les enveloppent et les apaisent.",
    temps: "10 min d'infusion",
    ingredients: [
      "1,5 g de feuilles de ciste",
      "1 c. à café de poudre d'écorce interne d'orme rouge",
      "250 ml d'eau"
    ],
    preparation: [
      "Infuser le ciste 10 minutes à couvert.",
      "Filtrer puis délayer la poudre d'orme dans la tisane chaude.",
      "Boire en petites gorgées, ou utiliser en gargarisme tiède."
    ],
    posologie: "2 à 3 prises par jour en période de fragilité ORL.",
    conservation: "Mélanges secs : 12 mois.",
    avertissement: "Une angine fébrile nécessite un avis médical."
  },
  {
    id: "ventre-en-fibres",
    nom: "Ventre en fibres",
    objectif: "Transit paresseux et microbiote",
    plantes: ["Baobab", "Orme rouge (orme glabre)"],
    effet: "Les pectines du baobab nourrissent le microbiote, les mucilages de l'orme rouge régulent et lubrifient le transit.",
    temps: "3 min de mélange",
    ingredients: [
      "1 c. à soupe de poudre de pulpe de baobab",
      "1 c. à café de poudre d'orme rouge",
      "250 ml d'eau ou de lait végétal",
      "1 c. à café de miel (facultatif)"
    ],
    preparation: [
      "Délayer l'orme rouge dans l'eau froide, chauffer doucement jusqu'à épaississement.",
      "Laisser tiédir puis ajouter le baobab et le miel.",
      "Boire le matin à jeun."
    ],
    posologie: "1 boisson par jour, cure de 3 semaines.",
    conservation: "Poudres sèches : 12 mois.",
    avertissement: "Espacer de 2 heures des médicaments ; débuter par de petites doses."
  },
  {
    id: "energie-des-hauts-plateaux",
    nom: "Énergie des hauts plateaux",
    objectif: "Endurance et fatigue chronique légère",
    plantes: ["Maca", "Rhodiola"],
    effet: "La maca soutient la vitalité physique et la libido, la rhodiola améliore la résistance au stress et l'endurance mentale.",
    temps: "3 min de préparation",
    ingredients: [
      "1 c. à café de poudre de maca gelatinisée",
      "extrait de rhodiola selon la posologie (matin)",
      "250 ml de lait végétal chaud ou jus"
    ],
    preparation: [
      "Délayer la maca dans le liquide chaud.",
      "Prendre l'extrait de rhodiola au petit-déjeuner.",
      "Renouveler chaque matin pendant la cure."
    ],
    posologie: "1 prise le matin, cure de 6 à 8 semaines.",
    conservation: "Poudre sèche : 12 mois.",
    avertissement: "Éviter en cas d'hyperthyroïdie ; prendre la rhodiola le matin (légère stimulation)."
  },
  {
    id: "mineraux-assimilables",
    nom: "Minéraux assimilables",
    objectif: "Reminéralisation et ossature",
    plantes: ["Lithothamne", "Prêle des champs (queue-de-cheval)"],
    effet: "Le calcium naturel du lithothamne et la silice organique de la prêle se complètent pour reminéraliser os, ongles et cheveux.",
    temps: "12 h de macération",
    ingredients: [
      "2 g de tiges stériles de prêle",
      "300 ml d'eau",
      "1 c. à café de poudre de lithothamne"
    ],
    preparation: [
      "Macérer la prêle 12 h dans l'eau froide, puis filtrer.",
      "Délayer le lithothamne dans la macération.",
      "Boire en 1 à 2 fois dans la journée."
    ],
    posologie: "1 boisson par jour, cures de 3 semaines par mois.",
    conservation: "Plantes sèches : 12 mois.",
    avertissement: "Éviter en cas de calculs rénaux calciques ; espacer des médicaments (calcium)."
  },
  {
    id: "drainage-du-printemps",
    nom: "Drainage du printemps",
    objectif: "Drainage rénal doux",
    plantes: ["Prêle des champs (queue-de-cheval)", "Bouleau"],
    effet: "Diurèse douce et respectueuse des reins, élimination des excès d'hiver.",
    temps: "12 h de macération",
    ingredients: [
      "1,5 g de prêle",
      "1,5 g de feuilles de bouleau",
      "400 ml d'eau"
    ],
    preparation: [
      "Macérer les deux plantes 12 h dans l'eau froide.",
      "Chauffer doucement sans bouillir, puis filtrer.",
      "Boire réparti sur la journée."
    ],
    posologie: "1 litre réparti sur la journée, cure de 3 semaines maximum.",
    conservation: "Mélange sec : 12 mois.",
    avertissement: "Déconseillé en grossesse et en cas d'œdème cardiaque ou rénal."
  },
  {
    id: "cycle-serein",
    nom: "Cycle serein",
    objectif: "Syndrome prémenstruel léger",
    plantes: ["Framboisier", "Sauge officinale"],
    effet: "Le framboisier tonifie l'utérus en douceur, la sauge régule les inconforts du cycle et limite les bouffées de chaleur.",
    temps: "10 min d'infusion",
    ingredients: [
      "1,5 g de feuilles de framboisier",
      "1 g de feuilles de sauge officinale",
      "300 ml d'eau"
    ],
    preparation: [
      "Verser l'eau à 90 °C sur le mélange.",
      "Couvrir et infuser 10 minutes.",
      "Filtrer, boire 1 à 2 tasses par jour dans la deuxième partie du cycle."
    ],
    posologie: "1 à 2 tasses par jour, du milieu de cycle aux règles.",
    conservation: "Mélange sec : 12 mois.",
    avertissement: "Déconseillé en début de grossesse ; la sauge est contre-indiquée en cas de cancer hormonodépendant."
  },
  {
    id: "dernier-trimestre",
    nom: "Dernier trimestre (préparation)",
    objectif: "Préparation à la fin de grossesse",
    plantes: ["Framboisier", "Mélisse"],
    effet: "Tradition de sage-femme : la feuille de framboisier préparerait l'utérus, la mélisse apaise les tensions du dernier mois.",
    temps: "10 min d'infusion",
    ingredients: [
      "1,5 g de feuilles de framboisier",
      "1 g de feuilles de mélisse",
      "300 ml d'eau"
    ],
    preparation: [
      "Infuser le mélange 10 minutes à couvert.",
      "Filtrer, boire tiède, 1 tasse par jour."
    ],
    posologie: "À partir du 8e mois uniquement, sur avis de sage-femme.",
    conservation: "Mélange sec : 12 mois.",
    avertissement: "Uniquement après validation de votre sage-femme ou médecin ; jamais en début de grossesse."
  },
  {
    id: "serenite-digestive",
    nom: "Sérénité digestive",
    objectif: "Digestion stressée et ballonnements",
    plantes: ["Verveine officinale", "Fenouil"],
    effet: "La verveine officinale détend les tensions digestives d'origine nerveuse, le fenouil expulse les gaz.",
    temps: "10 min d'infusion",
    ingredients: [
      "1,5 g de verveine officinale",
      "1 g de graines de fenouil écrasées",
      "300 ml d'eau"
    ],
    preparation: [
      "Écraser grossièrement les graines de fenouil.",
      "Verser l'eau frémissante, couvrir, infuser 10 minutes.",
      "Filtrer, boire après le repas du soir."
    ],
    posologie: "1 à 2 tasses par jour après les repas, cures de 2 à 3 semaines.",
    conservation: "Mélange sec : 12 mois.",
    avertissement: "Déconseillée en grossesse."
  },
  {
    id: "teint-frais",
    nom: "Teint frais",
    objectif: "Peau terne et cure hépatique légère",
    plantes: ["Rose (pétales)", "Fumeterre"],
    effet: "La fumeterre soutient le drainage hépatique et biliaire, les anthocyanes de la rose protègent et embellissent la peau.",
    temps: "10 min d'infusion",
    ingredients: [
      "1,5 g de fumeterre",
      "1,5 g de pétales de rose",
      "300 ml d'eau"
    ],
    preparation: [
      "Infuser la fumeterre 10 minutes.",
      "Ajouter les pétales de rose hors du feu, laisser infuser 3 minutes de plus.",
      "Filtrer, boire matin et soir pendant la cure."
    ],
    posologie: "2 tasses par jour, cure de 10 jours par mois.",
    conservation: "Mélange sec : 6 mois (pétales fragiles).",
    avertissement: "Respecter les cures courtes de fumeterre ; déconseillée en grossesse."
  },
  {
    id: "capillaires-proteges",
    nom: "Capillaires protégés",
    objectif: "Fragilité capillaire et varices",
    plantes: ["Sarrasin (blé noir)", "Vigne rouge"],
    effet: "La rutine du sarrasin et les anthocyanes de la vigne rouge renforcent la paroi des capillaires.",
    temps: "10 min d'infusion",
    ingredients: [
      "1,5 g de parties aériennes de sarrasin",
      "1,5 g de feuilles de vigne rouge",
      "300 ml d'eau"
    ],
    preparation: [
      "Verser l'eau frémissante sur le mélange.",
      "Couvrir et infuser 10 minutes.",
      "Filtrer, boire le matin et le soir."
    ],
    posologie: "2 tasses par jour, cure de 1 à 2 mois (surtout en été).",
    conservation: "Mélange sec : 12 mois.",
    avertissement: "Prudence théorique avec les anticoagulants."
  },
  {
    id: "immunite-des-forets",
    nom: "Immunité des forêts",
    objectif: "Renforcement immunitaire hivernal",
    plantes: ["Chaga", "Échinacée"],
    effet: "Les bêta-glucanes du chaga et l'immunostimulant classique échinacée forment un duo de fond pour passer l'hiver.",
    temps: "20 min de décoction",
    ingredients: [
      "2 g de chaga en morceaux ou poudre",
      "1 g de racine d'échinacée",
      "400 ml d'eau"
    ],
    preparation: [
      "Décoction : porter le chaga à petit feu 15 minutes.",
      "Ajouter l'échinacée, laisser 5 minutes de plus hors ébullition.",
      "Filtrer, boire tiède."
    ],
    posologie: "1 à 2 tasses par jour en période à risque, cure de 3 à 4 semaines.",
    conservation: "Chaga sec : 24 mois ; racines : 12 mois.",
    avertissement: "Éviter en cas de maladie rénale, de traitement anticoagulant ou immunosuppresseur."
  },
  {
    id: "vision-protegee",
    nom: "Vision protégée",
    objectif: "Fatigue oculaire et microcirculation",
    plantes: ["Baie de goji", "Ginkgo biloba"],
    effet: "La zéaxanthine du goji nourrit la macula, le ginkgo améliore la microcirculation rétinienne.",
    temps: "10 min de réhydratation",
    ingredients: [
      "15 g de baies de goji séchées",
      "extrait de ginkgo selon la posologie (matin)",
      "200 ml d'eau tiède"
    ],
    preparation: [
      "Réhydrater les baies 10 minutes dans l'eau tiède.",
      "Croquer les baies avec leur eau de réhydratation, en collation.",
      "Prendre l'extrait de ginkgo au petit-déjeuner."
    ],
    posologie: "Cure de 1 à 3 mois, pauses régulières.",
    conservation: "Baies séchées : 12 mois au frais et au sec.",
    avertissement: "Prudence avec les anticoagulants (goji et ginkgo) : avis professionnel requis."
  },
];
