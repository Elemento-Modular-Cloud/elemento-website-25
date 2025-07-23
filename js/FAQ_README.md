# Unified FAQ System

This document explains how to use the unified FAQ system across all Elemento website pages.

## Overview

The FAQ system has been unified into a single JavaScript file (`js/faq.js`) that provides consistent accordion functionality across all pages. The system includes:

- Smooth animations and transitions
- Accordion behavior (only one FAQ open at a time)
- Arrow rotation animations
- Backward compatibility with existing `onclick` attributes
- Programmatic control methods

## Features

### Automatic Initialization
The FAQ system automatically initializes when the page loads and finds FAQ elements.

### Accordion Behavior
Only one FAQ item can be open at a time. Opening a new item automatically closes the previously open item.

### Smooth Animations
- Height transitions using `maxHeight`
- Opacity and transform transitions (handled by CSS)
- Arrow rotation animations

## HTML Structure

To use the FAQ system, your HTML should follow this structure:

```html
<div class="faq-container">
    <div class="faq-item">
        <button class="faq-question" onclick="toggleFAQ(this)">
            <span>Your Question Here</span>
            <span class="faq-arrow">▼</span>
        </button>
        <div class="faq-answer">
            <p>Your answer content here.</p>
        </div>
    </div>
</div>
```

## JavaScript API

### Global Function
```javascript
// Toggle a specific FAQ item
toggleFAQ(buttonElement)
```

### Class Methods
```javascript
// Get the FAQ handler instance
const faqHandler = window.faqHandler;

// Open a specific FAQ by index
faqHandler.openFAQ(0); // Opens the first FAQ

// Close all FAQs
faqHandler.closeAllFAQs();

// Get the currently open FAQ index
const openIndex = faqHandler.getOpenFAQ();
```

## CSS Requirements

The FAQ system requires these CSS classes to be defined:

- `.faq-container` - Container for all FAQ items
- `.faq-item` - Individual FAQ item container
- `.faq-question` - The clickable question button
- `.faq-answer` - The answer content container
- `.faq-arrow` - The arrow indicator element

The system also uses these CSS states:
- `.faq-item.active` - Active FAQ item
- `.faq-answer.active` - Active answer content

## Implementation Details

### Backward Compatibility
The system maintains backward compatibility with existing `onclick="toggleFAQ(this)"` attributes while also providing modern event listener functionality.

### Event Handling
The system automatically removes `onclick` attributes and replaces them with proper event listeners for better performance and maintainability.

### Error Handling
The system includes error handling for missing elements and gracefully handles edge cases.

## Usage Examples

### Basic Usage
Simply include the script and use the standard HTML structure:

```html
<script src="js/faq.js"></script>
```

### Programmatic Control
```javascript
// Open the third FAQ
window.faqHandler.openFAQ(2);

// Close all FAQs
window.faqHandler.closeAllFAQs();

// Check if any FAQ is open
const isOpen = window.faqHandler.getOpenFAQ() !== -1;
```

## Browser Support

The FAQ system supports all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

The system is optimized for performance:
- Uses event delegation where possible
- Minimal DOM queries
- Efficient CSS transitions
- Debounced resize handling

## Troubleshooting

### FAQ not working
1. Check that `js/faq.js` is included in your HTML
2. Verify the HTML structure matches the required format
3. Check browser console for JavaScript errors
4. Ensure CSS classes are properly defined

### Animations not smooth
1. Check that CSS transitions are defined
2. Verify `max-height` values are appropriate
3. Ensure no conflicting CSS is overriding transitions

### Multiple FAQs open
1. Check that the accordion behavior is working
2. Verify that only one `.faq-item` has the `.active` class
3. Check for JavaScript errors in console 