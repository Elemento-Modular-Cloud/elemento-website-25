#!/usr/bin/env node
/**
 * Apply Italian localization review (May 2026) to strings-it.json and replacements/it.json.
 * Run: node scripts/apply-it-review-may2026.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRINGS_PATH = join(ROOT, 'localization/strings-it.json');
const REPLACEMENTS_PATH = join(ROOT, 'src/i18n/replacements/it.json');

/** Match by exact English `en` field */
const EN_TO_IT = {
  'Ready. Set. Cloud.': 'Ready. Set. Cloud.',
  'Build and Run Your Own Cloud Infrastructure with No Lock-In':
    'Costruisci ed orchestra la tua infrastruttura cloud senza vincoli',
  'Elemento lets you build and run your own cloud infrastructure with complete freedom. You choose where it runs and we automate everything for you. Your cloud. Your rules, Your freedom.':
    'Elemento ti consente di creare ed gestire la tua infrastruttura cloud in completa libertà. Scegli dove eseguirlo e noi automatizziamo tutto per te. Il tuo cloud. Le tue regole. La tua libertà.',
  'Your Cloud , Your Control': 'Il tuo cloud, sotto il tuo controllo',
  'We unify all Clouds into a universal platform that gives you freedom of choice, the best prices and the flexibility to move seamlessly between public and private Clouds. With Elemento, you set your rules for how your infrastructure operates, ensuring complete freedom from vendor lock-in. Learn more about our mission and values or explore our complete product suite .':
    'Uniamo tutti i Cloud in una piattaforma universale che ti offre libertà di scelta, i migliori prezzi e la flessibilità di spostarti senza problemi tra Cloud pubblici e privati. Con Elemento, imposti le tue regole su come funziona la tua infrastruttura, garantendo la completa libertà dai vincoli dei fornitori. Scopri di più sulla nostra <a href="about.html">missione e valori</a> o esplora la nostra <a href="products.html">suite completa di prodotti</a>.',
  'Manage all resources from a single interface or via CLI - your rules, your way':
    "Gestisci tutte le risorse da un'unica interfaccia grafica (GUI) o tramite CLI: le tue regole, a modo tuo",
  'Assemble and scale VMs, storage, and networking as needed':
    'Componi e scala VM, storage e rete secondo necessità',
  'Meet the Cloud Factory Components': 'Scopri i prodotti di Elemento Cloud',
  'Production-grade, KVM-based hypervisor for running VMs on bare metal, edge, or enterprise clusters. Deploy in minutes with enterprise-grade security, GPU passthrough support, and full RHEL compatibility.':
    "Hypervisor per ambienti di produzione basato su KVM per l'esecuzione di VM su cluster bare metal, edge o aziendali. Distribuisci in pochi minuti con sicurezza di livello enterprise, supporto passthrough GPU e compatibilità RHEL completa.",
  'Learn About AtomOS': 'Scopri di più su AtomOS',
  'Unified GUI and CLI to deploy, monitor, and orchestrate virtual machines across any cloud or infrastructure. Control your entire cloud environment from one intuitive interface with real-time insights, automated scaling, and cross-platform compatibility.':
    "Dashboard (GUI) e CLI unificate per distribuire, monitorare e orchestrare macchine virtuali su qualsiasi cloud o infrastruttura. Controlla l'intero ambiente cloud da un'unica interfaccia intuitiva con approfondimenti in tempo reale, scalabilità automatizzata e compatibilità multipiattaforma.",
  'Learn About Atomosphere': 'Scopri di più su Atomosphere',
  'Learn About Electros': 'Scopri di più su Electros',
  'Inside the Elemento Cloud Architecture': "L'architettura Elemento Cloud",
  'From hypervisors to APIs, every layer is programmable and vendor-neutral.':
    'Dagli hypervisor alle API, ogni livello è programmabile e indipendente dai fornitori.',
  'Enterprise-grade infrastructure designed for modern cloud-native applications. Full reference available in our technical documentation .':
    'Infrastruttura di livello Enterprise progettata per le moderne applicazioni cloud-native. Riferimento completo disponibile nella nostra <a href="technology.html">documentazione tecnica</a>.',
  'Data sovereignty through self-hostable distributions':
    'Sovranità dei dati tramite distribuzioni auto-ospitabili',
  'AlmaLinux (RHEL binary compatible)': 'AlmaLinux (compatibile con RHEL binary)',
  'Upstream "Vanilla" KVM/QEMU': "Upstream 'Vanilla' KVM/QEMU",
  'Auto-discovery w/ License (C4 protocol)':
    'Rilevamento automatico con licenza (grazie al nostro protocollo C4 brevettato)',
  'Auto-discovery w/ License (with our C4 patented protocol)':
    'Rilevamento automatico con licenza (grazie al nostro protocollo C4 brevettato)',
  'Whether you\'re a startup scaling rapidly or an enterprise modernizing legacy systems, Elemento adapts to your needs. Discover our advanced technology stack and read success stories on our blog .':
    'Che tu sia una startup che si espande rapidamente o un\'azienda che modernizza i sistemi legacy, Elemento si adatta alle tue esigenze. Scopri il nostro <a href="technology.html">stack tecnologico avanzato</a> e leggi le storie di successo sul nostro <a href="blog.html">blog</a>.',
  'Launch quickly without vendor lock-in. Scale efficiently as you grow with predictable costs and full control over your infrastructure. Set your rules for deployment and enjoy complete freedom from vendor constraints. Perfect for rapid prototyping and MVP development.':
    "Inizia rapidamente senza vincoli di fornitore. Scala in modo efficiente man mano che cresci con costi prevedibili e pieno controllo sulla tua infrastruttura. Imposta le tue regole per l'implementazione e goditi la completa libertà dai vincoli dei fornitori. Perfetto per la prototipazione rapida e lo sviluppo MVP.",
  'Data Science & AI': 'Data science e intelligenza artificiale',
  'Join hundreds of organizations that have revolutionized their cloud operations with Elemento. Learn about our company mission and explore our product solutions .':
    'Unisciti a centinaia di aziende che hanno rivoluzionato le loro operazioni cloud con Elemento. Scopri la nostra <a href="about.html">missione aziendale</a> ed esplora le nostre <a href="products.html">soluzioni di prodotto</a>.',
  Organizations: 'Aziende',
  'Deploy in minutes': 'Distribuisci in pochi minuti',
  'Scale as you grow': 'Scala man mano che cresci',
  'Enterprise security': 'Sicurezza enterprise',
  'Zero-downtime migration': 'Migrazione senza downtime',
  'Compliance certified': 'Conformità certificata',
  'Multi-cloud support': 'Supporto multi-cloud',
  'Infrastructure as Code': 'Infrastructure as Code',
  'Automated workflows': 'Flussi di lavoro automatizzati',
  'Tool integration': 'Integrazione strumenti',
  'Build. Deploy. Scale.': 'Costruire, Distribuire. Scalare.',
  'Discover our company mission and technical architecture':
    'Scopri la nostra missione aziendale e l\'architettura tecnica',
  'Deploy AtomOS on your own private servers. Full control over hardware, networking, and security with autonomous clustering via C4 protocol. Learn more about our C4 protocol technology and deployment support .':
    'Distribuisci AtomOS sui tuoi server privati. Controllo completo su hardware, rete e sicurezza con clustering autonomo tramite protocollo C4. Ulteriori informazioni sulla <a href="technology.html">tecnologia del protocollo C4</a> e sul <a href="contact.html">supporto per l\'implementazione</a>.',
  Full: 'Controllo completo',
  'No vendor lock-in. Use your existing cloud accounts, infrastructure, and tools. Elemento works with your current setup, not against it. Read our vendor neutrality philosophy and company values .':
    'Nessun vincolo al fornitore. Utilizza gli account, l\'infrastruttura e gli strumenti cloud esistenti. Elemento funziona con la tua configurazione attuale, non contro essa. Leggi la nostra filosofia di neutralità del fornitore sul <a href="blog.html">blog</a> e i <a href="about.html">valori aziendali</a>.',
  'Server-based pricing instead of per-CPU or per-VM licensing. Encourages efficient resource utilization and reduces total cost of ownership. Discover our sustainable cloud initiatives and pricing models .':
    'Prezzi basati su server invece che su licenza per CPU o per VM. Incoraggia l\'utilizzo efficiente delle risorse e riduce il costo totale di gestione. Scopri le nostre <a href="blog.html">iniziative di cloud sostenibile</a> e i nostri <a href="products.html">modelli di prezzo</a>.',
  '✓ Green computing incentives': '✓ Incentivi per il green computing',
  'Join organizations transforming their infrastructure with cost-effective, vendor-independent cloud solutions. Learn more about our team and mission or explore our success stories .':
    'Unisciti alle aziende che trasformano la propria infrastruttura con soluzioni cloud convenienti e indipendenti dai fornitori. Scopri di più sul nostro <a href="about.html">team e sulla nostra missione</a> o esplora le nostre <a href="blog.html">storie di successo</a>.',
  'No customisation. No forks. Just a solid, upstream-aligned base that powers enterprise-grade reliability.':
    "Nessuna personalizzazione. Nessun fork. Solo una base solida e allineata a monte che alimenta l'affidabilità a livello enterprise.",
  'AtomOS runs on a RHEL-compliant underlying OS with no customisation or forks. That means you get all the benefits of the Red Hat ecosystem: field-tested stability, enterprise-grade support, and full compatibility with the RHEL ecosystem.':
    "AtomOS viene eseguito su un sistema operativo sottostante conforme a RHEL, senza personalizzazione o fork. Ciò significa che otterrai tutti i vantaggi dell'ecosistema Red Hat: stabilità testata sul campo, supporto di livello enterprise e compatibilità completa con l'ecosistema RHEL.",
  'The kernel is mainline Linux: no vendor patches or proprietary extensions. This enables incredible hardware support and super-fast security updates (and updates in general).':
    "Il kernel è Linux mainline: nessuna patch del fornitore o estensioni proprietarie. Ciò consente un incredibile supporto hardware e aggiornamenti di sicurezza super veloci (e aggiornamenti in generale).",
  'RHEL-compliant base — no customisation, no forks': 'Base conforme a RHEL: nessuna personalizzazione, nessun fork',
  'Upstream and fast': 'Upstream e veloce',
  'Automatic passthrough': 'Passthrough automatico',
  'AtomOS Installation Guide': 'Guida all\'installazione di AtomOS',
  'Thin provisioning': 'Thin Provisioning',
  'You-Know-Who vs AtomOS: hypervisor showdown': 'Tu-Sai-Chi contro AtomOS: resa dei conti fra hypervisor',
  'vCenter server virtual machine': 'Macchina virtuale del server vCenter',
  'For performance, use raw or qcow2 on native stable Linux FS (EXT4, XFS). Avoid BTRFS/Ref stacking with qcow2.':
    "Per le prestazioni, utilizza 'raw' o qcow2 su FS stabile nativo di Linux (EXT4, XFS). Evita lo stacking BTRFS/Ref con qcow2.",
  'AtomOS implements Elemento\'s C4 protocol for automatic peer discovery and trust-based node linking. No need for orchestrators, matchmaker services, or controller VMs.':
    "AtomOS implementa il protocollo C4 di Elemento per il rilevamento automatico dei peer e il collegamento dei nodi basato sul trust. Non sono necessari orchestratori, servizi di matchmaker o VM controller.",
  'Key benefits:': 'Vantaggi principali:',
  '✓ Perfect for labs, makers, and DevOps hobbyists': '✓ Perfetto per laboratori, makers e hobbisti DevOps',
  'Server-based pricing favors green economics': 'I prezzi basati su server favoriscono l\'economia green',
  'Green economics benefits:': 'Vantaggi per l\'economia green:',
  'Lower total cost of ownership and operational expenses': 'Costo totale di proprietà (TCO) e spese operative inferiori',
  'Core hypervisor is open. Electros and C4 protocol orchestration layers are licensed with commercial support options.':
    "L'hypervisor principale è open. I livelli di orchestrazione del protocollo Electros e C4 sono concessi in licenza con opzioni di supporto commerciale.",
  'Electros: Any-Cloud Control Center': 'Electros: La dashboard Centro di controllo di ogni Cloud',
  'Electros: Universal Dashboard': 'Dashboard universale',
  'Electros: The orchestration dashboard for any cloud':
    'Electros: La dashboard di orchestrazione per tutti i cloud',
  'Real-time cost monitoring for cloud workloads': 'Monitoraggio dei costi in tempo reale per i carichi di lavoro cloud',
  'Deep integration with AtomOS and Atomosphere': 'Profonda integrazione con AtomOS e Atomosphere',
  'Download Electros now': 'Scarica subito Electros',
  'Surfaces to run Linux, macOS, Windows, and elemento-cli apps': 'Modalità per eseguire l\'app Linux, macOS, Windows e elemento-cli',
  'Ship-ready AppImage, DMG, EXE, and DEB builds—x64 and ARM64 where supported':
    'Build pronte AppImage, DMG, EXE e DEB—x64 e ARM64 dove supportato',
  'AWS, Azure, Google Cloud, and on-prem hybrid targets':
    'Target cloud e ibridi AWS, Azure, Google Cloud e all\'infrastruttura on-premise',
  'We were juggling a dozen consoles. With Electros, it feels like one window onto millions of machines worldwide, whether we need a beefy CPU host, a massive GPU stack for AI, or something in between. When we need something more exotic on-prem, we still use the same interface. That consistency is what sold us.':
    "Ci destreggiavamo tra una dozzina di console. Con Electros, abbiamo una finestra su migliaia di macchine in tutto il mondo, sia che abbiamo bisogno di un potente host CPU, di un massivo stack di GPU per l'intelligenza artificiale o di qualcosa di intermedio. Quando abbiamo bisogno di qualcosa di più unico on-prem, utilizziamo comunque la stessa interfaccia. Questa coerenza è ciò che ci ha convinti ad adottare Electros.",
  'Download Electros': 'Scarica Electros',
  'Verify Downloads': 'Verifica il Download',
  'Electros CLI Installation Guide': 'Guida all\'installazione della CLI Electros',
  'Make sure you have Python 3.9+ installed': 'Assicurati di avere Python 3.9+ installato',
  'Technical architecture:': 'Architettura tecnica:',
  'Desktop and CLI share the same foundations for VMs, storage, and networking. Today some flows are richer on one surface than the other; alignment improves with every release.':
    'Desktop e CLI si basano sulle stesse fondamenta per VM, lo storage e la rete. Oggi alcuni flussi sono più completi in alcuni di questi; l\'allineamento migliora con ogni nuova versione che rilasciamo.',
  'In development': 'In sviluppo',
  'Yes, Electros is free with your Elemento account. No additional licensing costs required.':
    'Sì, la versione attuale di Electros è gratuita con il tuo account Elemento. Non sono richiesti costi di licenza aggiuntivi. Future versioni potranno essere a pagamento.',
  'YES. Both use the same core services, but coverage differs: today some tasks are desktop-first or CLI-first. Check release notes for what each surface supports.':
    'SÌ. Entrambi utilizzano gli stessi servizi principali, ma la copertura è diversa: oggi alcune attività sono desktop-first o CLI-first. Controlla le note sulla versione per ciò che supporta ciascuna modalità.',
  'Connect. Unify. Control.': 'COLLEGARE. UNIFICARE. CONTROLLARE.',
  'Instead of learning separate APIs for AWS, Azure, Google Cloud, and other CSPs, Atomosphere provides one API to rule them all while you continue using your existing cloud accounts.':
    "Invece di apprendere API separate per AWS, Azure, Google Cloud e altri CSP (cloud service provider), Atomosphere fornisce un'unica API per gestirli tutti mentre continui a utilizzare i tuoi account cloud esistenti.",
  'Real-time cost comparison across providers': 'Confronta i costi in tempo reale tra i fornitori',
  'Launch a VM wherever you want, all through the same dashboard or script: cloud-agnostic PaaS provisioning.':
    'Avvia una VM ovunque tu voglia, il tutto tramite la stessa dashboard o script: provisioning PaaS indipendente dal cloud.',
  'The Elemento API proxy sits between your applications and CSP APIs, providing unified access while you continue billing directly with your existing cloud providers. No markup, no intermediary billing.':
    "Il proxy API Elemento è un layer che si trova tra le tue applicazioni e le API dei CSP, fornendo accesso unificato mentre continui a fatturare direttamente con i tuoi fornitori cloud esistenti. Non applichiamo nessun markup, nessun costo come intermediari.",
  'Proxy benefits:': 'Vantaggi del proxy:',
  'Keep existing CSP accounts and billing': 'Mantieni gli account e la fatturazione con i CSP esistenti',
  'Learn one API instead of many CSP APIs': 'Apprendi una API singola invece di più API dei CSP',
  'Seamless Electros integration': 'Perfetta integrazione con Electros',
  'Get Started with Atomosphere': 'Inizia con Atomosphere',
  'INNOVATE. ENGINEER. TRANSFORM.': 'INNOVARE. ORCHESTRARE. TRASFORMARE.',
  'For architecture diagrams, install guides, and protocol detail, see our technical documentation on BookStack. Explore our product implementations and learn about our company vision.':
    'Per diagrammi dell\'architettura, guide di installazione e dettagli sul protocollo, consulta la nostra <a href="https://bookstack.elemento.cloud" target="_blank" rel="noopener noreferrer">documentazione tecnica su BookStack</a>. Esplora le nostre <a href="products.html">implementazioni dei prodotti</a> e scopri la nostra <a href="about.html">visione aziendale</a>.',
  'With a cloud-agnostic and infrastructure-neutral design, Elemento ensures businesses can scale, adapt, and innovate without vendor lock-in.':
    "Con un design indipendente dal cloud e svincolato dall'infrastruttura, Elemento garantisce che le aziende possano scalare, adattarsi e innovare senza vincoli con i fornitori.",
  'C4 Protocol for standardized connectivity': 'Protocollo C4 per connettività standardizzata',
  'Vendor lock-in prevention': 'Prevenzione del lock-in dei fornitori',
  'The same material we use for onboarding and integration lives in one place: starter packs, C4 whitepapers and protocol specs, AtomOS and Nucleus CLI install guides, Electros tech notes, comparison tables against legacy hypervisors, and reference architecture. Follow the links below to read the full chapters.':
    "Lo stesso materiale che utilizziamo per l'onboarding e l'integrazione si trova in un unico posto: informazioni per iniziare, C4 e specifiche del protocollo, guide di installazione della CLI di AtomOS, note tecniche di Electros, tabelle di confronto con hypervisor legacy e architettura di riferimento. Segui i link sottostanti per leggere i contenuti completi.",
  'Elemento Cloud Network': 'Elemento Cloud Network',
  'Open book': 'Apri',
  'View comparisons': 'Guarda le comparazioni',
  'Feature-by-feature views': 'Confronto funzione per funzione',
  'Our patented C4 protocol (patented in Italy, patent pending worldwide) is a standardized protocol that enables cloud service providers to integrate seamlessly with enterprise-grade multi-cloud management platforms. This revolutionary technology simplifies cloud service provider integration and expands market reach. The Elemento Cloud Network book on BookStack hosts the C4 whitepaper, connector specifications, and Meson technology pack to map existing provider APIs into C4-type services. Discover our product ecosystem and technical insights.':
    'Il nostro protocollo C4 brevettato (in Italia e in altri paesi nel mondo) è un protocollo standardizzato che consente ai fornitori di servizi cloud di integrarsi perfettamente con piattaforme di gestione multi-cloud di livello enterprise. Questa tecnologia rivoluzionaria semplifica l\'integrazione del fornitore di servizi cloud e amplia la portata del mercato. La documentazione Rete Elemento Cloud su BookStack ospita il white paper su C4, le specifiche del connettore e il pacchetto tecnologico Meson per mappare le API dei provider esistenti in servizi di tipo C4. Scopri il nostro <a href="https://bookstack.elemento.cloud/books/elemento-cloud-network" target="_blank" rel="noopener noreferrer">ecosistema di prodotti</a> e gli <a href="blog.html">approfondimenti tecnici</a>.',
  'Enterprise-grade security': 'Sicurezza di livello enterprise',
  'The central management layer that orchestrates all platform operations, including the Kubernetes control plane, API gateway, and management interfaces. Documentation describes it as the Elemento Cloud Network gateway connecting existing clouds into a single operational model.':
    'Il livello di gestione centrale che orchestra tutte le operazioni della piattaforma, incluso il piano di controllo Kubernetes, il gateway API e le interfacce di gestione. La documentazione lo descrive il gateway Elemento Cloud Network che collega i cloud esistenti in un unico modello operativo.',
  'User interfaces, APIs, and automation tools that provide access to platform capabilities and enable infrastructure as code. Electros covers desktop and mobile control planes for the full VM lifecycle across any cloud, while Nucleus documents the CLI for installing and operating AtomOS — both are indexed on BookStack.':
    "Interfacce utente, API e strumenti di automazione che forniscono accesso alle funzionalità della piattaforma e abilitano l'infrastruttura come codice. Electros copre i piani di controllo desktop e mobili per l'intero ciclo di vita delle VM su qualsiasi cloud, trovi anche documenti sulla CLI per l'installazione e il funzionamento di AtomOS: entrambi sono presenti su BookStack.",
  'Technology Stack Modern proven technologies powering our cloud-native platform':
    'Stack tecnologico Tecnologie moderne e comprovate che alimentano la nostra piattaforma cloud nativa',
  'Green workload placement': 'Posizionamento del carico di lavoro green',
  'Continuously evolving to meet enterprise needs':
    'In continua evoluzione per stare al passo con le esigenze delle aziende',
  'Carbon-aware computing': 'Sensibili al tema della CO2',
  'Advanced algorithms that consider carbon intensity when making workload placement decisions.':
    "Algoritmi avanzati che considerano l'intensità di CO2 quando si prendono decisioni sul posizionamento del carico di lavoro.",
  'If you\'re looking to get started with Elemento, need technical support, or want to explore partnership opportunities, we\'re here to help. Discover our technical capabilities and read our latest insights and updates.':
    'Se vuoi iniziare lavorare con Elemento, hai bisogno di supporto tecnico o desideri esplorare opportunità di partnership, siamo qui per aiutarti. Scopri le nostre <a href="technology.html">capacità tecniche</a> e leggi i nostri ultimi <a href="blog.html">approfondimenti e aggiornamenti</a>.',
  'I agree to the Terms and Conditions (IT), Privacy Policy, and Cookie Policy':
    'Ho letto e acconsento a Terms and Conditions (IT), Privacy Policy, e Cookie Policy',
  'Free parking available': 'Parcheggio gratuito disponibile',
  '5 min walk from Cuneese Station': '5 minuti a piedi dalla stazione di Cuneo',
  '1 h from Torino Airport': "1 ora dall'aeroporto di Torino",
  'By train': 'In treno',
  'By plane': 'In aereo',
  'We offer comprehensive support including 24/7 documentation, community forums, email support, and priority support for enterprise customers. Our support team has an average response time of under 2 hours.':
    'Offriamo supporto completo che include: accesso alla documentazione 24 ore su 24, 7 giorni su 7, forum della community, supporto tramite posta elettronica e supporto prioritario per i clienti che acquistano tale opzione. Il nostro team di supporto ha un tempo di risposta medio inferiore a 2 ore.',
  'At Elemento, we believe cloud infrastructure should be accessible, affordable, and environmentally responsible. Our mission is to democratize cloud computing by providing vendor-neutral solutions that give organizations complete control over their infrastructure while reducing costs and environmental impact. Explore our complete product suite and discover our innovative technology.':
    'Noi di Elemento crediamo che l\'infrastruttura cloud debba essere accessibile, conveniente e rispettosa dell\'ambiente. La nostra missione è democratizzare il cloud computing fornendo soluzioni indipendenti dal fornitore che offrano alle aziende il controllo completo sulla propria infrastruttura riducendo al contempo i costi e l\'impatto ambientale. Esplora la nostra <a href="products.html">suite completa di prodotti</a> e scopri la nostra <a href="technology.html">tecnologia innovativa</a>.',
  'We\'re building the future of cloud computing—one that prioritizes performance, affordability, and sustainability without compromising enterprise-grade security and reliability. Read our latest innovations on our blog and contact us to learn more.':
    'Stiamo costruendo il futuro del cloud computing, che dà priorità a prestazioni, convenienza e sostenibilità senza compromettere la sicurezza e l\'affidabilità di livello enterprise. Leggi le nostre ultime innovazioni sul nostro <a href="blog.html">blog</a> e <a href="contact.html">contattaci</a> per saperne di più.',
  'Pioneering the next generation of cloud infrastructure with cutting-edge technology and sustainable practices. Discover our technical innovations and product capabilities.':
    'Siamo pionieri della prossima generazione di infrastrutture cloud con tecnologia all\'avanguardia e pratiche sostenibili. Scopri le nostre <a href="technology.html">innovazioni tecniche</a> e le <a href="products.html">capacità dei prodotti</a>.',
  'Making cloud computing accessible to organizations of all sizes through intelligent optimization and transparent pricing.':
    'Rendere il cloud computing accessibile alle aziende di tutte le dimensioni attraverso l\'ottimizzazione intelligente e prezzi trasparenti.',
  'Committed to reducing the environmental impact of cloud computing through green technology and energy optimization.':
    'Siamo impegnati a ridurre l\'impatto ambientale del cloud computing attraverso la tecnologia green e l\'ottimizzazione energetica.',
  'Delivering enterprise-grade performance and reliability without compromising speed or scalability.':
    'Offrire prestazioni e affidabilità di livello enterprise senza compromettere velocità o scalabilità.',
  'Milestones and equity story aligned with our public Crunchbase profile (founded 2021, based in Cuneo, Italy).':
    'Pietre miliari e eventi propali della nostra storia aziendale iniziata a Cuneo nel 2021',
  'We sharpen go-to-market around high-impact trajectories called out in innovation-cluster and ecosystem profiles: IoT, AI, blockchain & Web3, advanced computing, and polished UX—spanning smart infrastructure, industry, fintech, healthcare, education, and digital public services.':
    'Affiniamo la go-to-market su traiettorie ad alto impatto evidenziate nei profili di cluster di innovazione ed ecosistema: IoT, AI, blockchain e Web3, advanced computing e UX curata—dall\'infrastruttura intelligente all\'industria, fintech, sanità, istruzione e servizi pubblici digitali.',
  'We closed our seed round (March 2024), with Fin+Tech as lead investor and additional institutional participation; round size is summarized on aggregators and Crunchbase. Our commercial model (hardware and software, support plans, and network resource exchange) fits this capital. Open engineering continues on GitHub.':
    'Chiudiamo il nostro finanziamento seed (marzo 2024), con Fin+Tech come investitore principale e un\'ulteriore partecipazione istituzionale; la dimensione del round è disponibile su Crunchbase. Il nostro modello commerciale (hardware e software, piani di supporto e scambio di risorse di rete) si arricchisce grazie a questo capitale. L\'ingegneria aperta continua su GitHub.',
  'Press coverage has highlighted company momentum, collaboration with partners like Dell Technologies, participation in the NVIDIA Inception program, and support from CDP and the Fin+Tech accelerator.':
    'La copertura stampa ha evidenziato la crescita aziendale, la collaborazione con partner come Dell Technologies, la partecipazione al programma NVIDIA Inception e il supporto di CDP e dell\'acceleratore Fin+Tech.',
  'Updated funding and company facts remain on Crunchbase.':
    'Leggi su Crunchbase la notizia relativa al nostro nuovo round di finanziamenti.',
  'Learn more about the atmosphere': 'Scopri di più su Atomosphere',
  'Learn more about AtomOS': 'Scopri di più su AtomOS',
  'Ulteriori informazioni su AtomOS': 'Scopri di più su AtomOS',
  'Install Linux OS based on what kind of node you desire:':
    'Installa un OS Linux in base al tipo di nodo che desideri:',
  'Install the AtomOS services': 'Installa i servizi AtomOS',
  'Now you can use the AtomOS CLI to install AtomOS':
    'Ora puoi usare la CLI AtomOS per installare AtomOS',
  'Use on-prem for local installations or cloud if you are on a CSP bare metal.':
    'Usa on-prem per installazioni locali o cloud se sei su bare metal di un CSP.',
  'Install for a storage-only node:': 'Installa per un nodo solo storage:',
  'Install for a compute-only node:': 'Installa per un nodo solo compute:',
  'Install for a complete AtomOS version:': 'Installa una versione AtomOS completa:',
  'Follow AtomOS CLI indications to conclude the configuration:':
    'Segui le indicazioni della CLI AtomOS per completare la configurazione:',
  'Install additiona modules (ZFS, GlusterFS)': 'Installa moduli aggiuntivi (ZFS, GlusterFS)',
  'Setup the storage': 'Configura lo storage',
  'Setup the network': 'Configura la rete',
  'Access Web UI at': 'Accedi alla Web UI su',
  'Reboot the host.': 'Riavvia l\'host.',
  'Install Electros on your PC or Mac to launch and manage VMs from anywhere':
    'Installa Electros sul tuo PC o Mac per avviare e gestire le VM da qualsiasi luogo',
  'Universal Dashboard': 'Dashboard universale',
  'Manage VMs across AWS, Azure, Google Cloud, and on-premise infrastructure from one interface':
    'Gestisci le VM su AWS, Azure, Google Cloud e infrastruttura on-premise da un\'unica interfaccia',
  'Browse books': 'Sfoglia i libri',
  'Read in wiki': 'Leggi nel wiki',
  'Open tech pack': 'Apri il tech pack',
  'Search wiki': 'Cerca nel wiki',
  'Desktop and CLI build on the same foundations for VMs, storage, and networking. Today some flows are richer in one surface than the other; alignment improves with each release.':
    'Desktop e CLI si basano sulle stesse fondamenta per VM, lo storage e la rete. Oggi alcuni flussi sono più completi in alcuni di questi; l\'allineamento migliora con ogni nuova versione che rilasciamo.',
  'Multi- and hybrid-cloud ready': 'Predisposizione per multi-cloud e cloud ibrido',
  'Use existing CSP accounts and credentials': 'Utilizza gli account cloud e le credenziali esistenti',
  'Deep integration with Electros orchestration dashboard and CLI':
    'Profonda integrazione con la dashboard di orchestrazione e la CLI di Electros',
  'Build your cloud with vendor-neutral, high-performance components that work seamlessly together. Learn about our company mission and technical architecture .':
    'Costruisci il tuo cloud con componenti indipendenti dai fornitori e ad alte prestazioni che funzionano perfettamente insieme. Scopri la nostra <a href="about.html">missione aziendale</a> e l\'<a href="technology.html">architettura tecnica</a>.',
};

/** Replace within existing Italian strings */
const IT_GLOBAL = [
  ['Costruisci ed esegui', 'Costruisci ed orchestra'],
  ['eseguire la tua', 'gestire la tua'],
  ['creare ed eseguire', 'creare ed gestire'],
  ['Il tuo cloud, il tuo controllo', 'Il tuo cloud, sotto il tuo controllo'],
  ['dal vincolo del fornitore', 'dai vincoli dei fornitori'],
  ["un'unica interfaccia o tramite", "un'unica interfaccia grafica (GUI) o tramite"],
  ['Assembla e scala', 'Componi e scala'],
  ['Scopri i componenti di Cloud Factory', 'Scopri i prodotti di Elemento Cloud'],
  ['Hypervisor di livello produttivo', 'Hypervisor per ambienti di produzione'],
  ['sicurezza di livello aziendale', 'sicurezza di livello enterprise'],
  ['Ulteriori informazioni su AtomOS', 'Scopri di più su AtomOS'],
  ['GUI e CLI unificate', 'Dashboard (GUI) e CLI unificate'],
  ["sull'atmosfera", 'su Atomosphere'],
  ["All'interno dell'architettura Elemento Cloud", "L'architettura Elemento Cloud"],
  ['indipendente dal fornitore.', 'indipendente dai fornitori.'],
  ['livello aziendale progettata', 'livello Enterprise progettata'],
  ['auto-ospitabile', 'auto-ospitabili'],
  ['compatibile con il binario RHEL', 'compatibile con RHEL binary'],
  ['KVM/QEMU "Vaniglia" a monte', "Upstream 'Vanilla' KVM/QEMU"],
  ['(protocollo C4)', '(grazie al nostro protocollo C4 brevettato)'],
  ['Avvia rapidamente senza vincoli con il fornitore', 'Inizia rapidamente senza vincoli di fornitore'],
  ['Scienza dei dati e intelligenza artificiale', 'Data science e intelligenza artificiale'],
  ['organizzazioni che hanno rivoluzionato', 'aziende che hanno rivoluzionato'],
  ['"Organizations"', '"Aziende"'],
  ['Costruire. distribuire. Scala.', 'Costruire, Distribuire. Scalare.'],
  ['non contro di essa', 'non contro essa'],
  ['costo totale di proprietà', 'costo totale di gestione'],
  ["informatica verde", 'green computing'],
  ['organizzazioni che trasformano', 'aziende che trasformano'],
  ['indipendenti dal fornitore', 'indipendenti dai fornitori'],
  ['Niente forchette', 'Nessun fork'],
  ['livello aziendale.', 'livello enterprise.'],
  ['Linux principale:', 'Linux mainline:'],
  ['nessuna forcella', 'nessun fork'],
  ['Controcorrente e veloce', 'Upstream e veloce'],
  ['Passaggio automatico', 'Passthrough automatico'],
  ['Provisioning sottile', 'Thin Provisioning'],
  ["Tu-Sai-Chi contro AtomOS: resa dei conti con l'hypervisor", 'Tu-Sai-Chi contro AtomOS: resa dei conti fra hypervisor'],
  ['macchina virtuale del server vCenter', 'Macchina virtuale del server vCenter'],
  ['utilizzare crudo', "utilizza 'raw'"],
  ['basato sulla fiducia', 'basato sul trust'],
  ['produttori e hobbisti', 'makers e hobbisti'],
  ["economia verde", 'economia green'],
  ["Vantaggi dell'economia verde:", "Vantaggi per l'economia green:"],
  ["è aperto.", 'è open.'],
  ['Centro di controllo Any-Cloud', 'Centro di controllo di ogni Cloud'],
  ['Cruscotto universale', 'Dashboard universale'],
  ['per qualsiasi cloud', 'per tutti i cloud'],
  ['scarica subito Electro', 'Scarica subito Electros'],
  ['Superfici per eseguire', 'Modalità per eseguire'],
  ['pronte per la spedizione', 'pronte'],
  ['sembrano una finestra su milioni', 'abbiamo una finestra su migliaia'],
  ['stack pesante di GPU', 'massivo stack di GPU'],
  ['qualcosa nel mezzo', 'qualcosa di intermedio'],
  ['più esotico in sede', 'più unico on-prem'],
  ['ci ha venduto', 'ci ha convinti ad adottare Electros'],
  ['Scarica Elettro', 'Scarica Electros'],
  ['Nello sviluppo', 'In sviluppo'],
  ['ciascuna superficie', 'ciascuna modalità'],
  ['stesse basi per', 'stesse fondamenta per'],
  ['INNOVARE. INGEGNERE.', 'INNOVARE. ORCHESTRARE.'],
  ["dall'infrastruttura", "svincolato dall'infrastruttura"],
  ['vincoli al fornitore', 'vincoli con i fornitori'],
  ['lock-in del fornitore', 'lock-in dei fornitori'],
  ['pacchetti iniziali', 'informazioni per iniziare'],
  ['AtomOS e Nucleus CLI', 'CLI di AtomOS'],
  ['capitoli completi', 'contenuti completi'],
  ['Open book', 'Apri'],
  ['View comparisons', 'Guarda le comparazioni'],
  ['Feature-by-feature', 'Confronto funzione per funzione'],
  ['livello aziendale multi-cloud', 'livello enterprise'],
  ['Il libro Rete Elemento', 'La documentazione Rete Elemento'],
  ['gateway Rete Elemento Cloud', 'gateway Elemento Cloud Network'],
  ["l'infrastruttura come codice'", "l'infrastruttura come codice"],
  ['Pila tecnologica', 'Stack tecnologico'],
  ['cloud-native', 'cloud nativa'],
  ['carico di lavoro verde', 'carico di lavoro green'],
  ['carbonio', 'CO2'],
  ['esigenze aziendali', 'esigenze delle aziende'],
  ['Informatica sensibile al carbonio', 'Sensibili al tema della CO2'],
  ['Se stai cercando di iniziare', 'Se vuoi iniziare lavorare'],
  ['I agree to the', 'Ho letto e acconsento a'],
  ['clienti aziendali', 'clienti che acquistano tale opzione'],
  ['organizzazioni di tutte le dimensioni', 'aziende di tutte le dimensioni'],
  ['tecnologia verde', 'tecnologia green'],
  ['Offre prestazioni', 'Offrire prestazioni'],
  ['unendo strategia', 'unisco strategia'],
  ["sull'umanizzazione e sulla traduzione", 'sulla traduzione'],
  ['Ha iniziato con la chimica', 'Ho iniziato con la chimica'],
  ['si è avventurato', 'mi sono avventurato'],
  ['è uno sviluppatore', 'sono uno sviluppatore'],
  ['stavo semplicemente', 'stavo semplicemente'],
  ['un musicologo', 'musicologa'],
  ['musicista ed educatore', 'musicista ed educatrice'],
  ['Appassionato di montagna', 'Appassionata di montagna'],
  ['Sempre curioso, sempre in apprendimento', 'Sempre curiosa, sempre in apprendimento'],
  ['Fantasioso e curioso', 'Fantasiosa e curiosa'],
  ['sono appassionato', 'sono appassionata'],
  ['Profilo pubblico su Crunchbase', 'storia aziendale iniziata a Cuneo nel 2021'],
  ['dimensione rotonda', 'dimensione del round'],
  ['si adatta a questo capitale', 'si arricchisce grazie a questo capitale'],
  ['spinta aziendale', 'crescita aziendale'],
  ['I finanziamenti aggiornati', 'Leggi su Crunchbase la notizia relativa al nostro nuovo round di finanziamenti'],
  ['Integrazione elettronica perfetta', 'Perfetta integrazione con Electros'],
  ['Inizia con Atomosfera', 'Inizia con Atomosphere'],
  ['Confronto dei costi in tempo reale', 'Confronta i costi in tempo reale'],
  ['stesso dashboard', 'stessa dashboard'],
  ['Mantieni gli account e la fatturazione CSP', 'Mantieni gli account e la fatturazione con i CSP'],
  ['API singola per apprendere', 'Apprendi una API singola'],
  ['Nessun margine, nessuna fatturazione tramite intermediari', 'Non applichiamo nessun markup, nessun costo come intermediari'],
  ['si trova tra', 'è un layer che si trova tra'],
  ['le API CSP', 'le API dei CSP'],
];

function applyEnToIt(data) {
  let changed = 0;
  const applyEntries = (entries) => {
    if (!Array.isArray(entries)) return;
    for (const row of entries) {
      if (!row?.en) continue;
      const key = row.en.trim();
      if (EN_TO_IT[key] !== undefined && row.it !== EN_TO_IT[key]) {
        row.it = EN_TO_IT[key];
        changed++;
      } else if (typeof row.it === 'string' && row.it) {
        let next = row.it;
        for (const [from, to] of IT_GLOBAL) {
          if (next.includes(from)) next = next.split(from).join(to);
        }
        if (next !== row.it) {
          row.it = next;
          changed++;
        }
      }
    }
  };

  if (data.byStem) {
    for (const stem of Object.values(data.byStem)) applyEntries(stem);
  }
  applyEntries(data.replacements);
  return changed;
}

function applyStringsIt() {
  const payload = JSON.parse(readFileSync(STRINGS_PATH, 'utf8'));
  const strings = payload.strings || payload;
  let changed = 0;

  for (const row of strings) {
    if (row.en && EN_TO_IT[row.en.trim()] !== undefined) {
      if (row.it !== EN_TO_IT[row.en.trim()]) {
        row.it = EN_TO_IT[row.en.trim()];
        changed++;
      }
      continue;
    }
    if (typeof row.it === 'string' && row.it) {
      let next = row.it;
      for (const [from, to] of IT_GLOBAL) {
        if (next.includes(from)) next = next.split(from).join(to);
      }
      if (next !== row.it) {
        row.it = next;
        changed++;
      }
    }
  }

  writeFileSync(STRINGS_PATH, JSON.stringify(payload, null, 2) + '\n');
  return changed;
}

function main() {
  const replacements = JSON.parse(readFileSync(REPLACEMENTS_PATH, 'utf8'));
  const repChanged = applyEnToIt(replacements);
  writeFileSync(REPLACEMENTS_PATH, JSON.stringify(replacements, null, 2) + '\n');

  const strChanged = applyStringsIt();
  console.log(`Updated ${repChanged} replacement entries, ${strChanged} strings-it entries`);
}

main();
