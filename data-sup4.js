// Cinquième vague — 10 associations pour les plantes restées sans recette.
// Chaque recette fait entrer au moins une plante « orpheline » (0 recette) dans la base.
// Précautions alignées sur les fiches (ESCOP, OMS, Wood, monographies EMA).

export const ASSOCIATIONS_SUP4 = [
  {
    id: "repos-du-soir-profond",
    nom: "Repos du soir profond",
    objectif: "Insomnie du soir et nervosité",
    plantes: ["Laitue vireuse", "Scutellaire"],
    effet: "Le lactucarium doux de la laitue vireuse prépare au sommeil, la scutellaire détend les tensions nerveuses sans gêne au réveil.",
    temps: "2 min + 10 min d'infusion",
    ingredients: [
      "1 c. à café de feuilles de laitue vireuse séchées (1,5 g)",
      "1 c. à café de parties aériennes de scutellaire (1,5 g)",
      "300 ml d'eau"
    ],
    preparation: [
      "Verser l'eau frémissante sur le mélange.",
      "Couvrir et infuser 10 minutes.",
      "Filtrer et boire tiède 30 à 45 minutes avant le coucher."
    ],
    posologie: "1 tasse le soir, cure de 3 semaines.",
    conservation: "Mélange sec : 12 mois au sec et à l'abri de la lumière.",
    avertissement: "Potentialise les somnifères et sédatifs : avis médical en cas de traitement. Déconseillée en grossesse."
  },
  {
    id: "lumiere-d-hiver",
    nom: "Lumière d'hiver",
    objectif: "Coup de blues saisonnier",
    plantes: ["Millepertuis", "Verveine citronnée"],
    effet: "Le millepertuis soutient l'humeur sur la durée, la verveine citronnée détend les tensions sans assombrir la vigilance.",
    temps: "2 min + 10 min d'infusion",
    ingredients: [
      "1,5 g de sommités fleuries de millepertuis",
      "1 g de feuilles de verveine citronnée",
      "300 ml d'eau"
    ],
    preparation: [
      "Verser l'eau à 85 °C sur le mélange.",
      "Couvrir et infuser 10 minutes.",
      "Filtrer, boire le matin et à midi (cure de 4 à 6 semaines)."
    ],
    posologie: "1 à 2 tasses par jour, jamais le soir.",
    conservation: "Mélange sec : 12 mois.",
    avertissement: "Nombreuses interactions (pilule, anticoagulants, antidépresseurs, immunosuppresseurs) : avis pharmacien obligatoire. Photosensibilisation possible."
  },
  {
    id: "voix-et-poitrine-claire",
    nom: "Voix et poitrine claire",
    objectif: "Enrouement et toux sèche",
    plantes: ["Hysope", "Serpolet (thym sauvage)"],
    effet: "L'hysope adoucit les muqueuses et éclaircit la voix, le serpolet apporte son thymol antiseptique aux voies respiratoires.",
    temps: "10 min d'infusion",
    ingredients: [
      "1 g de sommités fleuries d'hysope",
      "1 g de serpolet (thym sauvage)",
      "300 ml d'eau",
      "1 c. à café de miel (facultatif)"
    ],
    preparation: [
      "Verser l'eau frémissante sur le mélange.",
      "Couvrir et infuser 10 minutes.",
      "Filtrer, boire chaud en petites gorgées.",
      "En conserver une part tiède pour un gargarisme en fin de journée."
    ],
    posologie: "2 à 3 tasses par jour, cure de 5 à 7 jours.",
    conservation: "Mélange sec : 12 mois.",
    avertissement: "L'huile essentielle d'hysope est contre-indiquée (épilepsie, grossesse) : ici, infusion de plante seule aux doses usuelles."
  },
  {
    id: "ouverture-digestive",
    nom: "Ouverture digestive",
    objectif: "Manque d'appétit et digestion lente",
    plantes: ["Gentiane jaune", "Romarin"],
    effet: "Les amers de la gentiane déclenchent la salivation et les sucs digestifs, le romarin chaperonne la phase biliaire.",
    temps: "10 min de décoction",
    ingredients: [
      "1 g de racines de gentiane jaune coupées",
      "1 g de feuilles de romarin",
      "300 ml d'eau"
    ],
    preparation: [
      "Décoction : porter la gentiane à petit feu 10 minutes.",
      "Hors du feu, ajouter le romarin et laisser infuser 5 minutes.",
      "Filtrer, boire tiède 20 minutes avant le repas principal."
    ],
    posologie: "1 tasse avant le repas du midi, cure de 2 semaines maximum.",
    conservation: "Racines et feuilles sèches : 18 mois.",
    avertissement: "Déconseillée en grossesse, en cas d'ulcère actif ou d'hypertension non contrôlée (amers)."
  },
  {
    id: "eaux-calmes",
    nom: "Eaux calmes",
    objectif: "Gêne urinaire récidivante",
    plantes: ["Maïs (stigmates)", "Épilobe", "Canneberge"],
    effet: "Les stigmates de maïs augmentent le volume urinaire, l'épilobe apaise la muqueuse, la canneberge limite l'adhésion des bactéries.",
    temps: "10 min d'infusion",
    ingredients: [
      "1 g de stigmates de maïs",
      "1 g de parties aériennes d'épilobe",
      "300 ml d'eau",
      "1 c. à soupe de jus de canneberge non sucré (ou 250 mg d'extrait)"
    ],
    preparation: [
      "Infuser maïs et épilobe 10 minutes à couvert.",
      "Filtrer, laisser tiédir.",
      "Ajouter le jus de canneberge hors cuisson et boire."
    ],
    posologie: "2 tasses par jour, cure de 10 jours par mois.",
    conservation: "Mélange sec : 12 mois.",
    avertissement: "Fièvre, douleur lombaire ou sang dans les urines : consultation médicale sans délai (infection à traiter)."
  },
  {
    id: "cataplasme-du-sportif",
    nom: "Cataplasme du sportif (usage externe)",
    objectif: "Contusions et douleurs locales",
    plantes: ["Consoude (externe)", "Reine-des-prés"],
    effet: "L'allantoïne de la consoude favorise la réparation des tissus, les salicylates naturels de la reine-des-prés calment la douleur locale.",
    temps: "10 min de décoction + 20 min d'application",
    ingredients: [
      "2 g de racine de consoude coupée (usage externe uniquement)",
      "2 g de sommités fleuries de reine-des-prés",
      "250 ml d'eau",
      "une gaze stérile"
    ],
    preparation: [
      "Décoction 10 minutes à couvert, puis laisser tiédir.",
      "Imbiber la gaze, poser sur la zone 20 minutes.",
      "Retirer, laisser sécher à l'air libre. 1 à 2 fois par jour."
    ],
    posologie: "Applications locales sur peau intacte, 10 jours maximum.",
    conservation: "Préparer à l'usage ; plantes sèches : 18 mois.",
    avertissement: "Consoude : jamais sur plaie ouverte ni par voie interne (alcaloïdes hépatotoxiques). Reine-des-prés : éviter en cas d'allergie à l'aspirine."
  },
  {
    id: "inhalation-des-pins",
    nom: "Inhalation des pins",
    objectif: "Bronches encombrées (inhalation)",
    plantes: ["Pin sylvestre", "Eucalyptus radié"],
    effet: "Les aiguilles de pin libèrent des vapeurs balsamiques, l'eucalyptus radié (1,8-cinéole) fluidifie les sécrétions.",
    temps: "10 min de décoction + 8 min d'inhalation",
    ingredients: [
      "3 g d'aiguilles de pin sylvestre (ou bourgeons)",
      "250 ml d'eau",
      "1 goutte d'huile essentielle d'eucalyptus radié"
    ],
    preparation: [
      "Décoction des aiguilles 10 minutes à couvert.",
      "Verser dans un grand bol, laisser tiédir à 45-50 °C.",
      "Ajouter l'huile essentielle, inhaler la vapeur 8 minutes tête couverte.",
      "Respirer calmement par le nez et la bouche."
    ],
    posologie: "1 à 2 inhalations par jour pendant la phase encombrée.",
    conservation: "Aiguilles sèches : 12 mois.",
    avertissement: "Interdite aux enfants de moins de 6 ans et aux asthmatiques sévères (HE) ; prudence brûlures — eau jamais bouillante."
  },
  {
    id: "isoflavones-au-quotidien",
    nom: "Isoflavones au quotidien",
    objectif: "Ménopause : soutien isoflavones",
    plantes: ["Soja (isoflavones)", "Trèfle rouge"],
    effet: "Les isoflavones de soja et les flavones du trèfle rouge atténuent l'intensité des bouffées de chaleur sur la durée.",
    temps: "10 min d'infusion",
    ingredients: [
      "1,5 g de fleurs séchées de trèfle rouge",
      "250 ml d'eau",
      "100 ml de lait de soja (non sucré)"
    ],
    preparation: [
      "Infuser le trèfle rouge 10 minutes à couvert.",
      "Filtrer, mélanger au lait de soja tiède.",
      "Boire le matin, en cure longue."
    ],
    posologie: "1 boisson par jour, cure de 3 mois avec bilan à mi-parcours.",
    conservation: "Fleurs séchées : 12 mois.",
    avertissement: "À éviter en cas de cancer hormonodépendant ou d'antécédent familial proche sans avis oncologue."
  },
  {
    id: "flore-en-equilibre",
    nom: "Flore en équilibre",
    objectif: "Fermentations intestinales",
    plantes: ["Noyer", "Origan"],
    effet: "La juglone du brou de noyer limite fermentations et levures, l'origan apporte carvacrol et thymol équilibrants.",
    temps: "10 min d'infusion",
    ingredients: [
      "1 g de feuilles de noyer",
      "1 g de feuilles d'origan",
      "300 ml d'eau"
    ],
    preparation: [
      "Verser l'eau frémissante sur le mélange.",
      "Couvrir et infuser 10 minutes.",
      "Filtrer, boire avant les deux principaux repas."
    ],
    posologie: "2 tasses par jour, cure courte de 7 à 10 jours.",
    conservation: "Feuilles sèches : 12 mois.",
    avertissement: "Cure courte uniquement (tanins) ; déconseillée en grossesse et en cas de traitement antidiabétique (hypoglycémie possible)."
  },
  {
    id: "estomac-en-paix",
    nom: "Estomac en paix",
    objectif: "Reflux et estomac sensible",
    plantes: ["Réglisse DGL (déglycyrrhizinée)", "Guimauve"],
    effet: "La réglisse DGL stimule la protection de la muqueuse sans effet tensionnel, les mucilages de guimauve tapissent l'estomac.",
    temps: "12 h de macération",
    ingredients: [
      "1,5 g de racines de guimauve",
      "1 comprimé (ou ¼ de c. à café) de réglisse DGL à croquer",
      "300 ml d'eau"
    ],
    preparation: [
      "Macérer la guimauve 12 h dans l'eau froide (mucilages préservés).",
      "Filtrer, boire tiède 20 minutes avant le repas.",
      "Croquer le comprimé de DGL au même moment."
    ],
    posologie: "2 prises par jour avant repas, cure de 3 semaines.",
    conservation: "Racines sèches : 18 mois ; DGL : date du flacon.",
    avertissement: "La DGL est choisie ici pour éviter l'hypertension de la réglisse classique ; brûlures persistantes ou nocturnes : avis médical."
  },
];
