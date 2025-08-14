console.log('🚀 Starting team data fetch...');

fetch('CMS/team.json')
  .then(response => {
    console.log('📡 Response received:', response.status, response.statusText);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(team => {
    console.log('📊 Team data parsed:', team);
    console.log('👥 Number of team members:', team.length);
    
    const grid = document.getElementById('team-grid');
    console.log('🎯 Grid element found:', !!grid);
    
    if (!grid) {
      console.error('❌ Could not find team-grid element!');
      return;
    }
    
    const html = team.map(member => {
      console.log(`👤 Processing member: ${member.name} (${member.role}) - Division: ${member.division}`);
      
      // Determine division class for blur effect
      const divisionClass = member.division ? `division-${member.division}` : 'division-default';
      
      return `
        <div class="team-member ${divisionClass}">
          <div class="team-photo-container">
            <!-- Division-specific glow background -->
            <div class="team-member-glow ${divisionClass}-glow">
            </div>
            <img src="${member.photo || 'assets/img/team/placeholder.png'}" alt="${member.name}" class="team-photo" onerror="this.src='assets/img/team/placeholder.png'" />
          </div>
          <h4>${member.name}</h4>
          <p class="team-role">${member.role}</p>
          ${member.highlight ? `<p class="team-highlight"><em>${member.highlight}</em></p>` : ''}
          <p class="team-bio">${member.bio}</p>
          <div class="team-links">
            ${member.links.map(link => `
              <a href="${link.url}" target="_blank" class="btn btn-link">${link.type}</a>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
    
    console.log('🏗️ Generated HTML length:', html.length);
    grid.innerHTML = html;
    
    // Trigger fade-in animations for the newly created team members
    const teamMembers = grid.querySelectorAll('.team-member.fade-in');
    teamMembers.forEach((member, index) => {
      setTimeout(() => {
        member.classList.add('visible');
      }, index * 150); // Staggered animation delay
    });
    
    console.log('✅ Team grid populated successfully!');
  })
  .catch(error => {
    console.error('❌ Error loading team data:', error);
    console.error('📍 Error details:', {
      message: error.message,
      stack: error.stack
    });
  });