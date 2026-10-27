/**
 * Registration welcome page:
 * sign in (only if the registration session is gone) → verify email → choices.
 * Buying a seat is a separate page with its own sign-in and verify step.
 */
(function () {
  const PORTAL = 'https://portal.elemento.cloud/api/v2';

  const UI = {
    en: {
      leadVerify: 'Enter the 6-digit code sent to {email}.',
      leadSignIn: 'Sign in to verify your email, then choose how to continue.',
      leadVerified: 'Your email is verified. Choose how to continue.',
      sessionExpired: 'Your session expired. Sign in again to verify your email.',
      signIn: 'Sign in',
      signingIn: 'Signing in…',
      enterCredentials: 'Enter your email and password.',
      signInFailed: 'Sign-in failed. Check your credentials and try again.',
      noToken: 'Login succeeded but no access token was returned.',
      verify: 'Verify email',
      verifying: 'Verifying…',
      resend: 'Resend code',
      resendWait: 'You can ask for a new code in {m} min {s}s.',
      enterCode: 'Enter the 6-digit code from your email.',
      codeInvalid: 'That code is wrong or has expired. Request a new one if you need to.',
      codeSendFailed: 'Could not send the verification code. Try again.',
      refreshFailed: 'Your email was verified, but the session could not be refreshed. Sign in again.',
      stillUnverified: 'This session still shows the email as unverified. Sign in again.',
    },
    it: {
      leadVerify: 'Inserisci il codice a 6 cifre inviato a {email}.',
      leadSignIn: 'Accedi per verificare la tua email, poi scegli come continuare.',
      leadVerified: 'La tua email è verificata. Scegli come continuare.',
      sessionExpired: 'La sessione è scaduta. Accedi di nuovo per verificare la tua email.',
      signIn: 'Accedi',
      signingIn: 'Accesso…',
      enterCredentials: 'Inserisci email e password.',
      signInFailed: 'Accesso non riuscito. Controlla le credenziali e riprova.',
      noToken: 'Accesso riuscito ma non è stato restituito alcun token.',
      verify: 'Verifica email',
      verifying: 'Verifica…',
      resend: 'Invia di nuovo il codice',
      resendWait: 'Puoi chiedere un nuovo codice tra {m} min {s}s.',
      enterCode: 'Inserisci il codice a 6 cifre ricevuto via email.',
      codeInvalid: 'Il codice è errato o scaduto. Richiedine uno nuovo se serve.',
      codeSendFailed: 'Impossibile inviare il codice di verifica. Riprova.',
      refreshFailed: 'Email verificata, ma la sessione non è stata aggiornata. Accedi di nuovo.',
      stillUnverified: 'Questa sessione risulta ancora con email non verificata. Accedi di nuovo.',
    },
    fr: {
      leadVerify: 'Saisissez le code à 6 chiffres envoyé à {email}.',
      leadSignIn: 'Connectez-vous pour vérifier votre e-mail, puis choisissez comment continuer.',
      leadVerified: 'Votre e-mail est vérifié. Choisissez comment continuer.',
      sessionExpired: 'Votre session a expiré. Reconnectez-vous pour vérifier votre e-mail.',
      signIn: 'Se connecter',
      signingIn: 'Connexion…',
      enterCredentials: 'Saisissez votre e-mail et votre mot de passe.',
      signInFailed: 'Connexion échouée. Vérifiez vos identifiants et réessayez.',
      noToken: 'Connexion réussie mais aucun jeton n’a été renvoyé.',
      verify: 'Vérifier l’e-mail',
      verifying: 'Vérification…',
      resend: 'Renvoyer le code',
      resendWait: 'Vous pourrez demander un nouveau code dans {m} min {s} s.',
      enterCode: 'Saisissez le code à 6 chiffres reçu par e-mail.',
      codeInvalid: 'Ce code est incorrect ou expiré. Demandez-en un nouveau si besoin.',
      codeSendFailed: 'Impossible d’envoyer le code de vérification. Réessayez.',
      refreshFailed: 'E-mail vérifié, mais la session n’a pas pu être renouvelée. Reconnectez-vous.',
      stillUnverified: 'Cette session indique encore un e-mail non vérifié. Reconnectez-vous.',
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

  function buySeatHref() {
    const loc = pageLocale();
    if (window.ElementoI18n?.localeStemHref) {
      return window.ElementoI18n.localeStemHref('buy-seat', loc);
    }
    return loc === 'en' ? '/buy-seat.html' : `/${loc}/buy-seat.html`;
  }

  const signInPanel = document.getElementById('signupSignIn');
  const signInForm = document.getElementById('signupSignInForm');
  const signInEmailEl = document.getElementById('signupSignInEmail');
  const signInPasswordEl = document.getElementById('signupSignInPassword');
  const signInSubmit = document.getElementById('signupSignInSubmit');
  const verifyPanel = document.getElementById('signupVerify');
  const choicesPanel = document.getElementById('signupChoices');
  const form = document.getElementById('signupVerifyForm');
  const alertEl = document.getElementById('signupVerifyAlert');
  const leadEl = document.getElementById('signupVerifyLead');
  const codeEl = document.getElementById('signupVerifyCode');
  const hintEl = document.getElementById('signupVerifyHint');
  const resendBtn = document.getElementById('signupResendCode');
  const submitBtn = document.getElementById('signupVerifySubmit');
  const buyLink = document.getElementById('signupBuyElectros');
  if (!form || !codeEl || !submitBtn || !signInForm) return;

  if (buyLink) buyLink.href = buySeatHref();

  let accessToken = null;
  let refreshToken = null;
  let accountEmail = '';
  let resendTimer = null;

  function showAlert(message) {
    if (!alertEl) return;
    alertEl.textContent = message || '';
    alertEl.hidden = !message;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
    }[ch]));
  }

  function setLead(key, email) {
    if (!leadEl) return;
    if (key === 'leadVerify') {
      const shown = email || 'your email';
      leadEl.innerHTML = t('leadVerify').replace('{email}', `<strong>${escapeHtml(shown)}</strong>`);
      return;
    }
    leadEl.textContent = t(key);
  }

  function storedEmail() {
    try {
      const raw = sessionStorage.getItem('elemento_registration');
      const parsed = raw ? JSON.parse(raw) : null;
      return (parsed && parsed.email) || sessionStorage.getItem('elemento_username') || '';
    } catch (_) {
      return '';
    }
  }

  function rememberEmail(email) {
    if (!email) return;
    accountEmail = email;
    try {
      sessionStorage.setItem('elemento_username', email);
    } catch (_) { /* ignore */ }
  }

  function tokenClaims(token) {
    try {
      const part = String(token || '').split('.')[1];
      if (!part) return null;
      const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
      return JSON.parse(atob(padded));
    } catch (_) {
      return null;
    }
  }

  function emailVerified(token) {
    const claims = tokenClaims(token) || {};
    return claims.elemento_email_verified === true;
  }

  async function portalFetch(path, options = {}) {
    const headers = { Accept: 'application/json' };
    if (options.body) headers['Content-Type'] = 'application/json';
    if (accessToken && options.auth !== false) headers.Authorization = `Bearer ${accessToken}`;
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
      let detail = data && (data.detail ?? data.message ?? data.error_msg);
      if (detail && typeof detail === 'object') {
        detail = detail.error_msg || detail.message || detail.detail || '';
      }
      const err = new Error((typeof detail === 'string' && detail) || text || `HTTP ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return data;
  }

  function tokenExpired(err) {
    const raw = ((err && err.message) || '').toLowerCase();
    return raw.includes('token expired') || raw.includes('token_expired') || (err && err.status === 401);
  }

  function accessTokenStale(token) {
    const claims = tokenClaims(token);
    if (!claims || typeof claims.exp !== 'number') return false;
    return claims.exp * 1000 <= Date.now();
  }

  function clearSession() {
    accessToken = null;
    refreshToken = null;
    try {
      sessionStorage.removeItem('elemento_access_token');
      sessionStorage.removeItem('elemento_refresh_token');
    } catch (_) { /* ignore */ }
  }

  function storeSession(data, email) {
    accessToken = data.access_token;
    if (data.refresh_token) refreshToken = data.refresh_token;
    rememberEmail(email || data.username || accountEmail);
    try {
      sessionStorage.setItem('elemento_access_token', accessToken);
      if (refreshToken) sessionStorage.setItem('elemento_refresh_token', refreshToken);
    } catch (_) { /* ignore */ }
  }

  function showStep(step) {
    if (signInPanel) signInPanel.hidden = step !== 'signin';
    if (verifyPanel) verifyPanel.hidden = step !== 'verify';
    if (choicesPanel) choicesPanel.hidden = step !== 'choices';
  }

  function showSignIn(reason) {
    if (resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
    showStep('signin');
    setLead('leadSignIn');
    showAlert(reason === 'expired' ? t('sessionExpired') : '');
    if (signInEmailEl && accountEmail && !signInEmailEl.value) signInEmailEl.value = accountEmail;
    if (signInSubmit) {
      signInSubmit.disabled = false;
      signInSubmit.textContent = t('signIn');
    }
  }

  function showResendNow() {
    if (resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
    if (hintEl) hintEl.textContent = '';
    if (resendBtn) resendBtn.hidden = false;
  }

  function startResendCooldown() {
    showResendNow();
    if (resendBtn) resendBtn.hidden = true;
    let left = 120;
    const tick = () => {
      if (left <= 0) {
        showResendNow();
        return;
      }
      const minutes = Math.floor(left / 60);
      const seconds = left % 60;
      if (hintEl) {
        hintEl.textContent = t('resendWait')
          .replace('{m}', String(minutes))
          .replace('{s}', String(seconds));
      }
      left -= 1;
    };
    tick();
    resendTimer = setInterval(tick, 1000);
  }

  async function requestCode() {
    await portalFetch('/account/verify-email/request', { method: 'POST' });
    startResendCooldown();
  }

  function showVerify() {
    showAlert('');
    showStep('verify');
    setLead('leadVerify', accountEmail);
    if (submitBtn) submitBtn.textContent = t('verify');
  }

  function showChoices() {
    if (resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
    showAlert('');
    showStep('choices');
    setLead('leadVerified');
  }

  async function refreshSession() {
    if (!refreshToken) throw new Error(t('refreshFailed'));
    const data = await portalFetch('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken },
    });
    if (!data || !data.access_token) throw new Error(t('refreshFailed'));
    storeSession(data, accountEmail);
  }

  async function continueAfterAuth() {
    if (emailVerified(accessToken)) {
      showChoices();
      return;
    }
    showVerify();
    try {
      await requestCode();
    } catch (err) {
      if (tokenExpired(err)) {
        clearSession();
        showSignIn('expired');
        return;
      }
      showResendNow();
      showAlert(err.message || t('codeSendFailed'));
    }
  }

  codeEl.addEventListener('input', () => {
    const digits = codeEl.value.replace(/\D/g, '').slice(0, 6);
    if (codeEl.value !== digits) codeEl.value = digits;
  });

  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      showAlert('');
      resendBtn.disabled = true;
      try {
        await requestCode();
      } catch (err) {
        if (tokenExpired(err)) {
          clearSession();
          showSignIn('expired');
          return;
        }
        showResendNow();
        showAlert(err.message || t('codeSendFailed'));
      } finally {
        resendBtn.disabled = false;
      }
    });
  }

  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showAlert('');
    const email = (signInEmailEl && signInEmailEl.value || '').trim().toLowerCase();
    const password = signInPasswordEl ? signInPasswordEl.value : '';
    if (signInEmailEl) signInEmailEl.style.borderColor = '';
    if (signInPasswordEl) signInPasswordEl.style.borderColor = '';
    if (!email || !password) {
      if (signInEmailEl && !email) signInEmailEl.style.borderColor = '#DC3545';
      if (signInPasswordEl && !password) signInPasswordEl.style.borderColor = '#DC3545';
      showAlert(t('enterCredentials'));
      return;
    }
    if (signInEmailEl && signInEmailEl.value !== email) signInEmailEl.value = email;
    if (signInSubmit) {
      signInSubmit.disabled = true;
      signInSubmit.textContent = t('signingIn');
    }
    try {
      const data = await portalFetch('/auth/userpass', {
        method: 'POST',
        auth: false,
        body: { username: email, password },
      });
      if (!data || !data.access_token) throw new Error(t('noToken'));
      storeSession(data, email);
      if (signInPasswordEl) signInPasswordEl.value = '';
      await continueAfterAuth();
    } catch (err) {
      showAlert(err.message || t('signInFailed'));
    } finally {
      if (signInSubmit && signInPanel && !signInPanel.hidden) {
        signInSubmit.disabled = false;
        signInSubmit.textContent = t('signIn');
      }
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showAlert('');
    const code = (codeEl.value || '').replace(/\D/g, '');
    if (code.length !== 6) {
      codeEl.style.borderColor = '#DC3545';
      showAlert(t('enterCode'));
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
      if (!emailVerified(accessToken)) throw new Error(t('stillUnverified'));
      showChoices();
    } catch (err) {
      if (tokenExpired(err)) {
        clearSession();
        showSignIn('expired');
        return;
      }
      if (err.status === 400) showAlert(t('codeInvalid'));
      else showAlert(err.message || t('codeInvalid'));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t('verify');
    }
  });

  try {
    localStorage.setItem('elemento-registration-success', 'true');
    localStorage.setItem('elemento-registration-timestamp', Date.now().toString());
  } catch (_) { /* ignore */ }
  if (typeof gtag !== 'undefined') {
    gtag('event', 'sign_up', { method: 'web_form' });
  }

  accessToken = sessionStorage.getItem('elemento_access_token');
  refreshToken = sessionStorage.getItem('elemento_refresh_token');
  accountEmail = storedEmail();

  if (!accessToken || accessTokenStale(accessToken)) {
    const hadToken = Boolean(accessToken);
    clearSession();
    showSignIn(hadToken ? 'expired' : 'missing');
    return;
  }

  continueAfterAuth();
})();
