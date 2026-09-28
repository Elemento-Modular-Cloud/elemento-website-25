/**
 * Team + Hall of Fame renderer.
 *
 * CMS/team.json entries:
 * - Active team: omit hallOfFame (or set false)
 * - Hall of Fame: set "hallOfFame": true and tenure years "from" / "to"
 *   Example:
 *   { "id": "...", "hallOfFame": true, "from": "2022", "to": "2025", ... }
 */

function cmsUrl(path) {
  if (window.ElementoI18n?.assetUrl) {
    return window.ElementoI18n.assetUrl(path);
  }
  const base = window.ElementoI18n ? window.ElementoI18n.getCmsBasePath() : '';
  return `${base}${path}`;
}

function resolveMember(member) {
  const locale = window.ElementoI18n ? window.ElementoI18n.getPageLocale() : 'en';
  return window.ElementoI18n ? window.ElementoI18n.resolveCmsEntry(member, locale) : member;
}

function getLocale() {
  return window.ElementoI18n ? window.ElementoI18n.getPageLocale() : 'en';
}

const HOF_COPY = {
  en: {
    former: (role, from, to) => `Former ${role} from ${from} to ${to}`,
    formerNoYears: (role) => `Former ${role}`,
  },
  it: {
    former: (role, from, to) => `Ex ${role} dal ${from} al ${to}`,
    formerNoYears: (role) => `Ex ${role}`,
  },
  fr: {
    former: (role, from, to) => `Anciennement ${role}, de ${from} à ${to}`,
    formerNoYears: (role) => `Anciennement ${role}`,
  },
};

function formatHofTenure(member) {
  const locale = getLocale();
  const copy = HOF_COPY[locale] || HOF_COPY.en;
  const role = member.role || '';
  const from = member.from;
  const to = member.to;

  if (from && to) return copy.former(role, from, to);
  return copy.formerNoYears(role);
}

function photoUrls(member) {
  const photo = member.photo || 'assets/img/team/placeholder.png';
  const photoSrc = window.ElementoI18n?.assetUrl
    ? window.ElementoI18n.assetUrl(photo)
    : cmsUrl(photo);
  const placeholder = window.ElementoI18n?.assetUrl
    ? window.ElementoI18n.assetUrl('assets/img/team/placeholder.png')
    : cmsUrl('assets/img/team/placeholder.png');
  return { photoSrc, placeholder };
}

function renderLinks(member) {
  return `
    <div class="team-links">
      ${(member.links || [])
        .map(
          (link) =>
            `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn btn-link">${link.type}</a>`
        )
        .join('')}
    </div>
  `;
}

function renderTeamCard(raw) {
  const member = resolveMember(raw);
  const divisionClass = member.division ? `division-${member.division}` : 'division-default';
  const { photoSrc, placeholder } = photoUrls(member);

  return `
    <div class="team-member ${divisionClass}">
      <div class="team-photo-container">
        <div class="team-member-glow ${divisionClass}-glow"></div>
        <img src="${photoSrc}" alt="${member.name}" class="team-photo" onerror="this.src='${placeholder}'" />
      </div>
      <h4>${member.name}</h4>
      <p class="team-role">${member.role}</p>
      ${member.highlight ? `<p class="team-highlight"><em>${member.highlight}</em></p>` : ''}
      <p class="team-bio">${member.bio}</p>
      ${renderLinks(member)}
    </div>
  `;
}

function renderHofCard(raw) {
  const member = resolveMember(raw);
  const divisionClass = member.division ? `division-${member.division}` : 'division-default';
  const { photoSrc, placeholder } = photoUrls(member);
  const tenure = formatHofTenure(member);

  return `
    <div class="team-member hof-member ${divisionClass}">
      <div class="team-photo-container">
        <div class="team-member-glow ${divisionClass}-glow"></div>
        <img src="${photoSrc}" alt="${member.name}" class="team-photo" onerror="this.src='${placeholder}'" />
      </div>
      <h4>${member.name}</h4>
      <p class="team-role hof-tenure">${tenure}</p>
      ${renderLinks(member)}
    </div>
  `;
}

function revealFadeIns(container) {
  const members = container.querySelectorAll('.team-member');
  members.forEach((member, index) => {
    member.classList.add('fade-in');
    setTimeout(() => member.classList.add('visible'), index * 150);
  });
}

function loadTeam() {
  fetch(cmsUrl('CMS/team.json'))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((team) => {
      const grid = document.getElementById('team-grid');
      const hofGrid = document.getElementById('hof-grid');
      const hofSection = document.getElementById('hall-of-fame');

      const active = [];
      const alumni = [];

      for (const member of team) {
        if (member.hallOfFame) alumni.push(member);
        else active.push(member);
      }

      if (grid) {
        grid.innerHTML = active.map(renderTeamCard).join('');
        revealFadeIns(grid);
      }

      if (hofGrid && hofSection) {
        if (alumni.length === 0) {
          hofSection.hidden = true;
          hofGrid.innerHTML = '';
        } else {
          hofSection.hidden = false;
          hofGrid.innerHTML = alumni.map(renderHofCard).join('');
          revealFadeIns(hofGrid);
        }
      }
    })
    .catch((error) => {
      console.error('Error loading team data:', error);
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTeam);
} else {
  loadTeam();
}
