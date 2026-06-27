#!/usr/bin/env node
/**
 * Deduplicate and normalize favicon head blocks.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function faviconBlock(prefix, indent = '    ') {
  const p = prefix;
  const i = indent;
  return `${i}<!-- Favicon -->
${i}<link rel="icon" type="image/svg+xml" href="${p}assets/favicon/favicon.svg">
${i}<link rel="icon" type="image/png" sizes="96x96" href="${p}assets/favicon/favicon-96x96.png">
${i}<link rel="icon" type="image/png" sizes="32x32" href="${p}assets/favicon/favicon-32x32.png">
${i}<link rel="icon" type="image/png" sizes="16x16" href="${p}assets/favicon/favicon-16x16.png">
${i}<link rel="icon" type="image/x-icon" href="/favicon.ico">

${i}<!-- Apple Touch Icons -->
${i}<link rel="apple-touch-icon" sizes="180x180" href="${p}assets/favicon/apple-touch-icon.png">
${i}<meta name="apple-mobile-web-app-title" content="Elemento">

${i}<!-- Microsoft Tiles -->
${i}<meta name="msapplication-TileColor" content="#0e1119">
${i}<meta name="msapplication-config" content="${p}assets/favicon/browserconfig.xml">

${i}<!-- Safari Pinned Tab -->
${i}<link rel="mask-icon" href="${p}assets/favicon/safari-pinned-tab.svg" color="#ffa600">

${i}<!-- Web App Manifest -->
${i}<link rel="manifest" href="${p}assets/favicon/site.webmanifest">`;
}

const faviconSectionRe =
  /[ \t]*(?:<!-- Favicon -->[ \t]*\n)+[\s\S]*?<link rel="manifest" href="(?:\.\.\/|\.\.\/\.\.\/)?assets\/favicon\/site\.webmanifest">(?:[ \t]*\n[\s\S]*?<link rel="manifest" href="(?:\.\.\/|\.\.\/\.\.\/)?assets\/favicon\/site\.webmanifest">)*/;

const singleQuoteIconRe =
  /[ \t]*<link rel='icon' type='image\/svg\+xml' href='(\.\.\/|\.\.\/\.\.\/)assets\/favicon\/favicon\.svg'>/;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function detectPrefix(section) {
  if (section.includes('href="../../assets/favicon/')) return '../../';
  if (section.includes('href="../assets/favicon/')) return '../';
  return '';
}

function detectIndent(section) {
  const m = section.match(/^([ \t]*)<!-- Favicon -->/m) || section.match(/^([ \t]*)<link rel=/m);
  return m ? m[1] : '    ';
}

let updated = 0;

for (const file of walk(root)) {
  if (file.includes(`${path.sep}src${path.sep}`)) continue;
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  if (faviconSectionRe.test(content)) {
    content = content.replace(faviconSectionRe, (match) => {
      const prefix = detectPrefix(match);
      const indent = detectIndent(match);
      return faviconBlock(prefix, indent);
    });
  } else if (singleQuoteIconRe.test(content)) {
    const m = content.match(singleQuoteIconRe);
    const prefix = m[1];
    const indent = m[0].match(/^([ \t]*)/)[1];
    content = content.replace(singleQuoteIconRe, faviconBlock(prefix, indent));
  } else if (/[ \t]*<link rel="icon" type="image\/svg\+xml" href="assets\/favicon\/favicon\.svg">/.test(content) && !content.includes('favicon-96x96')) {
    content = content.replace(
      /[ \t]*<link rel="icon" type="image\/svg\+xml" href="assets\/favicon\/favicon\.svg">/,
      faviconBlock('', '    ')
    );
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    updated += 1;
    console.log(path.relative(root, file));
  }
}

console.log(`Fixed ${updated} HTML files.`);
