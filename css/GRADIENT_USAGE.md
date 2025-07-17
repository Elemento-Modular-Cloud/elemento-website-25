# Gradient System Usage Guide

## Overview
The large `gradient-blobs.css` file (1614 lines) has been split into smaller, page-specific files for better performance and maintainability.

## File Structure
- `gradient-blobs-base.css` (386 lines) - Shared animations and base classes
- `gradients-home.css` (71 lines) - Home page specific gradients
- `gradients-products.css` (74 lines) - Products page specific gradients
- `gradients-about.css` (71 lines) - About page specific gradients
- `gradients-technology.css` (72 lines) - Technology page specific gradients
- `gradients-atomos.css` (74 lines) - Atomos page specific gradients
- `gradients-cloud-network.css` (75 lines) - Cloud Network page specific gradients
- `gradients-electros.css` (82 lines) - Electros page specific gradients
- `gradients-contact.css` (71 lines) - Contact page specific gradients
- `gradients-blog.css` (72 lines) - Blog page specific gradients
- `gradients-editor.css` (72 lines) - Editor page specific gradients

## Performance Benefits
- **Before:** ~1614 lines loaded on every page
- **After:** ~386 base lines + ~72 page-specific lines = ~458 lines per page
- **Reduction:** ~71% smaller CSS bundle per page
- **Removed:** 400+ lines of unused hero-black-mask classes

## How to Use

### Option 1: Manual Import (Current Setup)
In `css/style.css`, uncomment the specific gradient file needed for each page:

```css
/* Import gradient blobs base (shared animations and classes) */
@import url('./gradient-blobs-base.css');

/* Import page-specific gradients - uncomment the one needed for each page */
@import url('./gradients-home.css');        /* For index.html */
/* @import url('./gradients-products.css'); */  /* For products.html */
/* @import url('./gradients-about.css'); */     /* For about.html */
/* @import url('./gradients-technology.css'); */ /* For technology.html */
/* @import url('./gradients-atomos.css'); */    /* For atomos.html */
/* @import url('./gradients-cloud-network.css'); */ /* For cloud-network.html */
/* @import url('./gradients-electros.css'); */  /* For electros.html */
/* @import url('./gradients-contact.css'); */   /* For contact.html */
/* @import url('./gradients-blog.css'); */      /* For blog.html */
/* @import url('./gradients-editor.css'); */    /* For editor.html */
```

### Option 2: Dynamic Import (Recommended)
Create individual CSS files for each page that import both base and page-specific gradients:

1. Create `css/home.css`:
```css
@import url('./gradient-blobs-base.css');
@import url('./gradients-home.css');
```

2. Create `css/products.css`:
```css
@import url('./gradient-blobs-base.css');
@import url('./gradients-products.css');
```

3. In HTML, link to the specific CSS file:
```html
<link rel="stylesheet" href="css/home.css"> <!-- For index.html -->
<link rel="stylesheet" href="css/products.css"> <!-- For products.html -->
```

## Classes Included in Each File

### Base File (`gradient-blobs-base.css`)
- All shared `@keyframes` animations
- Base gradient system classes (`.hero-blur`, `.hero-spinning-gradient`, etc.)
- Responsive adjustments
- Reduced motion preferences

### Page-Specific Files
Each page file contains:
- `.gradient-[page]` - Main conic gradient
- `.radial-[page]` - Radial gradient variant  
- `.linear-[page]` - Linear gradient variant
- `.polygon-[page]-1` and `.polygon-[page]-2` - Polygon masks with animations
- `.ro-[page]-1` and `.ro-[page]-2` - Rectangle overlay patterns

## Example Usage
For the home page, these classes are available:
- `.gradient-home`
- `.radial-home` 
- `.linear-home`
- `.polygon-home-1`, `.polygon-home-2`
- `.ro-home-1`, `.ro-home-2`

## Maintenance
When adding new pages:
1. Create a new `gradients-[pagename].css` file
2. Copy the structure from an existing page file
3. Update the gradient colors and animations as needed
4. Add the import to your chosen loading strategy 