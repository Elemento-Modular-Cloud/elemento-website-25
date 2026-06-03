/**
 * Iubenda Consent Database — form consent recording (signup newsletter / legal notices).
 * Preference keys must match identifiers configured in the Iubenda dashboard.
 */
(function () {
    const DEFAULT_CONFIG = {
        endpoint: 'https://consent.iubenda.com/public/consent',
        publicApiKey: 'sxLUEyAyNL0U7vRevCJj7IqOklkcEx0C',
        legalNotices: [
            { identifier: 'privacy_policy' },
            { identifier: 'cookie_policy' },
            { identifier: 'terms' }
        ],
        subjectIdPrefix: 'elemento',
        proofForm: 'elemento-signup-form'
    };

    const SUBJECT_ID_STORAGE_KEY = 'elemento_iubenda_subject_id';

    function getConfig() {
        const globalConfig = window.elementoIubendaConsentConfig || {};
        return {
            endpoint: globalConfig.endpoint || DEFAULT_CONFIG.endpoint,
            publicApiKey: globalConfig.publicApiKey || DEFAULT_CONFIG.publicApiKey,
            legalNotices:
                Array.isArray(globalConfig.legalNotices) && globalConfig.legalNotices.length > 0
                    ? globalConfig.legalNotices
                    : DEFAULT_CONFIG.legalNotices,
            subjectIdPrefix: globalConfig.subjectIdPrefix || DEFAULT_CONFIG.subjectIdPrefix,
            proofForm: globalConfig.signupProofForm || globalConfig.proofForm || DEFAULT_CONFIG.proofForm
        };
    }

    function getOrCreateSubjectId(prefix) {
        const existing = localStorage.getItem(SUBJECT_ID_STORAGE_KEY);
        if (existing) {
            return existing;
        }

        const randomPart =
            typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const subjectId = `${prefix}-${randomPart}`;
        localStorage.setItem(SUBJECT_ID_STORAGE_KEY, subjectId);
        return subjectId;
    }

    function buildSignupProofContent(fields) {
        return JSON.stringify({
            form: 'signup',
            email: fields.email,
            firstName: fields.firstName,
            lastName: fields.lastName,
            company: fields.company || null,
            role: fields.role || null,
            useCase: fields.useCase || null,
            newsletter: Boolean(fields.newsletter),
            termsAccepted: Boolean(fields.termsAccepted),
            sourcePage: fields.sourcePage || null
        });
    }

    function buildSignupProofForm(formElement) {
        if (!formElement) {
            return 'Elemento signup form — newsletter and terms checkboxes';
        }

        const newsletterLabel = formElement.querySelector('label[for="newsletter"]');
        const termsLabel = formElement.querySelector('label[for="terms"]');
        const parts = ['Elemento signup form'];
        if (newsletterLabel) {
            parts.push(`Newsletter: ${newsletterLabel.textContent.trim()}`);
        }
        if (termsLabel) {
            parts.push(`Terms: ${termsLabel.textContent.trim()}`);
        }
        return parts.join(' | ');
    }

    async function postConsent(payload) {
        const config = getConfig();
        if (!config.publicApiKey) {
            return;
        }

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ApiKey: config.publicApiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Iubenda consent sync failed (${response.status}): ${errorText}`);
        }
    }

    /**
     * Record signup legal notices and newsletter / mailing-list preference in Iubenda.
     * @param {object} options
     * @param {string} options.email
     * @param {string} [options.firstName]
     * @param {string} [options.lastName]
     * @param {boolean} options.newsletter
     * @param {boolean} [options.termsAccepted=true]
     * @param {HTMLFormElement} [options.formElement]
     * @param {string} [options.sourcePage]
     */
    async function recordSignupConsent(options) {
        const config = getConfig();
        if (!config.publicApiKey || !options?.email) {
            return;
        }

        const firstName = (options.firstName || '').trim();
        const lastName = (options.lastName || '').trim();
        const fullName = [firstName, lastName].filter(Boolean).join(' ');

        const subject = {
            id: getOrCreateSubjectId(config.subjectIdPrefix),
            email: options.email.trim()
        };
        if (firstName) subject.first_name = firstName;
        if (lastName) subject.last_name = lastName;
        if (fullName) subject.full_name = fullName;

        const newsletterOptIn = Boolean(options.newsletter);
        const termsAccepted = options.termsAccepted !== false;

        const payload = {
            timestamp: new Date().toISOString(),
            subject,
            legal_notices: termsAccepted ? config.legalNotices : [{ identifier: 'privacy_policy' }],
            preferences: {
                newsletter: newsletterOptIn,
                mailing_list: newsletterOptIn,
                terms: termsAccepted
            },
            proofs: [
                {
                    content: buildSignupProofContent({
                        email: subject.email,
                        firstName,
                        lastName,
                        company: options.company,
                        role: options.role,
                        useCase: options.useCase,
                        newsletter: newsletterOptIn,
                        termsAccepted,
                        sourcePage: options.sourcePage || window.location.pathname
                    }),
                    form: buildSignupProofForm(options.formElement)
                }
            ]
        };

        await postConsent(payload);
    }

    window.ElementoIubendaFormConsent = {
        getConfig,
        getOrCreateSubjectId,
        postConsent,
        recordSignupConsent
    };
})();
