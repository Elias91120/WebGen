// Knowledge base of the 3geeks.fr assistant (retrieval-augmented).
// Keep it in sync with the site: src/i18n.ts, src/components/ProjectsShowcase.tsx,
// src/components/TeamSection.tsx and src/components/SkillsRadar.tsx.
// Never add a postal address, a SIRET, a phone number, or the name/link of a private project.

// Always sent to the model: the facts most questions need.
export const CORE = `3geeks est un studio web et digital français (Made in France), cofondé par Elias Elloumi et Noam Leclapart-Jublot. Le studio conçoit et développe des sites vitrines, des plateformes web sur mesure, des applications mobiles et des outils d’IA ou d’automatisation, pour des clients en France et à l’international.
Offres web : Site Starter à 300 € (paiement unique, site d’une page) ; Projet web sur mesure (sur devis) ; Refonte complète (sur devis) ; Option Sérénité à 50 €/mois (maintenance).
Services IA pour entreprises (sur devis, après un audit gratuit de 30 min) : intégration de l’IA dans les logiciels existants (ERP, CRM, back-office), automatisation de la logistique et des opérations, agents IA (chat, e-mail, téléphone), traitement de documents et données, applications associées, cadrage et formation. Page dédiée : https://3geeks.fr/ia
Engagements : petites demandes livrées en 24 à 48 h ; rien à payer d’avance (règlement à la livraison, une fois le résultat validé, sans acompte) ; le code source et le nom de domaine appartiennent au client ; devis gratuit et sans engagement après un appel de 30 min.
Contact : réserver un appel gratuit de 30 min avec le bouton « Réserver un appel gratuit » du site ; écrire à contact@3geeks.fr (réponse sous 24 h) ; ou écrire à Elias ou à Noam sur LinkedIn.`;

// Retrieved by relevance. `keywords` add French/English synonyms to help matching.
export const CHUNKS = [
  {
    id: 'starter',
    title: 'Offre Site Starter (300 €)',
    keywords: ['starter', '300', 'vitrine', 'site simple', 'one-page', 'une page', 'landing', 'petit site', 'independant', 'artisan', 'commerce', 'restaurant', 'prix', 'tarif', 'combien', 'cout', 'budget', 'price', 'cost', 'showcase'],
    text: 'Le Site Starter coûte 300 €, en paiement unique. C’est un site d’une seule page (one-page), responsive et pensé d’abord pour le mobile, avec une offre claire, un appel à l’action, un design moderne et soigné, et un formulaire de contact ou un lien WhatsApp. Il convient pour présenter ou lancer une activité : restaurant, boutique, service, indépendant ou startup. Pour plusieurs pages ou des fonctionnalités en plus, on passe sur un projet sur mesure, avec devis gratuit.',
  },
  {
    id: 'custom',
    title: 'Offre Projet web sur mesure (sur devis)',
    keywords: ['sur mesure', 'devis', 'custom', 'plateforme', 'application web', 'web app', 'saas', 'e-commerce', 'ecommerce', 'boutique en ligne', 'paiement', 'stripe', 'reservation', 'booking', 'comptes', 'espace client', 'connexion', 'base de donnees', 'dashboard', 'tableau de bord', 'admin', 'back-office', 'integration', 'api', 'crm', 'marketplace', 'plusieurs pages', 'prix', 'tarif', 'combien'],
    text: 'Le Projet web sur mesure est sur devis, selon la complexité. Il reprend tout le Starter, adapté à votre offre, et peut ajouter : un parcours de réservation ou de demande, de l’e-commerce ou des paiements en ligne, des comptes utilisateurs et des données structurées, un dashboard d’administration sur mesure, et des intégrations avec vos outils. Exemples livrés : une plateforme SaaS juridique aux États-Unis (Express Divorce USA), une boutique Shopify reliée à la caisse du magasin (Green Jardin), une plateforme privée de signature de contrats. Le devis est gratuit, après un appel de 30 min.',
  },
  {
    id: 'redesign',
    title: 'Offre Refonte complète (sur devis)',
    keywords: ['refonte', 'refaire', 'moderniser', 'redesign', 'ancien site', 'site existant', 'ameliorer', 'audit', 'lent', 'performance', 'seo', 'referencement', 'wordpress', 'wix', 'migration', 'mise a niveau', 'rebuild'],
    text: 'La Refonte complète est sur devis (audit et mise à niveau). Elle comprend une refonte visuelle et UX, un audit de performance et de structure, une reconstruction front-end moderne, la prise en compte du SEO existant, un parcours de contact plus clair et un plan de mise en ligne sans coupure brutale de votre site actuel.',
  },
  {
    id: 'maintenance',
    title: 'Option Sérénité (maintenance, 50 €/mois)',
    keywords: ['serenite', 'maintenance', '50', 'mensuel', 'abonnement', 'par mois', 'suivi', 'mise a jour', 'securite', 'monitoring', 'surveillance', 'modification', 'modifier', 'apres la mise en ligne', 'support', 'maintain'],
    text: 'L’Option Sérénité coûte 50 €/mois. Elle garde votre site surveillé, sécurisé et légèrement mis à jour après la mise en ligne : monitoring de disponibilité, mises à jour de sécurité et petits edits de contenu chaque mois. Elle est facultative mais recommandée. Pour une évolution plus importante, on fait un devis gratuit ; les petites demandes sont livrées en 24 à 48 h.',
  },
  {
    id: 'payment',
    title: 'Paiement, devis et propriété',
    keywords: ['paiement', 'payer', 'regler', 'reglement', 'acompte', 'avance', 'facture', 'devis', 'gratuit', 'engagement', 'contrat', 'cgv', 'conditions', 'propriete', 'proprietaire', 'appartient', 'code source', 'nom de domaine', 'domaine', 'satisfait', 'rembourse', 'payment', 'deposit', 'invoice', 'quote', 'ownership'],
    text: 'Chaque projet commence par un appel et un devis gratuits, sans engagement. Les prix sont en euros et le prix facturé est celui du devis accepté. Rien n’est payé d’avance : pas d’acompte, le règlement intervient à la livraison, une fois le résultat validé par le client. Une fois la prestation réglée, le code source et le nom de domaine appartiennent au client, qui reste libre et sans engagement. Les modalités précises (moyen de paiement, hébergement, nom de domaine) sont détaillées dans le devis.',
  },
  {
    id: 'timing',
    title: 'Délais de livraison',
    keywords: ['delai', 'combien de temps', 'temps', 'rapide', 'rapidement', 'vite', 'urgent', 'quand', 'date', 'livraison', 'livre', 'livrer', '24', '48', 'heures', 'jours', 'semaine', 'planning', 'deadline', 'how long', 'fast', 'timeline', 'delivery'],
    text: '3geeks développe très rapidement : les petites demandes sont livrées en 24 à 48 h. Un site vitrine simple (Site Starter) fait partie des projets les plus rapides : il peut être livré en 24 à 48 h une fois les contenus reçus (textes, logo, photos). Pour un projet plus large (plateforme, e-commerce, application), le planning est fixé dès le premier appel et dans le devis ; il dépend aussi de la réactivité du client pour les validations.',
  },
  {
    id: 'process',
    title: 'Méthode de travail',
    keywords: ['methode', 'process', 'processus', 'etapes', 'comment ca marche', 'deroulement', 'fonctionnement', 'commencer', 'demarrer', 'lancer', 'premier appel', 'cadrage', 'maquette', 'prototype', 'validation', 'mise en ligne', 'lancement', 'how does it work', 'steps', 'start', 'get started'],
    text: 'Comment ça se passe : 1) un appel gratuit de 30 min pour comprendre votre besoin ; 2) un devis clair, gratuit et sans engagement ; 3) le cadrage : objectif, cible et format le plus simple qui fonctionne ; 4) une maquette lisible, pensée pour convertir dès le premier écran ; 5) un développement fiable (formulaires, automatisations, intégrations) ; 6) une mise en ligne soignée, sans coupure de votre site existant ; 7) une optimisation continue à partir des retours réels. Vous validez le résultat avant de payer.',
  },
  {
    id: 'capabilities',
    title: 'Ce que 3geeks peut développer',
    keywords: ['capable', 'pouvez', 'faire', 'developper', 'dev', 'creer', 'realiser', 'construire', 'type de projet', 'idee', 'application', 'appli', 'app', 'mobile', 'ios', 'android', 'iphone', 'logiciel', 'outil', 'jeu', 'jeux', 'game', 'chatbot', 'ia', 'intelligence artificielle', 'agent', 'automatisation', 'automation', 'telegram', 'extension', 'backend', 'cloud', 'data', 'build', 'can you'],
    text: '3geeks conçoit et développe : sites vitrines et landing pages ; sites e-commerce (Shopify ou sur mesure) ; plateformes web et SaaS (comptes, paiements, dashboards, back-offices) ; marketplaces ; applications mobiles iOS natives (exemple : l’app Two, publiée sur l’App Store) et web apps installables (PWA) qui fonctionnent sur iPhone et Android ; mini-apps Telegram ; chatbots, agents IA et assistants vocaux IA (exemple : CallKitchen) ; automatisations et intégrations d’outils ; infrastructure cloud AWS et projets data ou machine learning. Pour un jeu, 3geeks peut développer des jeux web (dans le navigateur, y compris multijoueur en ligne) ou des mini-jeux intégrés à une app ; le périmètre (plateforme, gameplay, graphismes) se cadre lors de l’appel gratuit, et l’équipe vous dit honnêtement si un projet très ambitieux (jeu 3D de type console) sort de son cœur de métier. Une app Android native se discute selon le projet.',
  },
  {
    id: 'ai-services',
    title: 'Services IA et automatisation pour entreprises (page 3geeks.fr/ia)',
    keywords: ['ia', 'intelligence artificielle', 'ai', 'llm', 'gpt', 'ia generative', 'integrer', 'integration', 'brancher', 'logiciel', 'logiciel metier', 'erp', 'crm', 'back-office', 'sap', 'odoo', 'hubspot', 'salesforce', 'automatiser', 'automatisation', 'automation', 'logistique', 'transport', 'entrepot', 'stocks', 'stock', 'commandes', 'bons de livraison', 'factures', 'facturation', 'planning', 'tournees', 'operations', 'agent', 'agent ia', 'assistant', 'chatbot', 'support client', 'service client', 'vocal', 'telephone', 'e-mail', 'mails', 'documents', 'extraction', 'ocr', 'contrats', 'classement', 'tableau de bord', 'dashboard', 'reporting', 'previsions', 'prevision', 'donnees', 'data', 'rag', 'base de connaissances', 'recherche documentaire', 'formation', 'former', 'equipes', 'audit', 'pilote', 'poc', 'entreprise', 'pme', 'industrie', 'cabinet', 'rentable', 'gain de temps', 'productivite', 'taches repetitives', 'ressaisie'],
    text: '3geeks propose des services d’IA et d’automatisation pour les entreprises qui ont déjà un site et des logiciels, détaillés sur https://3geeks.fr/ia. Six services : 1) intégration de l’IA dans les logiciels existants (ERP, CRM, back-office, logiciel métier) via leurs API : assistant interne qui répond à partir des documents de l’entreprise, pré-remplissage et rédaction automatiques, connexion aux exports et bases de données ; 2) automatisation de la logistique et des opérations : lecture automatique des bons de livraison, factures et commandes, alertes stock, retards et anomalies en temps réel, planning et tournées assistés ; 3) agents IA par chat, e-mail ou téléphone : support client et FAQ 24 h/24, qualification et tri des demandes, réception téléphonique IA (comme CallKitchen) ; 4) documents et données : extraction d’informations dans contrats, factures et e-mails, classement automatique, tableaux de bord, reporting et prévisions (ventes, stocks, charge) ; 5) applications associées reliées au système de l’entreprise : app web ou iOS, espace client, portail partenaires ou fournisseurs, outil terrain pour les équipes, mini-app Telegram ; 6) cadrage et formation : audit des cas d’usage rentables, règles de confidentialité et droits d’accès, formation des équipes aux bons usages et aux prompts. Rien n’est à remplacer : 3geeks s’appuie sur les outils en place. Exemples par secteur : logistique (documents lus automatiquement, anomalies en temps réel), commerce (assistant 24 h/24, stocks et prix synchronisés entre site, caisse et écrans), cabinets et services (documents pré-remplis et signés en ligne), restauration (réception IA qui prend commandes et réservations), industrie et PME (tableaux de bord et prévisions), équipes internes (assistant qui répond à partir des documents, avec les sources).',
  },
  {
    id: 'ai-method',
    title: 'Méthode, prix et hébergement des projets IA',
    keywords: ['ia', 'ai', 'audit', 'pilote', 'poc', 'prototype', 'combien', 'prix', 'tarif', 'cout', 'budget', 'devis', 'delai', 'duree', 'semaines', 'hebergement', 'heberge', 'hebergees', 'serveur', 'serveurs', 'france', 'souverain', 'souverainete', 'donnees', 'confidentialite', 'rgpd', 'securite', 'on-premise', 'sur site', 'cloud', 'openai', 'chatgpt', 'mistral', 'modele', 'modeles', 'open source', 'ollama', 'tiers', 'proprietaire', 'code', 'dependance', 'quels modeles'],
    text: 'Un projet IA avec 3geeks commence par un audit gratuit de 30 min : on passe en revue les outils et les tâches répétitives de l’entreprise pour repérer deux ou trois gains rapides, puis on envoie un devis gratuit (les services IA sont sur devis, selon le périmètre). Ensuite : un pilote sur un cas précis, branché sur les vraies données, livré en quelques semaines pour mesurer le gain ; l’intégration dans les outils avec des règles claires sur les données ; puis le déploiement, la formation de l’équipe et le suivi des résultats. Rien n’est payé d’avance : le client paie une fois satisfait, et tout ce qui est développé lui appartient (code source, prompts, intégrations), sans dépendance à 3geeks. Données : les modèles d’IA peuvent être hébergés en France, sur les serveurs de 3geeks ou sur ceux du client, et rien n’est envoyé à un service tiers sans son accord ; l’assistant du site 3geeks tourne par exemple sur un modèle hébergé sur les propres serveurs du studio, sans conserver les messages. Les modèles sont choisis selon le besoin : modèles open source hébergés en France ou API de fournisseurs d’IA si le client le souhaite. L’équipe est certifiée AWS (Cloud Practitioner, Machine Learning, Cloud Architecting) et formée au prompt engineering.',
  },
  {
    id: 'stack',
    title: 'Technologies utilisées',
    keywords: ['technologie', 'techno', 'stack', 'langage', 'framework', 'react', 'next', 'nextjs', 'vite', 'typescript', 'javascript', 'tailwind', 'node', 'python', 'swift', 'shopify', 'wordpress', 'webflow', 'wix', 'cms', 'firebase', 'postgresql', 'aws', 'docker', 'hebergement', 'serveur', 'code', 'no-code', 'tech'],
    text: 'Côté technique, 3geeks travaille surtout en code sur mesure : React et Next.js, TypeScript, Tailwind CSS, Node.js, Python, Swift pour iOS, PostgreSQL et bases vectorielles, Firebase, Shopify pour l’e-commerce, et le cloud AWS avec Docker. Le code livré est propre et vous appartient. Si vous tenez à un outil précis (WordPress, Webflow ou un autre CMS), on en parle lors de l’appel pour choisir la meilleure option.',
  },
  {
    id: 'expertise',
    title: 'Pôles d’expertise',
    keywords: ['expertise', 'competences', 'specialite', 'poles', 'design', 'ux', 'ui', 'cloud', 'aws', 'certifie', 'certification', 'ia generative', 'llm', 'machine learning', 'strategie', 'business', 'skills'],
    text: 'Trois pôles d’expertise : 1) Design produit : front-end réactif, UI/UX interactive, motion design, pages qui convainquent dès le premier écran ; 2) Cloud et IA générative : infrastructure cloud sécurisée sur Amazon Web Services (équipe certifiée AWS), IA générative (LLM), machine learning et automatisations ; 3) Stratégie business : cadrage produit, gestion de projet agile, go-to-market, conformité SaaS, échanges en français ou en anglais et réponse sous 24 h.',
  },
  {
    id: 'team',
    title: 'Équipe : Elias et Noam, cofondateurs',
    keywords: ['equipe', 'fondateur', 'cofondateur', 'qui', 'qui etes-vous', 'elias', 'noam', 'elloumi', 'leclapart', 'jublot', 'associes', 'team', 'founders', 'who', 'combien etes-vous', 'taille'],
    text: '3geeks est cofondée par Elias Elloumi et Noam Leclapart-Jublot. Elias, cofondateur côté design et expérience, façonne des pages claires, des interactions fluides et un rendu soigné ; il est spécialisé en UI/UX et front-end (React, Vite, Node.js, Tailwind CSS), Python, SQL et NoSQL, IA générative et prompt engineering. Noam, cofondateur côté systèmes et data, construit la logique fiable derrière le produit (formulaires, dashboards, automatisations, flux de données) ; il est spécialisé en IA générative, cloud AWS et infrastructure, machine learning, Python et data. Autour d’eux, un réseau grandissant d’apporteurs d’affaires oriente des entreprises vers le studio.',
  },
  {
    id: 'elias',
    title: 'Parcours et certifications d’Elias Elloumi',
    keywords: ['elias', 'elloumi', 'parcours', 'experience', 'formation', 'etudes', 'diplome', 'certifications', 'certif', 'clevai', 'nokia', 'ece', 'liora', 'datascientest', 'aws academy', 'prompt engineering', 'linkedin', 'cv'],
    text: 'Elias Elloumi est développeur Data & IA en alternance chez ClevAI (depuis 2026), après une alternance chez Nokia (2025-2026). Il suit un Master Data & Intelligence Artificielle à l’ECE Paris (2026-2028), après un Bachelor Informatique à l’ECE Paris (2023-2026). Certifications : IA & GenAI Prompt Engineering niveau 1 (Liora, 2026) ; AWS Academy Graduate Machine Learning Foundations (AWS, 2026) ; AWS Academy Graduate Cloud Architecting (AWS, 2026) ; Programming for Data Science niveau 2 (Liora) ; IA & GenAI Prompt Engineering (DataScientest, 2025) ; Python pour les Data Scientists niveau 1 (DataScientest). LinkedIn : https://www.linkedin.com/in/elias-eloumi/',
  },
  {
    id: 'noam',
    title: 'Parcours et certifications de Noam Leclapart-Jublot',
    keywords: ['noam', 'leclapart', 'jublot', 'parcours', 'experience', 'formation', 'etudes', 'diplome', 'certifications', 'certif', 'thales', 'sowarp', 'efrei', 'ece', 'aws', 'cloud practitioner', 'linkedin', 'cv'],
    text: 'Noam Leclapart-Jublot est ingénieur en IA générative en alternance chez Thales (depuis 2025), après un stage en infrastructure cloud chez SOWARP (2024). Il suit le cycle ingénieur Big Data & Machine Learning de l’EFREI Paris (2026-2029), après un Bachelor Informatique à l’ECE Paris (2023-2026). Certifications : AWS Certified Cloud Practitioner (AWS, 2025, valide jusqu’en 2028) ; AWS Academy Graduate Machine Learning Foundations (AWS, 2026) ; AWS Academy Graduate Cloud Foundations (AWS, 2024) ; Python pour les Data Scientists niveau 1 (DataScientest). LinkedIn : https://www.linkedin.com/in/noam-leclapart-jublot/',
  },
  {
    id: 'introducers',
    title: 'Apporteurs d’affaires',
    keywords: ['apporteur', 'affaires', 'charles', 'garbus', 'niels', 'wiriath', 'partenaire', 'partenariat', 'commission', 'reseau', 'rejoindre', 'recommander', 'parrainage', 'introducer', 'partner', 'referral'],
    text: 'Charles Garbus et Niels Wiriath sont apporteurs d’affaires de 3geeks : ils repèrent des entreprises et des porteurs de projet qui ont besoin d’un site ou d’un outil digital, et les mettent en relation avec le studio. 3geeks souhaite agrandir ce réseau : pour devenir apporteur d’affaires, écrivez à contact@3geeks.fr. Pour un projet, le contact se fait directement avec le studio (appel gratuit, e-mail, ou LinkedIn d’Elias ou de Noam).',
  },
  {
    id: 'portfolio',
    title: 'Liste des réalisations',
    keywords: ['realisations', 'projets', 'portfolio', 'references', 'exemples', 'clients', 'travaux', 'deja fait', 'projects', 'work', 'examples', 'combien de projets'],
    text: '3geeks a livré 13 projets : 9 réalisations clients et 4 produits maison. Clients : Cabinet Dr Amel Elloumi Jellouli (site médical bilingue, Tunis), Express Divorce USA (SaaS juridique, États-Unis), une plateforme privée de signature de contrats, Vipagence (marketplace de créateurs), Two (app iOS notée 5,0), Aurenza Capital (gestion de patrimoine), Green Jardin (Shopify, caisse et menu TV), une boutique privée sur Telegram et CallKitchen (IA vocale pour restaurants). Produits maison : Prompt Hub, PromptOptim, EFREI Skill Hub et 3geeks Infra. Tout est visible dans la section « Réalisations » du site, et ce n’est que le début.',
  },
  {
    id: 'jellouli',
    title: 'Réalisation : Cabinet Dr Amel Elloumi Jellouli (santé)',
    keywords: ['jellouli', 'amel', 'elloumi', 'dermatologie', 'dermatologue', 'medecin', 'sante', 'medical', 'cabinet', 'clinique', 'tunis', 'tunisie', 'arabe', 'bilingue', 'laser', 'rendez-vous', 'rdv', 'docteur', 'health', 'doctor'],
    text: 'Cabinet Dr Amel Elloumi Jellouli (santé, Tunis) : site d’un cabinet de dermatologie, bilingue français et arabe. Livré : pôles d’expertise détaillés (dermatologie, lasers, esthétique, chirurgie), 15 cas cliniques documentés et filtrables, visite vidéo du cabinet et du plateau laser, rendez-vous en un clic (appel, WhatsApp, e-mail, itinéraire). Résultat : un site crédible pour les patients, clair sur chaque soin et pensé d’abord pour le mobile. En ligne : https://www.amel-jellouli-elloumi.com/',
  },
  {
    id: 'express-divorce',
    title: 'Réalisation : Express Divorce USA (juridique)',
    keywords: ['express divorce', 'divorce', 'juridique', 'legal', 'avocat', 'droit', 'usa', 'etats-unis', 'americain', 'saas', 'formulaires', 'questionnaire', 'next.js', 'legal tech'],
    text: 'Express Divorce USA (juridique, États-Unis) : plateforme SaaS en production qui simplifie le divorce à l’amiable. Un questionnaire guidé vérifie l’éligibilité et génère les formulaires propres à chaque État, dans les 50 États, avec un tarif affiché dès l’accueil (à partir de 299 $), la sécurité des données et un design rassurant sur un sujet difficile. Plus de 500 familles accompagnées selon les chiffres du client. En ligne : https://www.expressdivorceusa.co',
  },
  {
    id: 'esign',
    title: 'Réalisation : plateforme privée de signature de contrats',
    keywords: ['signature', 'signer', 'e-signature', 'contrat', 'accord', 'pdf', 'docusign', 'juridique', 'plateforme privee', 'prive', 'conformite'],
    text: 'Plateforme privée de signature de contrats multi-parties (juridique, États-Unis) : faire signer des accords de façon conforme et professionnelle, avec des liens de signature par rôle, le suivi des statuts, un PDF consolidé mis à jour à chaque signature et un dashboard d’administration. Projet confidentiel : pas de lien public ni de nom de client.',
  },
  {
    id: 'vipagence',
    title: 'Réalisation : Vipagence (marketplace)',
    keywords: ['vipagence', 'agence', 'ugc', 'createurs', 'clippers', 'marques', 'influence', 'influenceurs', 'marketplace', 'inscription'],
    text: 'Vipagence (marketplace) : site vitrine et parcours d’inscription pour une agence qui relie créateurs UGC, clippers et marques. 3geeks a conçu et développé le site, pas le casting. En ligne : https://www.vipagence.net/',
  },
  {
    id: 'two',
    title: 'Réalisation : Two (app iOS)',
    keywords: ['two', 'app', 'application', 'ios', 'iphone', 'app store', 'couple', 'swift', 'mobile', 'cinematch', 'calendrier', 'souvenirs'],
    text: 'Two (application mobile iOS) : l’app des couples, publiée sur l’App Store et notée 5,0. Livré : app iOS native en Swift, carte des souvenirs partagés, humeur du jour et compteur de jours ensemble, calendrier commun, et CinéMatch pour trouver un film qui plaît aux deux. Lien App Store : https://apps.apple.com/fr/app/two/id6758867716',
  },
  {
    id: 'aurenza',
    title: 'Réalisation : Aurenza Capital (finance)',
    keywords: ['aurenza', 'capital', 'patrimoine', 'gestion de patrimoine', 'finance', 'courtier', 'conseiller', 'boulogne', 'amf', 'banque de france', 'investissement', 'haut de gamme', 'luxe', 'premium'],
    text: 'Aurenza Capital (finance) : vitrine d’un courtier en gestion de patrimoine à Boulogne-Billancourt, avec une direction artistique sobre et haut de gamme, des chiffres sourcés (AMF, Banque de France) et une prise de contact directe. En ligne : https://mathis-mourot.vercel.app/',
  },
  {
    id: 'green-jardin',
    title: 'Réalisation : Green Jardin (commerce)',
    keywords: ['green jardin', 'cbd', 'boutique', 'magasin', 'commerce', 'retail', 'shopify', 'caisse', 'pos', 'balance', 'fidelite', 'menu tv', 'ecran', 'palaiseau', 'e-commerce', 'ecommerce', 'omnicanal', 'ino digital'],
    text: 'Green Jardin (commerce, Palaiseau) : boutique CBD en ligne et en magasin. Livré : boutique Shopify (réalisée avec Ino Digital), menu TV dynamique en magasin mis à jour en temps réel, caisse POS avec balance et programme de fidélité, vérification d’âge et paiement sécurisé. Résultat : le site, la caisse et l’écran du magasin partagent les mêmes produits et les mêmes prix, une seule source à tenir à jour. En ligne : https://green-jardin.fr',
  },
  {
    id: 'telegram',
    title: 'Réalisation : boutique privée sur Telegram',
    keywords: ['telegram', 'mini-app', 'mini app', 'bot', 'boutique privee', 'commande', 'pwa', 'membres', 'moderation', 'communaute'],
    text: 'Boutique privée sur Telegram (commerce) : mini-app de commande intégrée à Telegram, avec accès vérifié côté serveur, et un espace gérant installable sur iPhone pour suivre les commandes et modérer les membres en temps réel. Projet confidentiel : pas de lien public ni de détail sur le client.',
  },
  {
    id: 'callkitchen',
    title: 'Réalisation : CallKitchen (IA vocale pour restaurants)',
    keywords: ['callkitchen', 'call kitchen', 'restaurant', 'restauration', 'telephone', 'appels', 'vocal', 'voix', 'voice', 'agent vocal', 'ia vocale', 'receptionniste', 'commandes', 'reservations', 'sms'],
    text: 'CallKitchen (restauration, IA vocale) : landing page et réception téléphonique par IA, 24 h sur 24, pour les restaurants : prise de commandes, réservations, réponses sur les menus, notifications SMS et tableau de bord cuisine. En ligne : https://call-kitchen-landing.vercel.app',
  },
  {
    id: 'lab',
    title: 'Le lab 3geeks (produits maison)',
    keywords: ['lab', 'produits', 'outils', 'prompt hub', 'promptoptim', 'prompt optim', 'efrei', 'skill hub', 'open source', 'infra', 'green it', 'sobriete', 'co2', 'interne'],
    text: 'Le lab 3geeks regroupe les produits maison : Prompt Hub (outil beta qui transforme une idée floue en plan d’exécution par étapes, avec des prompts prêts pour votre IDE : https://prompt-hub.3geeks.fr/), PromptOptim (optimiseur de prompts IA qui réduit la consommation de tokens et estime l’impact CO2 : https://prompt-optim.3geeks.fr/), EFREI Skill Hub (outil open source de révision Python pour une promo d’ingénieurs, avec fiches, exercices générés par IA, détecteur de pièges et simulateur d’examen : https://efrei-skill-hub.vercel.app/) et 3geeks Infra (l’infrastructure sur laquelle le studio héberge et opère ses produits).',
  },
  {
    id: 'reviews',
    title: 'Avis clients',
    keywords: ['avis', 'temoignage', 'retours', 'retour client', 'satisfaction', 'recommandation', 'note', 'reviews', 'testimonials', 'trustpilot', 'fiable', 'confiance', 'serieux'],
    text: 'Avis clients affichés sur le site : « Équipe réactive, process très clair et exécution propre. Le nouveau site a fluidifié notre acquisition. » (Adrien, CallKitchen et Express Divorce USA) ; « Ils ont compris notre métier rapidement et proposé des choix utiles. On a vu une vraie progression. » (Henry F., Two) ; « Le système mis en place est robuste et simple à opérer. Notre quotidien est plus serein. » (Pierre V., Concept Store).',
  },
  {
    id: 'contact',
    title: 'Contact et prise de rendez-vous',
    keywords: ['contact', 'contacter', 'joindre', 'appeler', 'appel', 'telephone', 'numero', 'mail', 'email', 'e-mail', 'rendez-vous', 'rdv', 'calendly', 'reserver', 'discuter', 'parler', 'echanger', 'linkedin', 'whatsapp', 'adresse', 'bureau', 'locaux', 'ou etes-vous', 'bases', 'rencontrer', 'visio', 'call', 'meeting', 'phone', 'book'],
    text: 'Pour parler de votre projet : réservez un appel gratuit de 30 min avec le bouton « Réserver un appel gratuit » du site (via Calendly) ; écrivez à contact@3geeks.fr (réponse sous 24 h) ; ou contactez Elias (https://www.linkedin.com/in/elias-eloumi/) ou Noam (https://www.linkedin.com/in/noam-leclapart-jublot/) sur LinkedIn. 3geeks est un studio français : les échanges se font par téléphone lors de l’appel réservé (les détails de l’appel sont confirmés à la réservation), par e-mail ou sur LinkedIn.',
  },
  {
    id: 'languages',
    title: 'Langues et clients internationaux',
    keywords: ['anglais', 'english', 'arabe', 'langue', 'international', 'etranger', 'usa', 'tunisie', 'belgique', 'suisse', 'canada', 'multilingue', 'traduction', 'bilingue', 'france', 'francais', 'distance'],
    text: '3geeks est un studio français qui travaille avec des clients en France et à l’international, par exemple aux États-Unis et en Tunisie. Les échanges se font en français ou en anglais. Les sites peuvent être multilingues : le site du Cabinet Dr Jellouli est par exemple bilingue français et arabe.',
  },
  {
    id: 'prepare',
    title: 'Ce qu’il faut préparer',
    keywords: ['preparer', 'fournir', 'besoin', 'contenu', 'textes', 'photos', 'logo', 'charte', 'cahier des charges', 'brief', 'idee', 'maquette', 'inspiration', 'informations', 'pret', 'what do you need'],
    text: 'Pas besoin d’un cahier des charges pour démarrer : expliquez simplement ce que vous voulez vendre, présenter ou automatiser lors de l’appel gratuit. Pour aller vite, préparez si possible vos textes, votre logo, vos photos, quelques sites que vous aimez et votre nom de domaine s’il existe déjà. Pour une application ou une plateforme, une description des utilisateurs et des fonctionnalités principales suffit pour établir le devis.',
  },
  {
    id: 'seo',
    title: 'SEO, performance et mobile',
    keywords: ['seo', 'referencement', 'google', 'visibilite', 'performance', 'rapide', 'vitesse', 'lighthouse', 'mobile', 'responsive', 'accessibilite', 'conversion', 'trafic'],
    text: 'Les sites 3geeks sont responsive, pensés d’abord pour le mobile, rapides et clairs pour convertir dès le premier écran. Lors d’une refonte, le SEO existant est pris en compte. Pour un objectif précis de référencement ou de visibilité, on le définit ensemble lors de l’appel.',
  },
  {
    id: 'privacy',
    title: 'Données personnelles et confidentialité',
    keywords: ['donnees', 'rgpd', 'gdpr', 'confidentialite', 'vie privee', 'cookies', 'cookie', 'stockage', 'conserve', 'privacy', 'data', 'nda', 'secret', 'confidentiel'],
    text: 'Le site ne dépose aucun cookie publicitaire ni de suivi. Les messages envoyés à cet assistant sont traités par le serveur d’IA de 3geeks uniquement pour générer la réponse et ne sont pas conservés. 3geeks utilise vos informations uniquement pour vous répondre et préparer un devis ; elles ne sont jamais vendues. Vous pouvez exercer vos droits RGPD en écrivant à contact@3geeks.fr. Le studio sait aussi travailler sur des projets confidentiels : deux de ses réalisations sont des plateformes privées.',
  },
  {
    id: 'assistant',
    title: 'À propos de cet assistant',
    keywords: ['assistant', 'bot', 'chatbot', 'robot', 'humain', 'qui es-tu', 'tu es qui', 'gpt', 'chatgpt', 'modele'],
    text: 'Cet assistant est l’IA du site 3geeks, hébergée par le studio. Il répond aux questions sur 3geeks, ses offres, ses délais, ses réalisations et sa façon de travailler. Il peut se tromper : pour un devis ou une réponse précise sur votre projet, l’équipe vous répond lors de l’appel gratuit de 30 min ou par e-mail à contact@3geeks.fr.',
  },
];
