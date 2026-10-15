#!/usr/bin/env node
/**
 * Sync buy-seat + forms/signup strings from master into strings-it/fr with translations,
 * refresh by-page files, ready for npm run i18n:import / i18n:import:fr.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @type {Record<string, { it: string, fr: string }>} */
const TR = {
  'Create account': { it: 'Crea account', fr: 'Créer un compte' },
  'Create your account': { it: 'Crea il tuo account', fr: 'Créez votre compte' },
  'First name *': { it: 'Nome *', fr: 'Prénom *' },
  'Last name *': { it: 'Cognome *', fr: 'Nom *' },
  'Email *': { it: 'Email *', fr: 'E-mail *' },
  'Password *': { it: 'Password *', fr: 'Mot de passe *' },
  'Confirm password *': { it: 'Conferma password *', fr: 'Confirmer le mot de passe *' },
  'Subscribe to our newsletter for updates and insights': {
    it: 'Iscriviti alla newsletter per aggiornamenti e approfondimenti',
    fr: 'Abonnez-vous à la newsletter pour les mises à jour et analyses',
  },
  'I agree to the Terms and Conditions , Privacy Policy , and Cookie Policy *': {
    it: 'Accetto i Termini e Condizioni, la Privacy Policy e la Cookie Policy *',
    fr: "J'accepte les Conditions générales, la Politique de confidentialité et la Politique de cookies *",
  },
  'Includes a personal organisation and a 14-day Electros trial. Then download Electros and sign in.': {
    it: 'Include un’organizzazione personale e una prova Electros di 14 giorni. Poi scarica Electros e accedi.',
    fr: 'Inclut une organisation personnelle et un essai Electros de 14 jours. Téléchargez ensuite Electros et connectez-vous.',
  },
  'At least 12 characters, with upper and lower case, a number, and a symbol.': {
    it: 'Almeno 12 caratteri, con maiuscole e minuscole, un numero e un simbolo.',
    fr: 'Au moins 12 caractères, avec majuscules et minuscules, un chiffre et un symbole.',
  },
  'Already have an account? Sign in & buy a seat': {
    it: 'Hai già un account? Accedi e acquista un seat',
    fr: 'Vous avez déjà un compte ? Connectez-vous et achetez un siège',
  },
  'Please complete all required fields.': {
    it: 'Compila tutti i campi obbligatori.',
    fr: 'Veuillez remplir tous les champs obligatoires.',
  },
  'Sign Up - Elemento': { it: 'Registrati - Elemento', fr: 'Inscription - Elemento' },
  '${message}': { it: '${message}', fr: '${message}' },

  Continue: { it: 'Continua', fr: 'Continuer' },
  Back: { it: 'Indietro', fr: 'Retour' },
  'Choose another organisation': {
    it: 'Scegli un’altra organizzazione',
    fr: 'Choisir une autre organisation',
  },
  'Continue to Stripe': { it: 'Continua su Stripe', fr: 'Continuer vers Stripe' },
  'Save & continue to Stripe': {
    it: 'Salva e continua su Stripe',
    fr: 'Enregistrer et continuer vers Stripe',
  },
  'Save & continue': { it: 'Salva e continua', fr: 'Enregistrer et continuer' },
  'Verify your email': { it: 'Verifica la tua email', fr: 'Vérifiez votre e-mail' },
  'Enter the 6-digit code sent to': {
    it: 'Inserisci il codice a 6 cifre inviato a',
    fr: 'Saisissez le code à 6 chiffres envoyé à',
  },
  'Verification code': { it: 'Codice di verifica', fr: 'Code de vérification' },
  'Resend code': { it: 'Invia di nuovo il codice', fr: 'Renvoyer le code' },
  'Verify email': { it: 'Verifica email', fr: 'Vérifier l’e-mail' },
  Invoice: { it: 'Fattura', fr: 'Facture' },
  'Sign-in': { it: 'Accesso', fr: 'Connexion' },
  'Verify email': { it: 'Verifica email', fr: 'Vérifier l’e-mail' },
  'Invoice details': { it: 'Dati fattura', fr: 'Facturation' },
  'Select org': { it: 'Scegli org', fr: 'Choisir l’org' },
  Checkout: { it: 'Checkout', fr: 'Paiement' },
  Organisation: { it: 'Organizzazione', fr: 'Organisation' },
  'Your email is verified. Add invoicing details before you choose an organisation.': {
    it: 'La tua email è verificata. Aggiungi i dati di fatturazione prima di scegliere un’organizzazione.',
    fr: 'Votre e-mail est vérifié. Ajoutez les coordonnées de facturation avant de choisir une organisation.',
  },
  'Buy an Electros seat': { it: 'Acquista un seat Electros', fr: 'Acheter un siège Electros' },
  'Sign in': { it: 'Accedi', fr: 'Connexion' },
  'Choose organisation': { it: 'Scegli organizzazione', fr: 'Choisir l’organisation' },
  'You already have a paid seat in this organisation!': {
    it: 'Hai già un seat a pagamento in questa organizzazione!',
    fr: 'Vous avez déjà un siège payant dans cette organisation !',
  },
  'Plan & billing': { it: 'Piano e fatturazione', fr: 'Offre et facturation' },
  'Billing details': { it: 'Dati di fatturazione', fr: 'Coordonnées de facturation' },
  Email: { it: 'Email', fr: 'E-mail' },
  Password: { it: 'Password', fr: 'Mot de passe' },
  Plan: { it: 'Piano', fr: 'Offre' },
  Billing: { it: 'Fatturazione', fr: 'Facturation' },
  'Company name': { it: 'Ragione sociale', fr: 'Raison sociale' },
  'VAT number': { it: 'Partita IVA', fr: 'N° de TVA' },
  'Fiscal code': { it: 'Codice fiscale', fr: 'Code fiscal' },
  'SDI code': { it: 'Codice SDI', fr: 'Code SDI' },
  Address: { it: 'Indirizzo', fr: 'Adresse' },
  'Country (ISO)': { it: 'Paese (ISO)', fr: 'Pays (ISO)' },
  Province: { it: 'Provincia', fr: 'Province' },
  'ZIP / CAP': { it: 'CAP', fr: 'Code postal' },
  City: { it: 'Città', fr: 'Ville' },
  Home: { it: 'Home', fr: 'Accueil' },
  Electros: { it: 'Electros', fr: 'Electros' },
  'Buy a seat': { it: 'Acquista un seat', fr: 'Acheter un siège' },
  '1 Sign in': { it: '1 Accedi', fr: '1 Connexion' },
  '2 Organisation': { it: '2 Organizzazione', fr: '2 Organisation' },
  '3 Plan & Stripe': { it: '3 Piano e Stripe', fr: '3 Offre et Stripe' },
  'Sign in, verify your email, add invoicing details, choose an organisation, then pay in Stripe.': {
    it: 'Accedi, verifica la tua email, aggiungi i dati di fatturazione, scegli un’organizzazione, poi paga su Stripe.',
    fr: 'Connectez-vous, vérifiez votre e-mail, ajoutez les coordonnées de facturation, choisissez une organisation, puis payez sur Stripe.',
  },
  'Use your Elemento account email and password.': {
    it: 'Usa email e password del tuo account Elemento.',
    fr: 'Utilisez l’e-mail et le mot de passe de votre compte Elemento.',
  },
  'No account yet? Create one': {
    it: 'Non hai ancora un account? Creane uno',
    fr: 'Pas encore de compte ? Créez-en un',
  },
  'Select the organisation that should receive the seat.': {
    it: 'Seleziona l’organizzazione che deve ricevere il seat.',
    fr: 'Sélectionnez l’organisation qui doit recevoir le siège.',
  },
  'Organisation: —': { it: 'Organizzazione: —', fr: 'Organisation : —' },
  'No further purchase is needed for this organisation. Open Electros to manage billing, or choose another organisation below.': {
    it: 'Non è necessario un ulteriore acquisto per questa organizzazione. Apri Electros per gestire la fatturazione, oppure scegli un’altra organizzazione qui sotto.',
    fr: 'Aucun nouvel achat n’est nécessaire pour cette organisation. Ouvrez Electros pour gérer la facturation, ou choisissez une autre organisation ci-dessous.',
  },
  'VAT or fiscal code can be left blank when not applicable; address fields are required.': {
    it: 'Partita IVA o codice fiscale possono restare vuoti se non applicabili; l’indirizzo è obbligatorio.',
    fr: 'Le n° de TVA ou le code fiscal peut rester vide s’il ne s’applique pas ; l’adresse est obligatoire.',
  },
  'Back to Electros': { it: 'Torna a Electros', fr: 'Retour à Electros' },
  'Sign in, verify your email, add invoicing details, and buy an Electros seat via Stripe.': {
    it: 'Accedi, verifica la tua email, aggiungi i dati di fatturazione e acquista un seat Electros tramite Stripe.',
    fr: 'Connectez-vous, vérifiez votre e-mail, ajoutez les coordonnées de facturation et achetez un siège Electros via Stripe.',
  },
  'Buy an Electros seat | Elemento': {
    it: 'Acquista un seat Electros | Elemento',
    fr: 'Acheter un siège Electros | Elemento',
  },
};

function isTarget(id) {
  return id.includes('buy-seat') || id.includes('forms_signup');
}

function load(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function save(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

const master = load(join(ROOT, 'localization/strings.json'));
const targetRows = (master.strings || []).filter((s) => isTarget(s.id || ''));

for (const locale of ['it', 'fr']) {
  const path = join(ROOT, `localization/strings-${locale}.json`);
  const data = load(path);
  const byId = new Map((data.strings || []).map((s) => [s.id, s]));

  let upserted = 0;
  for (const row of targetRows) {
    const en = (row.en || '').trim();
    const tr = TR[en]?.[locale] || en;
    const existing = byId.get(row.id);
    if (existing) {
      existing.en = row.en;
      existing[locale] = tr;
      existing.source = row.source;
      existing.context = row.context;
    } else {
      byId.set(row.id, {
        id: row.id,
        en: row.en,
        it: locale === 'it' ? tr : '',
        fr: locale === 'fr' ? tr : '',
        source: row.source,
        context: row.context,
      });
    }
    upserted += 1;
  }

  // Drop obsolete forms_signup rows whose EN no longer exists in master.
  const masterIds = new Set(targetRows.map((r) => r.id));
  data.strings = [...byId.values()].filter((s) => {
    if (!isTarget(s.id || '')) return true;
    return masterIds.has(s.id);
  });

  save(path, data);

  // by-page
  for (const page of ['buy-seat', 'forms_signup']) {
    const bpPath = join(ROOT, `localization/by-page/${page}.json`);
    const bp = load(bpPath);
    for (const row of bp.strings || []) {
      const en = (row.en || '').trim();
      row[locale] = TR[en]?.[locale] || row[locale] || en;
    }
    save(bpPath, bp);
  }

  console.log(`${locale}: upserted ${upserted} buy-seat/forms_signup rows → ${path}`);
}
