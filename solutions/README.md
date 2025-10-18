# Solutions Landing Pages

This directory contains persona-specific landing pages built with a modular component architecture.

## Directory Structure

```
/solutions/
  ├── components/          # Reusable HTML components
  ├── *.html              # Individual landing pages
  ├── index.html          # Solutions hub (coming soon)
  └── README.md           # This file
```

## How to Create a New Landing Page

### 1. Copy the Template

Start with an existing landing page (e.g., `devops-cicd.html`) as your template.

### 2. Update Meta Tags

Change the `<title>`, `<meta name="description">`, canonical URL, and Open Graph tags to match your persona.

### 3. Configure Page Content

Modify the `pageConfig` object in the `<script>` tag at the bottom of the page. This object defines all content for your landing page.

### 4. Available Components

Your landing page can use these components:

- `hero-home.html` - Standard home hero section with "Ready. Set. Cloud." tagline
- `hero-technical.html` - Hero section for technical personas
- `hero-industry.html` - Hero section for industry personas
- `hero-business.html` - Hero section for business scenarios
- `pain-points.html` - Pain points section with grid layout
- `solution-overview.html` - Solution overview with product cards
- `features-grid.html` - Features grid with icons
- `use-case-walkthrough.html` - Step-by-step use case
- `technical-specs.html` - Technical specifications
- `stats-metrics.html` - Statistics and metrics
- `comparison-table.html` - Comparison table
- `product-combo.html` - Product combination section
- `code-example.html` - Code snippet example
- `faq-section.html` - FAQ accordion
- `cta-final.html` - Final call-to-action section

### 5. Component Usage

To use a component, add a div with `data-component` attribute:

```html
<div id="hero-section" data-component="hero-technical"></div>
<div id="pain-points" data-component="pain-points"></div>
```

### 6. Content Configuration

Configure content in the `pageConfig` object:

```javascript
const pageConfig = {
    persona: 'your-persona',
    category: 'technical|industry|business',
    products: ['atomos', 'electros', 'atomosphere'],
    content: {
        hero: {
            tagline: 'Your Tagline',
            title: 'Your Page Title',
            subtitle: 'Your subtitle description',
            primaryCTA: {
                text: 'Primary Button',
                link: '/signup.html',
                icon: 'fas fa-icon'
            },
            secondaryCTA: {
                text: 'Secondary Button',
                link: '/docs',
                icon: 'fas fa-icon'
            }
        },
        'pain-points': {
            title: 'Section Title',
            subtitle: 'Section subtitle',
            item: [
                {
                    icon: 'fas fa-icon',
                    title: 'Pain Point Title',
                    description: 'Description text'
                }
                // ... more items
            ]
        }
        // ... more sections
    }
};
```

### 7. Template Variables

Components support these variable patterns:

- Simple variables: `{{title}}`, `{{description}}`
- Nested objects: `{{primaryCTA.text}}`, `{{primaryCTA.link}}`
- Arrays: Use `<!-- repeat:item -->` and `<!-- endrepeat:item -->`

## Component System

The component loader (`/js/landing-page-loader.js`) automatically:

1. Loads HTML components from `/solutions/components/`
2. Injects persona-specific content into templates
3. Handles array rendering for lists and grids
4. Initializes interactive elements (FAQ accordions, animations)

## Best Practices

### Content Guidelines

- **Headlines**: Clear, benefit-driven, persona-specific
- **Descriptions**: Concrete, actionable, avoid jargon
- **CTAs**: Action-oriented verbs ("Try", "Deploy", "Start")
- **Pain Points**: Real problems your persona faces daily
- **Features**: Benefits over features, outcomes over specs

### SEO Optimization

- Unique title tag (50-60 characters)
- Meta description (150-160 characters)
- Structured data (Schema.org)
- Semantic HTML5 elements
- Alt text for images
- Internal linking to product pages

### Performance

- Lazy-load images
- Minimize custom CSS
- Reuse existing components
- Keep pageConfig objects reasonable size

## Planned Landing Pages

### Technical Roles (6)
- [x] DevOps Engineers - `/solutions/devops-cicd.html`
- [ ] Platform Engineers - `/solutions/platform-engineering.html`
- [ ] Cloud Architects - `/solutions/cloud-architects.html`
- [ ] Database Administrators - `/solutions/database-administrators.html`
- [ ] Security Engineers - `/solutions/security-engineers.html`
- [ ] SRE - `/solutions/sre-reliability.html`

### Industries (7)
- [ ] Healthcare - `/solutions/healthcare-hipaa.html`
- [ ] Financial Services - `/solutions/financial-services.html`
- [ ] Manufacturing - `/solutions/manufacturing-edge.html`
- [ ] Media & Entertainment - `/solutions/media-rendering.html`
- [ ] Research & Academia - `/solutions/research-hpc.html`
- [ ] E-commerce - `/solutions/ecommerce-scalability.html`
- [ ] Gaming - `/solutions/gaming-servers.html`

### Business Scenarios (7)
- [ ] Startups - `/solutions/startups-cloudnative.html`
- [ ] Enterprise Migration - `/solutions/enterprise-migration.html`
- [ ] MSPs & Hosting - `/solutions/msp-hosting.html`
- [ ] FinOps - `/solutions/finops-cost-optimization.html`
- [ ] Data Sovereignty - `/solutions/data-sovereignty.html`
- [ ] Disaster Recovery - `/solutions/disaster-recovery.html`
- [ ] AI/ML - `/solutions/ai-ml-gpu.html`

## Maintenance

### Updating All Pages

To update a common element across all landing pages:

1. Edit the component file in `/solutions/components/`
2. Changes automatically apply to all pages using that component
3. No need to edit individual HTML files

### Testing

1. Open landing page in browser
2. Check that all components load correctly
3. Verify FAQ accordions work
4. Test responsive design
5. Validate forms and CTAs

## Support

For questions or issues with the landing page system, contact the development team or refer to the main project documentation.

