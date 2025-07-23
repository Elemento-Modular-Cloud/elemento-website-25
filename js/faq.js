/**
 * Unified FAQ Handler for Elemento Website
 * Handles FAQ accordion functionality across all pages
 */

class FAQHandler {
    constructor() {
        this.init();
    }

    init() {
        // Initialize FAQ functionality when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFAQ());
        } else {
            this.setupFAQ();
        }
    }

    setupFAQ() {
        // Add event listeners to all FAQ questions
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            // Remove existing onclick attributes and add event listeners
            question.removeAttribute('onclick');
            question.addEventListener('click', (e) => this.toggleFAQ(e.currentTarget));
        });
    }

    toggleFAQ(button) {
        const faqItem = button.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const arrow = button.querySelector('.faq-arrow');
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQ items (accordion behavior)
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                const otherAnswer = item.querySelector('.faq-answer');
                const otherArrow = item.querySelector('.faq-arrow');
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.classList.remove('active');
                }
                if (otherArrow) {
                    otherArrow.style.transform = 'rotate(0deg)';
                }
            }
        });
        
        // Toggle current item
        faqItem.classList.toggle('active');
        
        if (faqItem.classList.contains('active')) {
            // Open the FAQ
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.classList.add('active');
            if (arrow) {
                arrow.style.transform = 'rotate(180deg)';
            }
        } else {
            // Close the FAQ
            answer.style.maxHeight = '0';
            answer.classList.remove('active');
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    }

    // Method to programmatically open a specific FAQ
    openFAQ(faqIndex) {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems[faqIndex]) {
            const button = faqItems[faqIndex].querySelector('.faq-question');
            this.toggleFAQ(button);
        }
    }

    // Method to close all FAQs
    closeAllFAQs() {
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            const arrow = item.querySelector('.faq-arrow');
            if (answer) {
                answer.style.maxHeight = '0';
                answer.classList.remove('active');
            }
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Method to get current open FAQ
    getOpenFAQ() {
        const openItem = document.querySelector('.faq-item.active');
        if (openItem) {
            const faqItems = document.querySelectorAll('.faq-item');
            return Array.from(faqItems).indexOf(openItem);
        }
        return -1;
    }
}

// Global function for backward compatibility with onclick attributes
function toggleFAQ(button) {
    if (!window.faqHandler) {
        window.faqHandler = new FAQHandler();
    }
    window.faqHandler.toggleFAQ(button);
}

// Initialize FAQ handler when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.faqHandler = new FAQHandler();
    });
} else {
    window.faqHandler = new FAQHandler();
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FAQHandler;
} 