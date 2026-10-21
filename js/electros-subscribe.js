/**
 * Electros seat purchase:
 * login → email code → invoicing details → scopes → relogin/org → plan → subscribe → Stripe
 */
(function () {
  // Direct portal call. GitHub Pages cannot proxy /api/portal.
  const PORTAL = 'https://portal.elemento.cloud/api/v2';

  const UI = {
    en: {
      alreadyPaidTitle: 'You already have a paid seat in this organisation!',
      alreadyActiveTitle: 'You already have an active seat in this organisation!',
      alreadyPaidLead:
        'No further purchase is needed for this organisation. Open Electros to manage billing, or choose another organisation below.',
      alreadyActiveLead:
        'This organisation already has a trial seat. Open Electros to manage billing or convert to a paid plan, or choose another organisation below.',
      enterCredentials: 'Enter your email and password.',
      signInFailed: 'Sign-in failed. Check your credentials and try again.',
      sessionExpired: 'Your session expired. Sign in again to verify your email.',
      noToken: 'Login succeeded but no access token was returned.',
      selectOrgPlan: 'Select an organisation, plan, and billing period.',
      openingStripe: 'Opening Stripe…',
      continueStripe: 'Continue to Stripe',
      seatReady: 'Seat ready',
      seatReadyLead:
        'No payment needed — your seat was granted (trial or already covered). You can open Electros and sign in.',
      addBilling: 'Your email is verified. Add invoicing details to continue.',
      incompleteBilling:
        'Billing details for this organisation are incomplete. Fill them in below, then continue.',
      billingRequired: 'Address, ZIP, city, province, and country are required.',
      billingSavedIncomplete:
        'Billing details were saved but still look incomplete. Check the fields and try again.',
      billingSaveFailed: 'Could not save billing details.',
      choosePlan: 'Choose a plan, then continue to Stripe.',
      orgOpenFailed: 'Could not open that organisation. Try again.',
      noOrgs: 'No organisations available for seat purchase on this account.',
      signingIn: 'Signing in…',
      continue: 'Continue',
      saving: 'Saving…',
      saveContinue: 'Save & continue',
      saveContinueStripe: 'Save & continue to Stripe',
      enterCode: 'Enter the 6-digit code from your email.',
      codeInvalid: 'That code is wrong or has expired. Request a new one if you need to.',
      verifying: 'Verifying…',
      verify: 'Verify email',
      resend: 'Resend code',
      resendWait: 'You can ask for a new code in {m} min {s}s.',
      codeSendFailed: 'Could not send the verification code. Try again.',
      refreshFailed: 'Your email was verified, but the session could not be refreshed. Sign in again.',
      stillUnverified: 'This session still shows the email as unverified. Sign in again.',
      alreadyPaidShort: 'You already have a paid seat in this organisation!',
      alreadyHasSeat:
        'This organisation already has an Electros seat. Open Electros to manage billing, or pick another organisation.',
      checkoutFailed:
        'Checkout could not be started. If this organisation already has a seat, manage billing in Electros; otherwise try again shortly.',
      verifyEmail:
        'Verify your email with the code we send you before buying a seat.',
      noPermission: 'You do not have permission to buy a seat for this organisation.',
      notFound: 'Account, organisation, or plan was not found.',
      noCheckoutUrl: 'No Stripe checkout URL was returned.',
      tryAgain: 'Could not start checkout. Try again.',
      trialMeta: ' · trial',
    },
    it: {
      alreadyPaidTitle: 'Hai già un seat a pagamento in questa organizzazione!',
      alreadyActiveTitle: 'Hai già un seat attivo in questa organizzazione!',
      alreadyPaidLead:
        'Non è necessario un ulteriore acquisto per questa organizzazione. Apri Electros per gestire la fatturazione, oppure scegli un’altra organizzazione qui sotto.',
      alreadyActiveLead:
        'Questa organizzazione ha già un seat in prova. Apri Electros per gestire la fatturazione o passare a un piano a pagamento, oppure scegli un’altra organizzazione.',
      enterCredentials: 'Inserisci email e password.',
      signInFailed: 'Accesso non riuscito. Controlla le credenziali e riprova.',
      sessionExpired: 'La sessione è scaduta. Accedi di nuovo per verificare la tua email.',
      noToken: 'Accesso riuscito ma non è stato restituito alcun token.',
      selectOrgPlan: 'Seleziona organizzazione, piano e periodo di fatturazione.',
      openingStripe: 'Apertura di Stripe…',
      continueStripe: 'Continua su Stripe',
      seatReady: 'Seat pronto',
      seatReadyLead:
        'Nessun pagamento necessario — il seat è stato assegnato (prova o già coperto). Puoi aprire Electros e accedere.',
      addBilling: 'La tua email è verificata. Aggiungi i dati di fatturazione per continuare.',
      incompleteBilling:
        'I dati di fatturazione di questa organizzazione sono incompleti. Compilali qui sotto, poi continua.',
      billingRequired: 'Indirizzo, CAP, città, provincia e paese sono obbligatori.',
      billingSavedIncomplete:
        'I dati di fatturazione sono stati salvati ma risultano ancora incompleti. Controlla i campi e riprova.',
      billingSaveFailed: 'Impossibile salvare i dati di fatturazione.',
      choosePlan: 'Scegli un piano, poi continua su Stripe.',
      orgOpenFailed: 'Impossibile aprire quella organizzazione. Riprova.',
      noOrgs: 'Nessuna organizzazione disponibile per l’acquisto di un seat su questo account.',
      signingIn: 'Accesso in corso…',
      continue: 'Continua',
      saving: 'Salvataggio…',
      saveContinue: 'Salva e continua',
      saveContinueStripe: 'Salva e continua su Stripe',
      enterCode: 'Inserisci il codice a 6 cifre ricevuto via email.',
      codeInvalid: 'Il codice è errato o scaduto. Richiedine uno nuovo se serve.',
      verifying: 'Verifica…',
      verify: 'Verifica email',
      resend: 'Invia di nuovo il codice',
      resendWait: 'Puoi chiedere un nuovo codice tra {m} min {s}s.',
      codeSendFailed: 'Impossibile inviare il codice di verifica. Riprova.',
      refreshFailed: 'Email verificata, ma la sessione non è stata aggiornata. Accedi di nuovo.',
      stillUnverified: 'Questa sessione risulta ancora con email non verificata. Accedi di nuovo.',
      alreadyPaidShort: 'Hai già un seat a pagamento in questa organizzazione!',
      alreadyHasSeat:
        'Questa organizzazione ha già un seat Electros. Apri Electros per gestire la fatturazione, oppure scegli un’altra organizzazione.',
      checkoutFailed:
        'Impossibile avviare il checkout. Se questa organizzazione ha già un seat, gestisci la fatturazione in Electros; altrimenti riprova a breve.',
      verifyEmail:
        'Verifica la tua email con il codice che ti inviamo prima di acquistare un seat.',
      noPermission: 'Non hai i permessi per acquistare un seat per questa organizzazione.',
      notFound: 'Account, organizzazione o piano non trovato.',
      noCheckoutUrl: 'Nessun URL di checkout Stripe è stato restituito.',
      tryAgain: 'Impossibile avviare il checkout. Riprova.',
      trialMeta: ' · prova',
    },
    fr: {
      alreadyPaidTitle: 'Vous avez déjà un siège payant dans cette organisation !',
      alreadyActiveTitle: 'Vous avez déjà un siège actif dans cette organisation !',
      alreadyPaidLead:
        'Aucun nouvel achat n’est nécessaire pour cette organisation. Ouvrez Electros pour gérer la facturation, ou choisissez une autre organisation ci-dessous.',
      alreadyActiveLead:
        'Cette organisation a déjà un siège d’essai. Ouvrez Electros pour gérer la facturation ou passer à une offre payante, ou choisissez une autre organisation.',
      enterCredentials: 'Saisissez votre e-mail et votre mot de passe.',
      signInFailed: 'Connexion échouée. Vérifiez vos identifiants et réessayez.',
      sessionExpired: 'Votre session a expiré. Reconnectez-vous pour vérifier votre e-mail.',
      noToken: 'Connexion réussie mais aucun jeton n’a été renvoyé.',
      selectOrgPlan: 'Sélectionnez une organisation, une offre et une périodicité.',
      openingStripe: 'Ouverture de Stripe…',
      continueStripe: 'Continuer vers Stripe',
      seatReady: 'Siège prêt',
      seatReadyLead:
        'Aucun paiement nécessaire — le siège a été attribué (essai ou déjà couvert). Vous pouvez ouvrir Electros et vous connecter.',
      addBilling: 'Votre e-mail est vérifié. Ajoutez les coordonnées de facturation pour continuer.',
      incompleteBilling:
        'Les coordonnées de facturation de cette organisation sont incomplètes. Complétez-les ci-dessous, puis continuez.',
      billingRequired: 'Adresse, code postal, ville, province et pays sont obligatoires.',
      billingSavedIncomplete:
        'Les coordonnées ont été enregistrées mais semblent encore incomplètes. Vérifiez les champs et réessayez.',
      billingSaveFailed: 'Impossible d’enregistrer les coordonnées de facturation.',
      choosePlan: 'Choisissez une offre, puis continuez vers Stripe.',
      orgOpenFailed: 'Impossible d’ouvrir cette organisation. Réessayez.',
      noOrgs: 'Aucune organisation disponible pour l’achat d’un siège sur ce compte.',
      signingIn: 'Connexion…',
      continue: 'Continuer',
      saving: 'Enregistrement…',
      saveContinue: 'Enregistrer et continuer',
      saveContinueStripe: 'Enregistrer et continuer vers Stripe',
      enterCode: 'Saisissez le code à 6 chiffres reçu par e-mail.',
      codeInvalid: 'Ce code est incorrect ou expiré. Demandez-en un nouveau si besoin.',
      verifying: 'Vérification…',
      verify: 'Vérifier l’e-mail',
      resend: 'Renvoyer le code',
      resendWait: 'Vous pourrez demander un nouveau code dans {m} min {s} s.',
      codeSendFailed: 'Impossible d’envoyer le code de vérification. Réessayez.',
      refreshFailed: 'E-mail vérifié, mais la session n’a pas pu être renouvelée. Reconnectez-vous.',
      stillUnverified: 'Cette session indique encore un e-mail non vérifié. Reconnectez-vous.',
      alreadyPaidShort: 'Vous avez déjà un siège payant dans cette organisation !',
      alreadyHasSeat:
        'Cette organisation a déjà un siège Electros. Ouvrez Electros pour gérer la facturation, ou choisissez une autre organisation.',
      checkoutFailed:
        'Impossible de démarrer le paiement. Si cette organisation a déjà un siège, gérez la facturation dans Electros ; sinon réessayez sous peu.',
      verifyEmail:
        'Vérifiez votre e-mail avec le code que nous vous envoyons avant d’acheter un siège.',
      noPermission: 'Vous n’avez pas l’autorisation d’acheter un siège pour cette organisation.',
      notFound: 'Compte, organisation ou offre introuvable.',
      noCheckoutUrl: 'Aucune URL de paiement Stripe n’a été renvoyée.',
      tryAgain: 'Impossible de démarrer le paiement. Réessayez.',
      trialMeta: ' · essai',
    },
  };

  function pageLocale() {
    if (window.ElementoI18n?.getPageLocale) return window.ElementoI18n.getPageLocale();
    const lang = document.documentElement.lang;
    if (lang === 'it' || lang === 'fr') return lang;
    const path = window.location.pathname;
    if (path.startsWith('/it/') || path === '/it') return 'it';
    if (path.startsWith('/fr/') || path === '/fr') return 'fr';
    return 'en';
  }

  function t(key) {
    const loc = pageLocale();
    return (UI[loc] && UI[loc][key]) || UI.en[key] || key;
  }

  const panel = document.getElementById('subscribeFlow');
  if (!panel) return;

  const steps = {
    login: panel.querySelector('[data-step="login"]'),
    verify: panel.querySelector('[data-step="verify"]'),
    org: panel.querySelector('[data-step="org"]'),
    'already-paid': panel.querySelector('[data-step="already-paid"]'),
    plan: panel.querySelector('[data-step="plan"]'),
    billing: panel.querySelector('[data-step="billing"]'),
  };
  const errorEl = document.getElementById('subscribeError');
  const orgList = document.getElementById('subscribeOrgList');
  const tierSelect = document.getElementById('subscribeTier');
  const freqSelect = document.getElementById('subscribeFrequency');
  const loginForm = document.getElementById('subscribeLoginForm');
  const verifyForm = document.getElementById('subscribeVerifyForm');
  const planForm = document.getElementById('subscribePlanForm');
  const billingForm = document.getElementById('subscribeBillingForm');
  const stepsLabel = document.getElementById('subscribeStepsLabel');

  /** @type {{ accessToken: string|null, refreshToken: string|null, username: string|null, email: string|null, emailVerified: boolean, orgId: string|null, orgName: string|null, hasBillingDetails: boolean, pendingTier: string|null, pendingFrequency: string|null }} */
  const state = {
    accessToken: null,
    refreshToken: null,
    username: null,
    email: null,
    emailVerified: false,
    orgId: null,
    orgName: null,
    hasBillingDetails: false,
    detailsRowExists: false,
    pendingTier: null,
    pendingFrequency: null,
    upgradingTrial: false,
  };

  let resendTimer = null;

  function formatError(detail) {
    if (detail == null || detail === '') return '';
    if (typeof detail === 'string') {
      try {
        const parsed = JSON.parse(detail);
        if (parsed && typeof parsed === 'object') {
          return formatError(parsed) || detail;
        }
      } catch (_) { /* plain string */ }
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return item.msg || item.message || item.error_msg || JSON.stringify(item);
          }
          return String(item);
        })
        .filter(Boolean)
        .join(' ');
    }
    if (typeof detail === 'object') {
      if (detail.error_msg || detail.message || detail.detail) {
        return formatError(detail.error_msg || detail.message || detail.detail);
      }
      try {
        return JSON.stringify(detail);
      } catch (_) {
        return String(detail);
      }
    }
    return String(detail);
  }

  function tokenClaims() {
    try {
      const token = state.accessToken;
      if (!token) return null;
      const part = token.split('.')[1];
      if (!part) return null;
      const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
      return JSON.parse(atob(padded));
    } catch (_) {
      return null;
    }
  }

  function checkoutUrlFrom(data) {
    const checkout = data && data.checkouts && data.checkouts[0];
    return (checkout && checkout.checkout_url) || null;
  }

  function isIncompleteBillingError(err) {
    const raw = ((err && err.message) || '').toLowerCase();
    return err && err.status === 403 && raw.includes('billing details are incomplete');
  }

  function billingDetailsComplete(details) {
    if (!details || typeof details !== 'object') return false;
    return Boolean(
      details.full_address &&
        details.zip_code &&
        details.city &&
        details.province &&
        details.nationality
    );
  }

  async function tryPaymentLinks() {
    for (const path of ['/subscription/payment-links', '/subscription/payment-links/owner']) {
      try {
        const data = await portalFetch(path, { method: 'POST' });
        const url = checkoutUrlFrom(data);
        if (url) {
          window.location.href = url;
          return true;
        }
      } catch (_) { /* try next */ }
    }
    return false;
  }

  function friendlySubscribeError(err) {
    const raw = (err && err.message) || '';
    const status = err && err.status;
    const lower = raw.toLowerCase();

    if (status === 409 || (lower.includes('already') && lower.includes('subscription'))) {
      if (state.upgradingTrial) return t('tryAgain');
      return t('alreadyPaidTitle');
    }
    if (status === 400 && (lower.includes('verif') || lower.includes('email'))) {
      return t('verifyEmail');
    }
    if (status === 403) {
      return raw || t('noPermission');
    }
    if (status === 404) {
      return raw || t('notFound');
    }
    if (status >= 500 || lower.includes('internal server error')) {
      return t('checkoutFailed');
    }
    return raw || t('tryAgain');
  }

  function showAlert(message, tone) {
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.hidden = !message;
    errorEl.classList.toggle('subscribe-alert--success', Boolean(message) && tone === 'success');
    errorEl.classList.toggle('subscribe-alert--info', Boolean(message) && tone === 'info');
  }

  function showError(message) {
    showAlert(message, 'error');
  }

  function showInfo(message) {
    showAlert(message, 'info');
  }

  function showSuccess(message) {
    showAlert(message, 'success');
  }

  /** A paid seat blocks checkout. A free trial does not. */
  function isTrialSeat(subscription) {
    if (!subscription || typeof subscription !== 'object') return false;
    if (subscription.is_trial === true) return true;
    return String(subscription.status || '').toLowerCase() === 'trialing';
  }

  function isPaidSeat(subscription) {
    if (!subscription || typeof subscription !== 'object') return false;
    if (isTrialSeat(subscription)) return false;
    return String(subscription.status || '').toLowerCase() === 'active';
  }

  /** Tier name of a paid seat. A free trial is not a tier. */
  function paidTierName(subscription) {
    if (!isPaidSeat(subscription)) return '';
    return String(subscription.tier_name || subscription.tier || '').trim();
  }

  function setTrialNote(show) {
    const note = document.getElementById('subscribeTrialNote');
    if (note) note.hidden = !show;
  }

  function updateProgress(name) {
    if (!stepsLabel) return;
    const items = Array.from(stepsLabel.querySelectorAll('li'));
    if (!items.length) return;
    const activeIndex = {
      login: 0,
      verify: 1,
      billing: 2,
      org: 3,
      'already-paid': 3,
      plan: 4,
    }[name];
    items.forEach((item, index) => {
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-done', Number.isInteger(activeIndex) && index < activeIndex);
    });
  }

  function showStep(name) {
    Object.entries(steps).forEach(([key, el]) => {
      if (!el) return;
      el.hidden = key !== name;
    });
    showAlert('');
    panel.classList.toggle('subscribe-panel--success', name === 'already-paid');
    updateProgress(name);
  }

  /**
   * After org-scoped relogin, skip plan/Stripe only for a paid seat.
   * A free trial (is_trial, or the org's trial flag) can still buy a paid plan.
   */
  async function findOrgSeat(orgIsTrial) {
    const email = state.email || state.username || '';
    const paths = ['/subscription'];
    if (email) {
      paths.push(`/subscription?email=${encodeURIComponent(email)}`);
    }
    paths.push('/subscription/org');

    let trial = orgIsTrial ? { status: 'active', is_trial: true } : null;
    for (const path of paths) {
      try {
        const data = await portalFetch(path);
        const list = Array.isArray(data) ? data : data ? [data] : [];
        const paid = list.find((sub) => isPaidSeat(sub));
        if (paid && !orgIsTrial) return { paid, trial: null };
        const foundTrial = list.find((sub) => isTrialSeat(sub));
        if (foundTrial) trial = foundTrial;
        else if (orgIsTrial && paid) trial = { ...paid, is_trial: true };
      } catch (_) { /* try next signal */ }
    }

    if (trial) return { paid: null, trial };
    const claims = tokenClaims() || {};
    if (claims.elemento_active_subscriber === true) {
      return { paid: { status: 'active', is_trial: false }, trial: null };
    }
    return { paid: null, trial: null };
  }

  function showAlreadyPaid(orgName, subscription) {
    const orgEl = document.getElementById('subscribeAlreadyPaidOrg');
    const titleEl = document.querySelector('[data-step="already-paid"] .subscribe-success-title');
    const leadEl = document.querySelector('[data-step="already-paid"] .subscribe-success-lead');
    if (orgEl) orgEl.textContent = orgName || '—';
    const isTrial = Boolean(subscription && subscription.is_trial);
    if (titleEl) {
      titleEl.textContent = isTrial
        ? t('alreadyActiveTitle')
        : t('alreadyPaidTitle');
    }
    if (leadEl) {
      leadEl.textContent = isTrial
        ? t('alreadyActiveLead')
        : t('alreadyPaidLead');
    }
    showStep('already-paid');
  }

  async function portalFetch(path, options = {}) {
    const headers = {
      Accept: 'application/json',
      ...(options.headers || {}),
    };
    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    // Login must not send Authorization — Bearer null is rejected as an invalid JWT.
    if (options.auth === false) {
      delete headers.Authorization;
    } else if (state.accessToken) {
      headers.Authorization = `Bearer ${state.accessToken}`;
    }

    const response = await fetch(`${PORTAL}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (_) {
      data = null;
    }

    if (!response.ok) {
      const detail =
        (data && (data.detail ?? data.message ?? data.error_msg)) ??
        (data && typeof data === 'object' ? data : null) ??
        text;
      const message = formatError(detail) || text || `HTTP ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.body = data || text;
      throw err;
    }
    return data;
  }

  function selectableScopes(scopes) {
    const out = [];
    (scopes || []).forEach((org) => {
      if (org.selectable) {
        out.push({
          orgId: org.org_id,
          label: org.org_name || org.org_id,
          role: org.role || '',
          isTrial: Boolean(org.is_trial),
          suborg: null,
        });
      }
      (org.suborgs || []).forEach((sub) => {
        if (sub.selectable === false) return;
        out.push({
          orgId: sub.org_id,
          label: `${org.org_name || org.org_id} / ${sub.suborg_name || sub.suborg_id}`,
          role: sub.role || '',
          isTrial: Boolean(org.is_trial),
          suborg: sub.suborg_id || sub.suborg_name,
        });
      });
    });
    return out;
  }

  function setFallbackTiers() {
    if (!tierSelect) return;
    tierSelect.innerHTML =
      '<option value="standard">standard</option><option value="pro">pro</option>';
  }

  async function loadTiers() {
    if (!tierSelect) return;
    try {
      const tiers = await portalFetch('/subscription/tiers');
      tierSelect.innerHTML = '';
      (Array.isArray(tiers) ? tiers : [])
        .filter((t) => t.public !== false && t.active !== false)
        .sort((a, b) => (a.level || 0) - (b.level || 0))
        .forEach((t) => {
          const opt = document.createElement('option');
          opt.value = t.name;
          const label = t.display_name || t.name;
          const yearly = t.price_yearly != null ? ` · €${t.price_yearly}/yr` : '';
          const monthly = t.price_monthly != null ? ` · €${t.price_monthly}/mo` : '';
          opt.textContent = `${label}${monthly}${yearly}`;
          tierSelect.appendChild(opt);
        });
      if (!tierSelect.options.length) setFallbackTiers();
    } catch (_) {
      setFallbackTiers();
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fillBillingForm(details) {
    if (!billingForm || !details) return;
    const map = {
      billingCompanyName: details.company_name,
      billingNationality: details.nationality || 'IT',
      billingVatCode: details.vat_code,
      billingFiscalCode: details.fiscal_code,
      billingAddress: details.full_address,
      billingZip: details.zip_code,
      billingCity: details.city,
      billingProvince: details.province,
      billingSdi: details.sdi_code || '0000000',
    };
    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el && value != null && value !== '') el.value = value;
    });
  }

  function userFacingError(err, fallback) {
    const raw = (err && err.message) || '';
    if (!raw || detailsRowUnreadable(err) || raw.includes('Input should be') || raw.includes('pydantic.dev') || raw.length > 240) {
      return fallback;
    }
    return raw;
  }
  function detailsRowUnreadable(err) {
    const raw = ((err && err.message) || '').toLowerCase();
    return raw.includes('accountdetailsresponse') || (raw.includes('validation error') && raw.includes('full_address'));
  }

  async function refreshBillingDetails() {
    try {
      const details = await portalFetch('/account/details');
      state.detailsRowExists = true;
      state.hasBillingDetails = billingDetailsComplete(details);
      fillBillingForm(details);
      return details;
    } catch (err) {
      state.hasBillingDetails = false;
      if (err.status === 404) {
        state.detailsRowExists = false;
        return null;
      }
      if (detailsRowUnreadable(err)) {
        state.detailsRowExists = true;
        return null;
      }
      throw err;
    }
  }

  async function saveBillingDetails(payload) {
    if (state.hasBillingDetails || state.detailsRowExists) {
      await portalFetch('/account/details', { method: 'PATCH', body: payload });
      state.detailsRowExists = true;
      return;
    }
    try {
      await portalFetch('/account/details', { method: 'POST', body: payload });
      state.detailsRowExists = true;
    } catch (err) {
      // The row is already there, including the case where its address fields are null.
      if (err.status === 409 || err.status === 400 || err.status === 422 || detailsRowUnreadable(err)) {
        await portalFetch('/account/details', { method: 'PATCH', body: payload });
        state.detailsRowExists = true;
        return;
      }
      throw err;
    }
  }

  function askForBillingDetails(message) {
    const fromCheckout = Boolean(state.pendingTier && state.pendingFrequency);
    const back = document.querySelector('[data-step="billing"] [data-subscribe-back]');
    const submit = billingForm && billingForm.querySelector('[type="submit"]');
    if (back) back.setAttribute('data-subscribe-back', fromCheckout ? 'plan' : 'login');
    if (submit) submit.textContent = fromCheckout ? t('saveContinueStripe') : t('saveContinue');
    showStep('billing');
    if (message) showInfo(message);
  }

  function emailVerifiedFromToken() {
    const claims = tokenClaims() || {};
    return claims.elemento_email_verified === true;
  }

  function resetSession() {
    clearResendCooldown();
    state.accessToken = null;
    state.refreshToken = null;
    state.username = null;
    state.email = null;
    state.emailVerified = false;
    state.orgId = null;
    state.orgName = null;
    state.hasBillingDetails = false;
    state.detailsRowExists = false;
    state.pendingTier = null;
    state.pendingFrequency = null;
    state.upgradingTrial = false;
    const trialNote = document.getElementById('subscribeTrialNote');
    if (trialNote) trialNote.hidden = true;
  }

  function clearResendCooldown() {
    if (resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
  }

  function showResendNow() {
    clearResendCooldown();
    const hint = document.getElementById('subscribeVerifyResendHint');
    const resendBtn = document.getElementById('subscribeResendCode');
    if (hint) hint.textContent = '';
    if (resendBtn) resendBtn.hidden = false;
  }

  function startResendCooldown() {
    clearResendCooldown();
    const hint = document.getElementById('subscribeVerifyResendHint');
    const resendBtn = document.getElementById('subscribeResendCode');
    if (resendBtn) resendBtn.hidden = true;
    let left = 120;
    const tick = () => {
      if (left <= 0) {
        showResendNow();
        return;
      }
      const minutes = Math.floor(left / 60);
      const seconds = left % 60;
      if (hint) {
        hint.textContent = t('resendWait')
          .replace('{m}', String(minutes))
          .replace('{s}', String(seconds));
      }
      left -= 1;
    };
    tick();
    resendTimer = setInterval(tick, 1000);
  }

  async function requestVerificationCode() {
    await portalFetch('/account/verify-email/request', { method: 'POST' });
    startResendCooldown();
  }

  async function beginEmailVerification() {
    const emailEl = document.getElementById('subscribeVerifyEmail');
    const codeEl = document.getElementById('subscribeVerifyCode');
    if (emailEl) emailEl.textContent = state.email || state.username || '—';
    if (codeEl) codeEl.value = '';
    showStep('verify');
    try {
      await requestVerificationCode();
    } catch (err) {
      showResendNow();
      showError(err.message || t('codeSendFailed'));
    }
  }

  async function refreshSession() {
    if (!state.refreshToken) throw new Error(t('refreshFailed'));
    const data = await portalFetch('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: state.refreshToken },
    });
    if (!data || !data.access_token) throw new Error(t('refreshFailed'));
    state.accessToken = data.access_token;
    if (data.refresh_token) state.refreshToken = data.refresh_token;
  }

  async function showOrganisations() {
    const scopes = await portalFetch('/auth/scopes');
    renderOrgs(scopes && scopes.scopes);
    showStep('org');
  }

  async function continueAfterVerified() {
    try {
      await refreshBillingDetails();
    } catch (err) {
      state.hasBillingDetails = false;
      if (detailsRowUnreadable(err)) state.detailsRowExists = true;
      if (err.status === 401) {
        showError(t('refreshFailed'));
        return;
      }
      askForBillingDetails(t('addBilling'));
      return;
    }
    if (!state.hasBillingDetails) {
      state.pendingTier = null;
      state.pendingFrequency = null;
      askForBillingDetails(t('addBilling'));
      return;
    }
    try {
      await showOrganisations();
    } catch (err) {
      showStep('org');
      if (orgList) orgList.innerHTML = '';
      showError(err.message || t('orgOpenFailed'));
    }
  }

  async function continueAfterAuth() {
    if (!emailVerifiedFromToken()) {
      state.emailVerified = false;
      await beginEmailVerification();
      return;
    }
    state.emailVerified = true;
    await continueAfterVerified();
  }

  function readBillingPayload() {
    const nationality = (document.getElementById('billingNationality').value || 'IT').trim().toUpperCase();
    let sdi = (document.getElementById('billingSdi').value || '').trim();
    if (!sdi) sdi = nationality === 'IT' ? '0000000' : 'XXXXXXX';

    return {
      fiscal_code: (document.getElementById('billingFiscalCode').value || '').trim() || null,
      vat_code: (document.getElementById('billingVatCode').value || '').trim() || null,
      company_name: (document.getElementById('billingCompanyName').value || '').trim() || null,
      full_address: (document.getElementById('billingAddress').value || '').trim(),
      zip_code: (document.getElementById('billingZip').value || '').trim(),
      city: (document.getElementById('billingCity').value || '').trim(),
      province: (document.getElementById('billingProvince').value || '').trim(),
      sdi_code: sdi,
      nationality,
    };
  }

  function renderOrgs(scopes) {
    const items = selectableScopes(scopes);
    orgList.innerHTML = '';
    if (!items.length) {
      orgList.innerHTML =
        `<p class="subscribe-empty">${escapeHtml(t('noOrgs'))}</p>`;
      return;
    }
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'subscribe-org-btn';
      btn.innerHTML = `
        <span class="subscribe-org-name">${escapeHtml(item.label)}</span>
        <span class="subscribe-org-meta">${escapeHtml(item.role)}${item.isTrial ? t('trialMeta') : ''}</span>
      `;
      btn.addEventListener('click', () => selectOrg(item));
      orgList.appendChild(btn);
    });
  }

  async function selectOrg(item) {
    showError('');
    const orgButtons = orgList ? Array.from(orgList.querySelectorAll('.subscribe-org-btn')) : [];
    orgButtons.forEach((btn) => {
      btn.disabled = true;
    });
    try {
      const body = { org_id: item.orgId };
      if (item.suborg) body.suborg = item.suborg;
      const relogin = await portalFetch('/auth/relogin', {
        method: 'POST',
        body,
      });
      if (relogin && relogin.access_token) {
        state.accessToken = relogin.access_token;
      }
      if (relogin && relogin.refresh_token) {
        state.refreshToken = relogin.refresh_token;
      }
      state.orgId = item.orgId;
      state.orgName = item.label;
      const orgLabel = document.getElementById('subscribeSelectedOrg');
      if (orgLabel) orgLabel.textContent = item.label;

      const seat = await findOrgSeat(item.isTrial);
      if (seat.paid) {
        showAlreadyPaid(item.label, seat.paid);
        return;
      }
      state.upgradingTrial = Boolean(seat.trial);
      setTrialNote(state.upgradingTrial);

      await loadTiers();
      try {
        await refreshBillingDetails();
      } catch (_) {
        state.hasBillingDetails = false;
      }
      showStep('plan');
    } catch (err) {
      if (err.status === 400 || err.status === 404) {
        state.orgId = item.orgId;
        state.orgName = item.label;
        const orgLabel = document.getElementById('subscribeSelectedOrg');
        if (orgLabel) orgLabel.textContent = item.label;
        const seat = await findOrgSeat(item.isTrial);
        if (seat.paid) {
          showAlreadyPaid(item.label, seat.paid);
          return;
        }
        state.upgradingTrial = Boolean(seat.trial);
        setTrialNote(state.upgradingTrial);
        await loadTiers();
        showStep('plan');
        return;
      }
      showError(err.message || t('orgOpenFailed'));
    } finally {
      orgButtons.forEach((btn) => {
        btn.disabled = false;
      });
    }
  }

  /**
   * @returns {Promise<'redirected'|'ready'|'needs-billing'|void>}
   */
  async function startCheckout(tier, billing_frequency) {
    state.pendingTier = tier;
    state.pendingFrequency = billing_frequency;

    if (!state.hasBillingDetails) {
      try {
        await refreshBillingDetails();
      } catch (_) { /* treat as missing */ }
    }
    if (!state.hasBillingDetails) {
      askForBillingDetails(t('addBilling'));
      return 'needs-billing';
    }

    let current = null;
    try {
      current = await portalFetch('/subscription/');
      const status = current && String(current.status || '').toLowerCase();
      if (current && (status === 'incomplete' || status === 'incomplete_expired' || status === 'past_due')) {
        if (await tryPaymentLinks()) return 'redirected';
      }
    } catch (_) { /* no current subscription */ }

    // A free trial is not a tier, so it buys a new subscription.
    // change-tier is only a move from one paid tier to another.
    const currentPaidTier = state.upgradingTrial ? '' : paidTierName(current);
    if (currentPaidTier && currentPaidTier === String(tier)) {
      showAlreadyPaid(state.orgName, current);
      return 'already-paid';
    }
    let changingTier = Boolean(currentPaidTier) && currentPaidTier !== String(tier);

    const checkoutBody = {
      email: state.email || state.username,
      tier,
      billing_frequency,
    };
    let data;
    try {
      data = await portalFetch(
        changingTier ? '/subscription/change-tier' : '/subscription/subscribe',
        { method: 'POST', body: checkoutBody }
      );
    } catch (err) {
      if (isIncompleteBillingError(err)) {
        state.hasBillingDetails = false;
        askForBillingDetails(
          t('incompleteBilling')
        );
        return 'needs-billing';
      }
      if (!changingTier && err.status === 409 && !state.upgradingTrial) {
        const seat = await findOrgSeat(false);
        const paidName = paidTierName(seat.paid);
        if (paidName && paidName !== String(tier)) {
          changingTier = true;
          data = await portalFetch('/subscription/change-tier', {
            method: 'POST',
            body: checkoutBody,
          });
        } else {
          if (await tryPaymentLinks()) return 'redirected';
          showAlreadyPaid(state.orgName, seat.paid || { is_trial: false });
          return 'already-paid';
        }
      } else if (err.status >= 500) {
        if (await tryPaymentLinks()) return 'redirected';
        const claims = tokenClaims() || {};
        if (!state.upgradingTrial && !changingTier && claims.elemento_active_subscriber === true) {
          showAlreadyPaid(state.orgName, { is_trial: false });
          return 'already-paid';
        }
      }
      if (!data) throw err;
    }

    const url = checkoutUrlFrom(data);
    if (url) {
      window.location.href = url;
      return 'redirected';
    }
    const checkout = data && data.checkouts && data.checkouts[0];
    const trialGranted =
      checkout &&
      Array.isArray(checkout.subscriptions) &&
      checkout.subscriptions.some((s) => s && s.is_trial);
    if (!changingTier && (trialGranted || (checkout && checkout.checkout_url == null))) {
      return 'ready';
    }
    throw new Error(t('noCheckoutUrl'));
  }

  panel.querySelectorAll('[data-subscribe-back]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const to = btn.getAttribute('data-subscribe-back');
      if (to === 'login') resetSession();
      if (to) showStep(to);
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showError('');
      const submitBtn = loginForm.querySelector('[type="submit"]');
      const emailEl = document.getElementById('subscribeEmail');
      const passwordEl = document.getElementById('subscribePassword');
      const email = emailEl.value.trim();
      const password = passwordEl.value;
      emailEl.style.borderColor = '';
      passwordEl.style.borderColor = '';
      if (!email || !password) {
        if (!email) emailEl.style.borderColor = '#DC3545';
        if (!password) passwordEl.style.borderColor = '#DC3545';
        showError(t('enterCredentials'));
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = t('signingIn');
      try {
        const data = await portalFetch('/auth/userpass', {
          method: 'POST',
          auth: false,
          body: { username: email, password },
        });
        if (!data || !data.access_token) {
          throw new Error(t('noToken'));
        }
        state.accessToken = data.access_token;
        state.refreshToken = data.refresh_token || null;
        state.username = data.username || email;
        state.email = email;
        state.orgId = null;
        state.orgName = null;
        state.pendingTier = null;
        state.pendingFrequency = null;
        await continueAfterAuth();
      } catch (err) {
        showError(err.message || t('signInFailed'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t('continue');
      }
    });
  }

  if (planForm) {
    planForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showError('');
      const submitBtn = planForm.querySelector('[type="submit"]');
      const tier = tierSelect.value;
      const billing_frequency = freqSelect.value;
      if (!state.orgId || !tier || !billing_frequency) {
        showError(t('selectOrgPlan'));
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = t('openingStripe');
      try {
        const result = await startCheckout(tier, billing_frequency);
        if (result === 'ready') {
          submitBtn.textContent = t('seatReady');
          const lead = planForm.closest('[data-step="plan"]')?.querySelector('.subscribe-step-lead');
          if (lead) {
            lead.textContent =
              t('seatReadyLead');
          }
          return;
        }
        if (result === 'needs-billing' || result === 'redirected' || result === 'already-paid') return;
      } catch (err) {
        showError(friendlySubscribeError(err));
      } finally {
        if (submitBtn.textContent === t('openingStripe')) {
          submitBtn.disabled = false;
          submitBtn.textContent = t('continueStripe');
        }
      }
    });
  }

  if (billingForm) {
    billingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showError('');
      const submitBtn = billingForm.querySelector('[type="submit"]');
      const payload = readBillingPayload();
      if (!payload.full_address || !payload.zip_code || !payload.city || !payload.province || !payload.nationality) {
        showError(t('billingRequired'));
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = t('saving');
      try {
        // Keys fiscal_code / vat_code must be present even when null (portal contract).
        await saveBillingDetails(payload);
        const saved = await refreshBillingDetails();
        if (!billingDetailsComplete(saved)) {
          state.hasBillingDetails = false;
          showError(t('billingSavedIncomplete'));
          return;
        }
        state.hasBillingDetails = true;

        const tier = state.pendingTier;
        const billing_frequency = state.pendingFrequency;
        if (!tier || !billing_frequency) {
          await showOrganisations();
          return;
        }

        submitBtn.textContent = t('openingStripe');
        const result = await startCheckout(tier, billing_frequency);
        if (result === 'ready') {
          showStep('plan');
          const planBtn = planForm && planForm.querySelector('[type="submit"]');
          if (planBtn) planBtn.textContent = t('seatReady');
          return;
        }
        if (result === 'needs-billing') {
          showError(t('billingSavedIncomplete'));
          return;
        }
        if (result === 'already-paid' || result === 'redirected') return;
      } catch (err) {
        showError(userFacingError(err, t('billingSaveFailed')));
      } finally {
        if (submitBtn.textContent !== t('seatReady')) {
          submitBtn.disabled = false;
          submitBtn.textContent = (state.pendingTier && state.pendingFrequency)
            ? t('saveContinueStripe')
            : t('saveContinue');
        }
      }
    });
  }

  const verifyCodeInput = document.getElementById('subscribeVerifyCode');
  if (verifyCodeInput) {
    verifyCodeInput.addEventListener('input', () => {
      const digits = verifyCodeInput.value.replace(/\D/g, '').slice(0, 6);
      if (verifyCodeInput.value !== digits) verifyCodeInput.value = digits;
    });
  }

  const resendBtn = document.getElementById('subscribeResendCode');
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      showError('');
      resendBtn.disabled = true;
      try {
        await requestVerificationCode();
      } catch (err) {
        showResendNow();
        showError(err.message || t('codeSendFailed'));
      } finally {
        resendBtn.disabled = false;
      }
    });
  }

  if (verifyForm) {
    verifyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showError('');
      const codeEl = document.getElementById('subscribeVerifyCode');
      const submitBtn = verifyForm.querySelector('[type="submit"]');
      const code = (codeEl.value || '').replace(/\D/g, '');
      if (code.length !== 6) {
        codeEl.style.borderColor = '#DC3545';
        showError(t('enterCode'));
        return;
      }
      codeEl.style.borderColor = '';
      submitBtn.disabled = true;
      submitBtn.textContent = t('verifying');
      try {
        await portalFetch('/account/verify-email/confirm', {
          method: 'POST',
          body: { code },
        });
        await refreshSession();
        if (!emailVerifiedFromToken()) throw new Error(t('stillUnverified'));
        state.emailVerified = true;
        clearResendCooldown();
        await continueAfterVerified();
      } catch (err) {
        if (err.status === 400) showError(t('codeInvalid'));
        else showError(err.message || t('codeInvalid'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t('verify');
      }
    });
  }

  showStep('login');
  if (new URLSearchParams(window.location.search).get('session') === 'expired') {
    showError(t('sessionExpired'));
  }
})();
