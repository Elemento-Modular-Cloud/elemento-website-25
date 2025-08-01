 // Enhanced Contact Form with Detailed Logging
document.addEventListener('DOMContentLoaded', function() {
    // Initialize logging utility
    function log(message, level = 'info', data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data,
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer
        };
        
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data ? data : '');
        
        // Store logs in localStorage for debugging (limit to last 50 entries)
        try {
            const logs = JSON.parse(localStorage.getItem('elemento-contact-logs') || '[]');
            logs.push(logEntry);
            if (logs.length > 50) logs.shift();
            localStorage.setItem('elemento-contact-logs', JSON.stringify(logs));
        } catch (error) {
            console.warn('Could not store log entry:', error);
        }
    }

    // Initialize form variables
    let formSubmissionAttempts = 0;
    let lastSubmissionTime = 0;
    const MAX_ATTEMPTS = 3;
    const COOLDOWN_TIME = 300000; // 5 minutes
    
    // Track user interaction to detect bots
    let userInteractions = 0;
    let formLoadTime = Date.now();
    
    log('Contact form script initialized', 'info', {
        formLoadTime,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    
    // Monitor user interactions
    document.addEventListener('mousemove', () => {
        userInteractions++;
        if (userInteractions % 10 === 0) { // Log every 10th interaction
            log('User interaction detected', 'debug', { userInteractions, type: 'mousemove' });
        }
    });
    document.addEventListener('keypress', () => {
        userInteractions++;
        log('User interaction detected', 'debug', { userInteractions, type: 'keypress' });
    });
    document.addEventListener('click', () => {
        userInteractions++;
        log('User interaction detected', 'debug', { userInteractions, type: 'click' });
    });
    
    // Character counter
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            log('Message character count updated', 'debug', { charCount: count, maxLength: 1000 });
            
            if (count > 1000) {
                charCount.style.color = 'var(--error-color)';
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });
    }
    
    // Enhanced bot detection
    function detectBot() {
        const timeOnPage = Date.now() - formLoadTime;
        const interactionRate = userInteractions / (timeOnPage / 1000);
        
        // Bot indicators
        const indicators = [];
        
        // Too fast submission
        if (timeOnPage < 5000) indicators.push('too_fast');
        
        // No user interactions
        if (userInteractions < 3) indicators.push('no_interaction');
        
        // Low interaction rate
        if (interactionRate < 0.1) indicators.push('low_interaction');
        
        // Check for automation tools
        if (navigator.webdriver) indicators.push('webdriver');
        
        // Check for headless browser indicators
        if (!navigator.plugins.length) indicators.push('no_plugins');
        if (!navigator.languages.length) indicators.push('no_languages');
        
        const isBot = indicators.length > 2;
        
        log('Bot detection analysis', 'info', {
            timeOnPage,
            userInteractions,
            interactionRate,
            indicators,
            isBot,
            webdriver: navigator.webdriver,
            plugins: navigator.plugins.length,
            languages: navigator.languages.length
        });
        
        return isBot;
    }
    
    // Enhanced form validation
    function validateForm() {
        const form = document.getElementById('contactForm');
        if (!form) {
            log('Form not found', 'error');
            return false;
        }
        
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        const validationErrors = [];
        
        log('Starting form validation', 'info', { requiredFieldsCount: requiredFields.length });
        
        // Check required fields
        requiredFields.forEach(field => {
            const fieldValue = field.value.trim();
            log('Validating field', 'debug', { fieldName: field.name, fieldValue: fieldValue, hasValue: !!fieldValue });
            
            if (!fieldValue) {
                isValid = false;
                field.style.borderColor = '#DC3545';
                validationErrors.push(`Missing required field: ${field.name}`);
                log('Validation error', 'warn', { field: field.name, error: 'missing_required' });
            } else {
                field.style.borderColor = '';
            }
        });
        
        // Validate email format
        const email = document.getElementById('email');
        if (email) {
            const emailValue = email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailValue && !emailRegex.test(emailValue)) {
                isValid = false;
                email.style.borderColor = '#DC3545';
                validationErrors.push('Invalid email format');
                log('Validation error', 'warn', { field: 'email', error: 'invalid_format', value: emailValue });
            }
        }
        
        // Validate message length
        const message = document.getElementById('message');
        if (message) {
            const messageValue = message.value.trim();
            if (messageValue && messageValue.length < 10) {
                isValid = false;
                message.style.borderColor = '#DC3545';
                validationErrors.push('Message too short');
                log('Validation error', 'warn', { field: 'message', error: 'too_short', length: messageValue.length });
            }
        }
        
        log('Form validation completed', isValid ? 'info' : 'warn', {
            isValid,
            errors: validationErrors,
            totalErrors: validationErrors.length
        });
        
        return isValid;
    }
    
    // Form submission with Web3Forms
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            log('Form submission attempt started', 'info', {
                formSubmissionAttempts,
                timeSinceLastSubmission: Date.now() - lastSubmissionTime
            });
            
            // Rate limiting
            const now = Date.now();
            if (now - lastSubmissionTime < 5000) { // 5 second cooldown
                log('Rate limiting triggered', 'warn', { timeSinceLastSubmission: now - lastSubmissionTime });
                showError('Please wait before submitting again.');
                return;
            }
            
            // Check submission attempts
            if (formSubmissionAttempts >= MAX_ATTEMPTS) {
                log('Maximum submission attempts reached', 'error', { attempts: formSubmissionAttempts, maxAttempts: MAX_ATTEMPTS });
                showError('Too many submission attempts. Please try again later.');
                return;
            }
            
            // Bot detection
            if (detectBot()) {
                log('Bot detection triggered', 'warn', { userInteractions, timeOnPage: now - formLoadTime });
                showError('Suspicious activity detected. Please try again.');
                return;
            }
            
            // Validate form
            if (!validateForm()) {
                log('Form validation failed', 'warn');
                showError('Please complete all required fields correctly.');
                return;
            }
            
            log('Form validation passed, preparing submission', 'info');
            
            // Disable submit button
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Add security data to form
            const securityData = document.createElement('input');
            securityData.type = 'hidden';
            securityData.name = 'security_data';
            const securityPayload = {
                timestamp: now,
                userInteractions: userInteractions,
                timeOnPage: now - formLoadTime,
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            securityData.value = JSON.stringify(securityPayload);
            this.appendChild(securityData);
            
            log('Submitting form to Web3Forms', 'info', {
                action: this.action,
                securityData: securityPayload
            });
            
            // Submit to Web3Forms
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this)
            })
            .then(response => {
                log('Web3Forms response received', 'info', { status: response.status, statusText: response.statusText });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                log('Web3Forms response parsed', 'info', { success: data.success, data });
                
                if (data.success) {
                    log('Form submission successful', 'info', { data });
                    
                    // Show success
                    document.getElementById('contactForm').style.display = 'none';
                    document.getElementById('successMessage').classList.add('show');
                    
                    // Remove the duplicate notification call
                    // showSuccessNotification();
                } else {
                    log('Form submission failed', 'error', { data });
                    showError('Submission failed. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
            })
            .catch(error => {
                log('Form submission error', 'error', { error: error.message, stack: error.stack });
                showError('Submission failed. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
            
            formSubmissionAttempts++;
            lastSubmissionTime = now;
            
            log('Form submission attempt completed', 'info', {
                attempts: formSubmissionAttempts,
                lastSubmissionTime: now
            });
        });
    }
    
    function showError(message) {
        log('Showing error message', 'warn', { message });
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.innerHTML = `<p>${message}</p>`;
            errorDiv.classList.add('show');
            setTimeout(() => {
                errorDiv.classList.remove('show');
                log('Error message hidden', 'debug');
            }, 5000);
        }
    }
    
    // Log page visibility changes
    document.addEventListener('visibilitychange', function() {
        log('Page visibility changed', 'debug', { 
            hidden: document.hidden,
            visibilityState: document.visibilityState
        });
    });
    
    // Log when form becomes visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                log('Contact form became visible', 'info', { 
                    intersectionRatio: entry.intersectionRatio,
                    boundingClientRect: entry.boundingClientRect
                });
            }
        });
    });
    
    const formContainer = document.querySelector('.inline-form-container');
    if (formContainer) {
        observer.observe(formContainer);
    }
    
    log('Contact form script setup completed', 'info');
});