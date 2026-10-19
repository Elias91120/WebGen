// Texts of the AI & automation page (3geeks.fr/ia), aimed at companies that already have
// a website and software, and want AI and automation inside the tools they use.
// Keep server/knowledge.mjs (chunks `ai-services`, `ai-method`, `ai-processes`) in sync with this file.

export type AutomationLevel = 'auto' | 'validate' | 'assist';

export interface DemoScenario {
  tab: string;
  trigger: { kind: 'email' | 'photo' | 'message' | 'schedule'; line1: string; line2: string; attachment?: string };
  steps: string[];
  fields: Array<{ k: string; v: string; status?: 'ok' | 'warn' }>;
  result: string;
  before: string;
  after: string;
}

export interface AiCopy {
  meta: { title: string; description: string };
  nav: { demo: string; explorer: string; services: string; proof: string; method: string; cta: string };
  hero: {
    badge: string;
    titleStart: string;
    titleEnd: string;
    comment: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust: Array<{ k: string; v: string }>;
    diagram: {
      inLabel: string;
      outLabel: string;
      core: string;
      coreSteps: string[];
      caption: string;
      /** Raw item on the left of the scan line, finished task on the right. */
      items: Array<{ raw: string; rawSub: string; done: string; doneSub: string; tone?: 'warn' }>;
    };
  };
  demo: {
    path: string;
    title: string;
    subtitle: string;
    badge: string;
    incoming: string;
    extracted: string;
    pipeline: string;
    before: string;
    after: string;
    replay: string;
    scenarios: DemoScenario[];
  };
  explorer: {
    path: string;
    title: string;
    subtitle: string;
    levels: Record<AutomationLevel, { label: string; desc: string }>;
    departments: Array<{ name: string; processes: Array<{ name: string; gain: string; level: AutomationLevel }> }>;
    cta: string;
    limits: { title: string; subtitle: string; items: Array<{ t: string; d: string }> };
  };
  services: {
    path: string;
    title: string;
    subtitle: string;
    items: Array<{ title: string; desc: string; bullets: string[] }>;
  };
  proof: {
    path: string;
    title: string;
    subtitle: string;
    open: string;
    privateTag: string;
    items: Array<{ name: string; title: string; desc: string; tags: string[]; link?: string; isPrivate?: boolean }>;
  };
  method: { path: string; title: string; subtitle: string; steps: Array<{ t: string; d: string }> };
  why: { path: string; title: string; subtitle: string; cards: Array<{ title: string; desc: string }> };
  contact: { path: string; title: string; subtitle: string; book: string; bookDesc: string; email: string; linkedin: string };
  footer: { blurb: string; webSite: string; rights: string; tagline: string; navigate: string };
  assistant: { greeting: string; suggestions: string[] };
}

export const aiCopy: Record<'fr' | 'en', AiCopy> = {
  fr: {
    meta: {
      title: '3geeks — Intégration IA et automatisation pour entreprises',
      description:
        'Intégrez l’IA dans vos logiciels existants (ERP, CRM, site, logistique) : agents IA, automatisation des opérations, traitement de documents, applications associées. Audit gratuit de 30 min, rien à payer d’avance.',
    },
    nav: {
      demo: 'Démo',
      explorer: 'Vos process',
      services: 'Services',
      proof: 'Réalisations',
      method: 'Méthode',
      cta: 'Réserver un audit gratuit',
    },
    hero: {
      badge: 'IA & automatisation pour entreprises · Made in France',
      titleStart: 'Mettez l’IA au travail',
      titleEnd: 'dans les outils que vous utilisez déjà.',
      comment:
        'Vous avez déjà un site, un logiciel métier, un ERP ou un CRM. On y intègre de l’IA et de l’automatisation pour supprimer les tâches répétitives, répondre plus vite à vos clients et exploiter vos données. Sans rien remplacer.',
      ctaPrimary: 'Réserver un audit gratuit',
      ctaSecondary: 'Voir ce qu’on peut automatiser',
      trust: [
        { k: '30 min', v: 'd’audit gratuit pour repérer vos gains rapides' },
        { k: '0 €', v: 'd’avance : vous payez une fois satisfait' },
        { k: 'FR', v: 'modèles hébergés en France ou sur vos serveurs' },
        { k: 'AWS', v: 'équipe formée et certifiée (Cloud Practitioner)' },
      ],
      diagram: {
        inLabel: 'Ce qui arrive',
        outLabel: 'Déjà fait',
        core: 'IA 3geeks',
        coreSteps: ['Lit', 'Comprend', 'Agit'],
        caption: 'Vos e-mails, documents et données entrent. Les tâches sortent faites.',
        items: [
          { raw: 'Facture F-2481', rawSub: 'PDF reçu par e-mail', done: 'Saisie dans l’ERP', doneSub: '1 248 € · conforme' },
          { raw: 'Photo BL-0932', rawSub: 'prise par le chauffeur', done: '2 colis manquants', doneSub: 'Responsable prévenu', tone: 'warn' },
          { raw: 'Message client', rawSub: '« Où est mon colis ? »', done: 'Client répondu', doneSub: 'Livré jeudi' },
          { raw: 'ventes.xlsx', rawSub: 'lundi 8 h 00', done: 'Rapport envoyé', doneSub: '3 points d’attention' },
          { raw: 'Appel manqué', rawSub: 'samedi 21 h 40', done: 'Réservation prise', doneSub: 'SMS envoyé' },
          { raw: 'Commande #10611', rawSub: 'depuis le site', done: 'Stock à jour', doneSub: 'Réassort proposé' },
        ],
      },
    },
    demo: {
      path: 'Démo',
      title: 'Regardez un process s’automatiser.',
      subtitle: 'Un document arrive, l’IA le lit, le compare à vos outils et fait le travail. Vous gardez la main sur ce qui compte.',
      badge: 'Exemple illustratif',
      incoming: 'Ce qui arrive',
      extracted: 'Ce que l’IA a compris',
      pipeline: 'Ce qui se passe, tout seul',
      before: 'Avant',
      after: 'Avec l’IA',
      replay: 'Rejouer',
      scenarios: [
        {
          tab: 'Facture fournisseur',
          trigger: { kind: 'email', line1: 'factures@transports-exemple.fr', line2: 'Facture F-2481 · octobre', attachment: 'F-2481.pdf' },
          steps: ['Facture reçue par e-mail', 'Lecture du PDF par l’IA', 'Rapprochement avec la commande dans votre ERP', 'Écriture préparée, validée en 1 clic'],
          fields: [
            { k: 'Fournisseur', v: 'Transports Exemple' },
            { k: 'N° de facture', v: 'F-2481' },
            { k: 'Montant TTC', v: '1 248,00 €' },
            { k: 'Commande liée', v: 'PO-4471 · conforme', status: 'ok' },
          ],
          result: 'Facture enregistrée dans l’ERP, la comptabilité est prévenue.',
          before: 'Ressaisie à la main',
          after: 'Validée en 1 clic',
        },
        {
          tab: 'Bon de livraison',
          trigger: { kind: 'photo', line1: 'Photo prise par le chauffeur', line2: 'BL-0932 · 14 colis annoncés' },
          steps: ['Photo du bon envoyée depuis le téléphone', 'Lecture des références et des quantités', 'Comparaison avec la commande', 'Écart signalé, stock mis à jour'],
          fields: [
            { k: 'Bon de livraison', v: 'BL-0932' },
            { k: 'Destination', v: 'Entrepôt Nord' },
            { k: 'Colis reçus', v: '12 / 14', status: 'warn' },
            { k: 'Stock', v: 'Mis à jour', status: 'ok' },
          ],
          result: 'Alerte envoyée au responsable : 2 colis manquants.',
          before: 'Écart découvert des jours plus tard',
          after: 'Écart détecté à la livraison',
        },
        {
          tab: 'Question client',
          trigger: { kind: 'message', line1: 'Message reçu à 23 h 12', line2: '« Bonjour, où en est ma commande 10582 ? »' },
          steps: ['Question reçue sur le site, par e-mail ou au téléphone', 'Client et commande identifiés', 'Statut lu dans votre outil logistique', 'Réponse précise envoyée au client'],
          fields: [
            { k: 'Client', v: 'Mme Durand' },
            { k: 'Commande', v: '#10582' },
            { k: 'Statut', v: 'Expédiée', status: 'ok' },
            { k: 'Livraison prévue', v: 'Jeudi' },
          ],
          result: 'Le client a sa réponse tout de suite, même la nuit.',
          before: 'Réponse le lendemain',
          after: 'Réponse immédiate, 24h/24',
        },
        {
          tab: 'Reporting',
          trigger: { kind: 'schedule', line1: 'Chaque lundi · 8 h 00', line2: 'ERP · CRM · fichiers Excel' },
          steps: ['Déclenchement automatique le lundi matin', 'Collecte des chiffres dans tous vos outils', 'Calcul des indicateurs et des écarts', 'Synthèse envoyée à la direction'],
          fields: [
            { k: 'CA de la semaine', v: '84 300 €' },
            { k: 'Commandes', v: '312' },
            { k: 'Retards', v: '3', status: 'warn' },
            { k: 'Stock critique', v: '2 références', status: 'warn' },
          ],
          result: 'Le rapport arrive dans votre boîte, avec les points d’attention.',
          before: 'Une demi-journée sur Excel',
          after: 'Prêt avant le café',
        },
      ],
    },
    explorer: {
      path: 'Vos process',
      title: 'Qu’est-ce qu’on peut automatiser chez vous ?',
      subtitle: 'Choisissez un service de votre entreprise. Pour chaque tâche, on vous montre honnêtement ce que l’IA peut faire seule, et là où votre équipe garde la décision.',
      levels: {
        auto: { label: 'Automatique', desc: 'La tâche se fait toute seule.' },
        validate: { label: 'Vous validez', desc: 'L’IA prépare, vous validez en 1 clic.' },
        assist: { label: 'L’IA assiste', desc: 'L’IA prépare le dossier, l’humain décide.' },
      },
      departments: [
        {
          name: 'Administratif & compta',
          processes: [
            { name: 'Saisie des factures fournisseurs', gain: 'Lues et pré-saisies dans votre logiciel', level: 'validate' },
            { name: 'Relances des impayés', gain: 'Envoyées au bon moment, avec le bon ton', level: 'auto' },
            { name: 'Rapprochement bancaire', gain: 'Les écarts ressortent, le reste est rapproché', level: 'validate' },
            { name: 'Notes de frais', gain: 'Justificatifs lus depuis une simple photo', level: 'validate' },
          ],
        },
        {
          name: 'Logistique & stocks',
          processes: [
            { name: 'Bons de livraison et réceptions', gain: 'Lus et comparés à la commande', level: 'validate' },
            { name: 'Alertes de stock et réassort', gain: 'Commande proposée avant la rupture', level: 'auto' },
            { name: 'Suivi des expéditions', gain: 'Retards détectés, client prévenu', level: 'auto' },
            { name: 'Planification des tournées', gain: 'Proposition optimisée, le planificateur ajuste', level: 'assist' },
          ],
        },
        {
          name: 'Service client',
          processes: [
            { name: 'Questions fréquentes', gain: 'Réponses 24h/24 sur le site, par e-mail ou au téléphone', level: 'auto' },
            { name: '« Où en est ma commande ? »', gain: 'Statut lu directement dans vos outils', level: 'auto' },
            { name: 'Tri des demandes entrantes', gain: 'Chaque demande au bon interlocuteur', level: 'auto' },
            { name: 'Réclamations et litiges', gain: 'Dossier préparé, votre équipe tranche', level: 'assist' },
          ],
        },
        {
          name: 'Commercial',
          processes: [
            { name: 'Qualification des prospects', gain: 'Score et priorité dès l’arrivée du contact', level: 'auto' },
            { name: 'Mise à jour du CRM', gain: 'E-mails et appels résumés dans la fiche client', level: 'auto' },
            { name: 'Devis et propositions', gain: 'Brouillon généré à partir du besoin', level: 'validate' },
            { name: 'Relances commerciales', gain: 'Relance personnalisée, prête à envoyer', level: 'validate' },
          ],
        },
        {
          name: 'RH & équipes',
          processes: [
            { name: 'Questions internes (congés, procédures)', gain: 'Assistant interne qui répond à partir de vos documents', level: 'auto' },
            { name: 'Accueil des nouveaux arrivants', gain: 'Accès, documents et étapes envoyés au bon moment', level: 'auto' },
            { name: 'Plannings et absences', gain: 'Planning proposé selon vos contraintes', level: 'validate' },
            { name: 'Tri des candidatures', gain: 'Synthèse des profils, la décision reste humaine', level: 'assist' },
          ],
        },
        {
          name: 'Direction',
          processes: [
            { name: 'Reporting hebdomadaire', gain: 'Synthèse envoyée chaque lundi matin', level: 'auto' },
            { name: 'Tableaux de bord', gain: 'Toutes vos données au même endroit, à jour', level: 'auto' },
            { name: 'Synthèse de documents longs', gain: 'Contrats et appels d’offres résumés', level: 'validate' },
            { name: 'Prévisions ventes et stocks', gain: 'Tendances et alertes pour décider', level: 'assist' },
          ],
        },
      ],
      cta: 'Trouver mes gains rapides',
      limits: {
        title: 'Ce qu’on n’automatise pas',
        subtitle: 'L’IA est très forte sur les tâches répétitives. Pour le reste, on vous le dit franchement.',
        items: [
          { t: 'Les décisions sensibles', d: 'Recrutement, litiges, sanctions : l’IA prépare, un humain décide.' },
          { t: 'Ce qui vous engage sans relecture', d: 'Contrats et courriers juridiques passent toujours par une validation.' },
          { t: 'Un process qui n’existe pas encore', d: 'Si les données sont éparpillées, on commence par les structurer.' },
          { t: 'L’IA pour le principe', d: 'Si un simple script suffit, on fait le script. C’est moins cher.' },
        ],
      },
    },
    services: {
      path: 'Nos services IA',
      title: 'Six façons concrètes d’utiliser l’IA dans votre entreprise.',
      subtitle: 'Chaque service part de vos outils et de vos données actuels. Pas de plateforme à remplacer, pas d’usine à gaz.',
      items: [
        {
          title: 'Intégration IA dans vos logiciels',
          desc: 'On branche l’IA dans votre ERP, CRM, back-office ou logiciel métier via leurs API : un assistant dans l’outil, des réponses tirées de vos documents, des champs remplis automatiquement.',
          bullets: ['Assistant interne qui répond à partir de vos documents', 'Connexion à l’existant : API, exports, bases de données', 'Rédaction et pré-remplissage automatiques'],
        },
        {
          title: 'Automatisation logistique & opérations',
          desc: 'Commandes, bons de livraison, factures, stocks, planning : on automatise les étapes qui prennent du temps à vos équipes chaque jour.',
          bullets: ['Lecture automatique des bons de livraison, factures et commandes', 'Alertes stock, retards et anomalies en temps réel', 'Planning et tournées assistés'],
        },
        {
          title: 'Agents IA : chat, e-mail, téléphone',
          desc: 'Un agent qui répond à vos clients 24h/24 sur votre site, par e-mail ou au téléphone, qualifie les demandes et transmet le reste à votre équipe.',
          bullets: ['Support client et FAQ 24h/24', 'Qualification et tri des demandes entrantes', 'Réception téléphonique IA, comme CallKitchen'],
        },
        {
          title: 'Documents & données',
          desc: 'Extraction d’informations dans vos contrats, factures et e-mails, classement automatique, tableaux de bord et prévisions à partir de vos données.',
          bullets: ['Extraction et classement automatiques', 'Tableaux de bord et reporting', 'Prévisions : ventes, stocks, charge'],
        },
        {
          title: 'Applications associées',
          desc: 'Une app web ou mobile reliée à votre système : espace client, outil terrain pour vos équipes, portail fournisseurs ou partenaires.',
          bullets: ['App web ou iOS reliée à vos données', 'Espace client ou portail partenaires', 'Outil terrain pour les équipes'],
        },
        {
          title: 'Cadrage & formation',
          desc: 'On identifie les cas d’usage rentables, on fixe les règles de confidentialité des données et on forme vos équipes à utiliser l’IA au quotidien.',
          bullets: ['Audit des cas d’usage et priorisation', 'Règles de confidentialité et droits d’accès', 'Formation des équipes : prompts, bons usages'],
        },
      ],
    },
    proof: {
      path: 'Déjà en production',
      title: 'De l’IA et des automatisations qui tournent déjà.',
      subtitle: 'Quelques exemples livrés par 3geeks, chez des clients et dans nos propres outils.',
      open: 'Voir',
      privateTag: 'Projet privé',
      items: [
        {
          name: 'CallKitchen',
          title: 'Réception téléphonique IA pour restaurants',
          desc: 'Agent vocal qui prend commandes et réservations 24h/24, répond sur les menus, prévient l’équipe par SMS et alimente un tableau de bord cuisine.',
          tags: ['Agent vocal', 'SMS', 'Dashboard'],
          link: 'https://call-kitchen-landing.vercel.app',
        },
        {
          name: 'Assistant 3geeks',
          title: 'L’assistant IA de ce site',
          desc: 'L’assistant en bas à droite répond en une seconde à partir de notre base de connaissances, avec un modèle français de Mistral AI et un relais sur nos propres serveurs. Testez-le : c’est ce qu’on peut déployer sur votre site ou en interne.',
          tags: ['Mistral AI', 'RAG', 'Relais sur nos serveurs'],
        },
        {
          name: 'Signature de contrats',
          title: 'Documents générés et signés automatiquement',
          desc: 'Liens de signature par rôle, suivi des statuts et PDF consolidé mis à jour à chaque signature, avec un tableau de bord d’administration.',
          tags: ['PDF dynamique', 'Workflow', 'Dashboard'],
          isPrivate: true,
        },
        {
          name: 'Prompt Hub',
          title: 'Notre outil IA maison',
          desc: 'Prompt Hub transforme une idée en plan d’exécution par étapes, orchestré par des agents IA, avec des prompts prêts à l’emploi.',
          tags: ['Multi-agent', 'Planification IA'],
          link: 'https://prompt-hub.3geeks.fr/',
        },
      ],
    },
    method: {
      path: 'Méthode',
      title: 'Un pilote en quelques semaines, pas un projet de six mois.',
      subtitle: 'On commence petit, sur un cas précis et mesurable, puis on étend ce qui marche.',
      steps: [
        { t: 'Audit gratuit · 30 min', d: 'On passe en revue vos outils et vos tâches répétitives pour repérer deux ou trois gains rapides.' },
        { t: 'Pilote sur un cas précis', d: 'On livre un premier cas d’usage fonctionnel, branché sur vos vraies données, pour mesurer le gain.' },
        { t: 'Intégration & sécurité', d: 'On l’intègre dans vos outils, avec des règles claires sur les données : modèles hébergés en France ou sur vos serveurs si besoin.' },
        { t: 'Déploiement & suivi', d: 'Formation de l’équipe, suivi des résultats et améliorations en continu. Vous payez une fois satisfait.' },
      ],
    },
    why: {
      path: 'Pourquoi 3geeks',
      title: 'Des ingénieurs IA en direct, pas un intermédiaire.',
      subtitle: 'Elias et Noam, cofondateurs, travaillent au quotidien sur des projets d’IA générative et de cloud. Vous parlez directement à ceux qui développent.',
      cards: [
        { title: 'Vos données restent sous contrôle', desc: 'Modèles hébergés en France, sur nos serveurs ou les vôtres. Rien n’est envoyé à un service tiers sans votre accord.' },
        { title: 'Compatible avec l’existant', desc: 'On s’appuie sur vos API, exports et bases de données. Votre ERP, votre CRM et votre site restent en place.' },
        { title: 'Du code qui vous appartient', desc: 'Tout ce qu’on développe est à votre nom : code source, prompts, intégrations. Aucune dépendance à 3geeks.' },
        { title: 'Formés au cloud et à l’IA', desc: 'Équipe formée et certifiée AWS (Cloud Practitioner), formée aux parcours AWS Academy Machine Learning et Cloud Architecting, et au prompt engineering.' },
      ],
    },
    contact: {
      path: 'Contact',
      title: 'Trouvons vos gains rapides.',
      subtitle: 'Expliquez-nous vos outils et ce qui prend du temps à vos équipes. En 30 min, on vous dit ce qui est automatisable, et on vous envoie un devis gratuit.',
      book: 'Réserver un audit gratuit',
      bookDesc: '30 min par téléphone ou en visio, sans engagement.',
      email: 'Réponse sous 24h',
      linkedin: 'Ou écrivez directement à un cofondateur sur LinkedIn',
    },
    footer: {
      blurb: 'IA et automatisation intégrées dans les outils de votre entreprise.',
      webSite: 'Besoin d’un site ou d’une application ? Voir nos offres web',
      rights: 'Tous droits réservés.',
      tagline: 'Made in France',
      navigate: 'Navigation',
    },
    assistant: {
      greeting: 'Bonjour ! Je suis l’assistant de 3geeks. Posez-moi vos questions sur l’intégration de l’IA dans vos outils, l’automatisation de vos opérations ou votre projet.',
      suggestions: ['Que pouvez-vous automatiser dans ma logistique ?', 'Pouvez-vous intégrer l’IA à mon logiciel actuel ?', 'Où sont hébergées les données ?', 'Comment se passe le paiement ?'],
    },
  },
  en: {
    meta: {
      title: '3geeks — AI integration and automation for businesses',
      description:
        'Bring AI into the software you already use (ERP, CRM, website, logistics): AI agents, operations automation, document processing, companion apps. Free 30-minute audit, nothing to pay upfront.',
    },
    nav: {
      demo: 'Demo',
      explorer: 'Your processes',
      services: 'Services',
      proof: 'Work',
      method: 'Process',
      cta: 'Book a free audit',
    },
    hero: {
      badge: 'AI & automation for businesses · Made in France',
      titleStart: 'Put AI to work',
      titleEnd: 'inside the tools you already use.',
      comment:
        'You already have a website, business software, an ERP or a CRM. We add AI and automation to them to remove repetitive tasks, answer your customers faster and make use of your data. Without replacing anything.',
      ctaPrimary: 'Book a free audit',
      ctaSecondary: 'See what we can automate',
      trust: [
        { k: '30 min', v: 'free audit to spot your quick wins' },
        { k: '€0', v: 'upfront: you pay once you are happy' },
        { k: 'FR', v: 'models hosted in France or on your servers' },
        { k: 'AWS', v: 'trained and certified team (Cloud Practitioner)' },
      ],
      diagram: {
        inLabel: 'Comes in',
        outLabel: 'Done',
        core: '3geeks AI',
        coreSteps: ['Reads', 'Thinks', 'Acts'],
        caption: 'Your emails, documents and data go in. The tasks come out done.',
        items: [
          { raw: 'Invoice F-2481', rawSub: 'PDF received by email', done: 'Entered in the ERP', doneSub: '€1,248 · matches' },
          { raw: 'Photo DN-0932', rawSub: 'taken by the driver', done: '2 parcels missing', doneSub: 'Manager notified', tone: 'warn' },
          { raw: 'Customer message', rawSub: '“Where is my parcel?”', done: 'Customer answered', doneSub: 'Arrives Thursday' },
          { raw: 'sales.xlsx', rawSub: 'Monday 8:00 am', done: 'Report sent', doneSub: '3 points to watch' },
          { raw: 'Missed call', rawSub: 'Saturday 9:40 pm', done: 'Booking taken', doneSub: 'SMS sent' },
          { raw: 'Order #10611', rawSub: 'from the website', done: 'Stock updated', doneSub: 'Reorder suggested' },
        ],
      },
    },
    demo: {
      path: 'Demo',
      title: 'Watch a process automate itself.',
      subtitle: 'A document comes in, the AI reads it, checks it against your tools and does the work. You stay in control of what matters.',
      badge: 'Illustrative example',
      incoming: 'What comes in',
      extracted: 'What the AI understood',
      pipeline: 'What happens, on its own',
      before: 'Before',
      after: 'With AI',
      replay: 'Replay',
      scenarios: [
        {
          tab: 'Supplier invoice',
          trigger: { kind: 'email', line1: 'invoices@transport-example.com', line2: 'Invoice F-2481 · October', attachment: 'F-2481.pdf' },
          steps: ['Invoice received by email', 'PDF read by the AI', 'Matched with the order in your ERP', 'Entry prepared, approved in 1 click'],
          fields: [
            { k: 'Supplier', v: 'Transport Example' },
            { k: 'Invoice no.', v: 'F-2481' },
            { k: 'Total incl. VAT', v: '€1,248.00' },
            { k: 'Linked order', v: 'PO-4471 · matches', status: 'ok' },
          ],
          result: 'Invoice recorded in the ERP, accounting is notified.',
          before: 'Re-typed by hand',
          after: 'Approved in 1 click',
        },
        {
          tab: 'Delivery note',
          trigger: { kind: 'photo', line1: 'Photo taken by the driver', line2: 'DN-0932 · 14 parcels announced' },
          steps: ['Photo of the note sent from the phone', 'References and quantities read', 'Compared with the order', 'Gap flagged, stock updated'],
          fields: [
            { k: 'Delivery note', v: 'DN-0932' },
            { k: 'Destination', v: 'North warehouse' },
            { k: 'Parcels received', v: '12 / 14', status: 'warn' },
            { k: 'Stock', v: 'Updated', status: 'ok' },
          ],
          result: 'Alert sent to the manager: 2 parcels missing.',
          before: 'Gap found days later',
          after: 'Gap caught on delivery',
        },
        {
          tab: 'Customer question',
          trigger: { kind: 'message', line1: 'Message received at 11:12 pm', line2: '“Hi, where is my order 10582?”' },
          steps: ['Question received on the website, by email or by phone', 'Customer and order identified', 'Status read from your logistics tool', 'Precise answer sent to the customer'],
          fields: [
            { k: 'Customer', v: 'Mrs Durand' },
            { k: 'Order', v: '#10582' },
            { k: 'Status', v: 'Shipped', status: 'ok' },
            { k: 'Expected delivery', v: 'Thursday' },
          ],
          result: 'The customer gets the answer right away, even at night.',
          before: 'Answer the next day',
          after: 'Instant answer, 24/7',
        },
        {
          tab: 'Reporting',
          trigger: { kind: 'schedule', line1: 'Every Monday · 8:00 am', line2: 'ERP · CRM · Excel files' },
          steps: ['Triggered automatically on Monday morning', 'Figures collected from all your tools', 'Indicators and gaps computed', 'Summary sent to management'],
          fields: [
            { k: 'Weekly revenue', v: '€84,300' },
            { k: 'Orders', v: '312' },
            { k: 'Delays', v: '3', status: 'warn' },
            { k: 'Low stock', v: '2 items', status: 'warn' },
          ],
          result: 'The report lands in your inbox, with the points to watch.',
          before: 'Half a day in Excel',
          after: 'Ready before coffee',
        },
      ],
    },
    explorer: {
      path: 'Your processes',
      title: 'What could we automate for you?',
      subtitle: 'Pick a team in your company. For each task, we show you honestly what AI can do on its own, and where your team keeps the decision.',
      levels: {
        auto: { label: 'Automatic', desc: 'The task runs on its own.' },
        validate: { label: 'You approve', desc: 'AI prepares, you approve in 1 click.' },
        assist: { label: 'AI assists', desc: 'AI prepares the file, a person decides.' },
      },
      departments: [
        {
          name: 'Admin & accounting',
          processes: [
            { name: 'Supplier invoice entry', gain: 'Read and pre-filled in your software', level: 'validate' },
            { name: 'Payment reminders', gain: 'Sent at the right time, in the right tone', level: 'auto' },
            { name: 'Bank reconciliation', gain: 'Gaps stand out, the rest is matched', level: 'validate' },
            { name: 'Expense reports', gain: 'Receipts read from a simple photo', level: 'validate' },
          ],
        },
        {
          name: 'Logistics & inventory',
          processes: [
            { name: 'Delivery notes and receipts', gain: 'Read and checked against the order', level: 'validate' },
            { name: 'Stock alerts and reordering', gain: 'Order suggested before you run out', level: 'auto' },
            { name: 'Shipment tracking', gain: 'Delays detected, customer notified', level: 'auto' },
            { name: 'Route planning', gain: 'Optimized proposal, the planner adjusts', level: 'assist' },
          ],
        },
        {
          name: 'Customer service',
          processes: [
            { name: 'Frequent questions', gain: '24/7 answers on the website, by email or phone', level: 'auto' },
            { name: '“Where is my order?”', gain: 'Status read straight from your tools', level: 'auto' },
            { name: 'Incoming request triage', gain: 'Each request to the right person', level: 'auto' },
            { name: 'Complaints and disputes', gain: 'File prepared, your team decides', level: 'assist' },
          ],
        },
        {
          name: 'Sales',
          processes: [
            { name: 'Lead qualification', gain: 'Score and priority as soon as a contact arrives', level: 'auto' },
            { name: 'CRM updates', gain: 'Emails and calls summarized in the customer record', level: 'auto' },
            { name: 'Quotes and proposals', gain: 'Draft generated from the need', level: 'validate' },
            { name: 'Sales follow-ups', gain: 'Personalized follow-up, ready to send', level: 'validate' },
          ],
        },
        {
          name: 'HR & teams',
          processes: [
            { name: 'Internal questions (leave, procedures)', gain: 'Internal assistant answering from your documents', level: 'auto' },
            { name: 'Onboarding new hires', gain: 'Access, documents and steps sent at the right time', level: 'auto' },
            { name: 'Schedules and absences', gain: 'Schedule proposed from your constraints', level: 'validate' },
            { name: 'Screening applications', gain: 'Profile summaries, the decision stays human', level: 'assist' },
          ],
        },
        {
          name: 'Management',
          processes: [
            { name: 'Weekly reporting', gain: 'Summary sent every Monday morning', level: 'auto' },
            { name: 'Dashboards', gain: 'All your data in one place, up to date', level: 'auto' },
            { name: 'Long document summaries', gain: 'Contracts and tenders summarized', level: 'validate' },
            { name: 'Sales and stock forecasts', gain: 'Trends and alerts to help you decide', level: 'assist' },
          ],
        },
      ],
      cta: 'Find my quick wins',
      limits: {
        title: 'What we don’t automate',
        subtitle: 'AI is excellent at repetitive tasks. For the rest, we tell you straight.',
        items: [
          { t: 'Sensitive decisions', d: 'Hiring, disputes, sanctions: AI prepares, a person decides.' },
          { t: 'Anything binding without review', d: 'Contracts and legal letters always go through approval.' },
          { t: 'A process that doesn’t exist yet', d: 'If the data is scattered, we start by structuring it.' },
          { t: 'AI for its own sake', d: 'If a simple script does the job, we write the script. It costs less.' },
        ],
      },
    },
    services: {
      path: 'Our AI services',
      title: 'Six concrete ways to use AI in your business.',
      subtitle: 'Every service starts from your current tools and data. No platform to replace, no over-engineering.',
      items: [
        {
          title: 'AI integration into your software',
          desc: 'We plug AI into your ERP, CRM, back office or business software through their APIs: an assistant inside the tool, answers drawn from your documents, fields filled automatically.',
          bullets: ['Internal assistant answering from your documents', 'Connected to what exists: APIs, exports, databases', 'Automatic drafting and pre-filling'],
        },
        {
          title: 'Logistics & operations automation',
          desc: 'Orders, delivery notes, invoices, inventory, planning: we automate the steps that cost your teams time every day.',
          bullets: ['Automatic reading of delivery notes, invoices and orders', 'Real-time stock, delay and anomaly alerts', 'Assisted planning and routing'],
        },
        {
          title: 'AI agents: chat, email, phone',
          desc: 'An agent that answers your customers 24/7 on your website, by email or on the phone, qualifies requests and hands the rest to your team.',
          bullets: ['Customer support and FAQ 24/7', 'Qualification and triage of incoming requests', 'AI phone reception, like CallKitchen'],
        },
        {
          title: 'Documents & data',
          desc: 'Information extraction from your contracts, invoices and emails, automatic filing, dashboards and forecasts built on your data.',
          bullets: ['Automatic extraction and filing', 'Dashboards and reporting', 'Forecasts: sales, stock, workload'],
        },
        {
          title: 'Companion apps',
          desc: 'A web or mobile app connected to your system: customer area, field tool for your teams, supplier or partner portal.',
          bullets: ['Web or iOS app connected to your data', 'Customer area or partner portal', 'Field tool for teams'],
        },
        {
          title: 'Scoping & training',
          desc: 'We identify the profitable use cases, set the data privacy rules and train your teams to use AI every day.',
          bullets: ['Use-case audit and prioritization', 'Privacy rules and access rights', 'Team training: prompts, good practice'],
        },
      ],
    },
    proof: {
      path: 'Already in production',
      title: 'AI and automations that already run.',
      subtitle: 'A few examples delivered by 3geeks, for clients and in our own tools.',
      open: 'Open',
      privateTag: 'Private project',
      items: [
        {
          name: 'CallKitchen',
          title: 'AI phone reception for restaurants',
          desc: 'Voice agent that takes orders and bookings 24/7, answers menu questions, notifies the team by SMS and feeds a kitchen dashboard.',
          tags: ['Voice agent', 'SMS', 'Dashboard'],
          link: 'https://call-kitchen-landing.vercel.app',
        },
        {
          name: '3geeks assistant',
          title: 'This site’s AI assistant',
          desc: 'The assistant in the bottom right answers in about a second from our knowledge base, with a French model from Mistral AI and a fallback on our own servers. Try it: this is what we can deploy on your website or internally.',
          tags: ['Mistral AI', 'RAG', 'Fallback on our servers'],
        },
        {
          name: 'Contract signing',
          title: 'Documents generated and signed automatically',
          desc: 'Per-role signing links, status tracking and a consolidated PDF updated with every signature, with an admin dashboard.',
          tags: ['Dynamic PDF', 'Workflow', 'Dashboard'],
          isPrivate: true,
        },
        {
          name: 'Prompt Hub',
          title: 'Our in-house AI tool',
          desc: 'Prompt Hub turns an idea into a step-by-step execution plan orchestrated by AI agents, with ready-to-use prompts.',
          tags: ['Multi-agent', 'AI planning'],
          link: 'https://prompt-hub.3geeks.fr/',
        },
      ],
    },
    method: {
      path: 'Process',
      title: 'A pilot in a few weeks, not a six-month project.',
      subtitle: 'We start small, on one precise and measurable case, then extend what works.',
      steps: [
        { t: 'Free audit · 30 min', d: 'We review your tools and repetitive tasks to spot two or three quick wins.' },
        { t: 'Pilot on one case', d: 'We deliver a first working use case, connected to your real data, to measure the gain.' },
        { t: 'Integration & security', d: 'We integrate it into your tools, with clear data rules: models hosted in France or on your servers if needed.' },
        { t: 'Rollout & follow-up', d: 'Team training, results tracking and continuous improvements. You pay once you are happy.' },
      ],
    },
    why: {
      path: 'Why 3geeks',
      title: 'AI engineers, directly. No middleman.',
      subtitle: 'Elias and Noam, the co-founders, work on generative AI and cloud projects every day. You talk directly to the people who build.',
      cards: [
        { title: 'Your data stays under control', desc: 'Models hosted in France, on our servers or yours. Nothing is sent to a third-party service without your agreement.' },
        { title: 'Works with what you have', desc: 'We build on your APIs, exports and databases. Your ERP, CRM and website stay in place.' },
        { title: 'Code that belongs to you', desc: 'Everything we build is in your name: source code, prompts, integrations. No dependency on 3geeks.' },
        { title: 'Trained in cloud and AI', desc: 'Team trained and certified by AWS (Cloud Practitioner), trained through the AWS Academy Machine Learning and Cloud Architecting courses, and in prompt engineering.' },
      ],
    },
    contact: {
      path: 'Contact',
      title: 'Let’s find your quick wins.',
      subtitle: 'Tell us about your tools and what costs your teams time. In 30 minutes we tell you what can be automated, then send a free quote.',
      book: 'Book a free audit',
      bookDesc: '30 minutes by phone or video call, no commitment.',
      email: 'Reply within 24h',
      linkedin: 'Or reach a co-founder directly on LinkedIn',
    },
    footer: {
      blurb: 'AI and automation built into your company’s tools.',
      webSite: 'Need a website or an app? See our web offers',
      rights: 'All rights reserved.',
      tagline: 'Made in France',
      navigate: 'Navigate',
    },
    assistant: {
      greeting: 'Hi! I’m the 3geeks assistant. Ask me about bringing AI into your tools, automating your operations, or your own project.',
      suggestions: ['What can you automate in my logistics?', 'Can you add AI to my current software?', 'Where is the data hosted?', 'How does payment work?'],
    },
  },
};
