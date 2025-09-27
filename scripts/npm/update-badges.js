const fs = require('fs');
const path = require('path');

function countArrayInPugFile(filePath, arrayName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find the array assignment (e.g., "const upcomingTalks = [" or "var lemonSites = [")
    const arrayRegex = new RegExp(`(const|var)\\s+${arrayName}\\s*=\\s*\\[`, 'g');
    const match = arrayRegex.exec(content);
    
    if (!match) {
      console.log(`⚠️  Array '${arrayName}' not found in ${filePath}`);
      return 0;
    }
    
    // Find the start of the array
    const startIdx = content.indexOf('[', match.index);
    
    // Count brackets to find the matching closing bracket
    let depth = 0;
    let endIdx = -1;
    
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
    
    if (endIdx === -1) {
      console.log(`⚠️  Could not find closing bracket for '${arrayName}' in ${filePath}`);
      return 0;
    }
    
    // Extract array content
    const arrayContent = content.slice(startIdx + 1, endIdx);
    
    // Remove comments and empty lines
    const cleanContent = arrayContent
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('//-');
      })
      .join('\n');
    
    // Count objects by counting opening braces at the top level
    let objectCount = 0;
    let braceDepth = 0;
    let inString = false;
    let escapeNext = false;
    let stringChar = '';
    
    for (let i = 0; i < cleanContent.length; i++) {
      const char = cleanContent[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if ((char === '"' || char === "'" || char === '`') && !inString) {
        inString = true;
        stringChar = char;
        continue;
      }
      
      if (char === stringChar && inString) {
        inString = false;
        stringChar = '';
        continue;
      }
      
      if (inString) continue;
      
      if (char === '{') {
        if (braceDepth === 0) {
          objectCount++;
        }
        braceDepth++;
      } else if (char === '}') {
        braceDepth--;
      }
    }
    
    return objectCount;
    
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return 0;
  }
}

function updateReadmeBadges(upcomingCount, previousCount, sitesCount) {
  // Check for both README.md and readme.md (case sensitivity)
  let readmePath = path.join(__dirname, '../../README.md');
  if (!fs.existsSync(readmePath)) {
    readmePath = path.join(__dirname, '../../readme.md');
  }
  
  try {
    let content = fs.readFileSync(readmePath, 'utf8');
    
    // Create the new badges
    const sitesBadge = `[![Projects](https://img.shields.io/badge/Projects-${sitesCount}-black?style=for-the-badge)](https://github.com/AhoyLemon?tab=repositories)`;
    const upcomingBadge = `[![Upcoming Conferences](https://img.shields.io/badge/Upcoming%20Conferences-${upcomingCount}-black?style=for-the-badge)](https://ahoylemon.xyz/talks.html#upcoming)`;
    const previousBadge = `[![Previous Conferences](https://img.shields.io/badge/Previous%20Conferences-${previousCount}-black?style=for-the-badge)](https://ahoylemon.xyz/talks.html#previous)`;
    
    // Replace existing badges or add new ones
    let badgesUpdated = false;
    
    // Function to safely replace badges line by line
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Projects badge
      if (line.includes('Projects') && line.includes('shields.io/badge/Projects-')) {
        lines[i] = sitesBadge;
        badgesUpdated = true;
      }
      // Upcoming Conferences/Talks badge
      else if ((line.includes('Upcoming Conferences') || line.includes('Upcoming Talks')) && line.includes('shields.io/badge/Upcoming')) {
        lines[i] = upcomingBadge;
        badgesUpdated = true;
      }
      // Previous Conferences/Talks badge
      else if ((line.includes('Previous Conferences') || line.includes('Previous Talks')) && line.includes('shields.io/badge/Previous')) {
        lines[i] = previousBadge;
        badgesUpdated = true;
      }
    }
    
    if (badgesUpdated) {
      content = lines.join('\n');
    }
    
    // If badges don't exist, add them after the Activity badge
    if (!badgesUpdated) {
      const lines = content.split('\n');
      
      // Find the Activity badge line
      const activityBadgeIndex = lines.findIndex(line => 
        line.includes('commit-activity') && line.includes('Activity')
      );
      
      if (activityBadgeIndex !== -1) {
        // Insert the new badges after the Activity badge (Projects first, then Conferences)
        lines.splice(activityBadgeIndex + 1, 0, '', sitesBadge, upcomingBadge, previousBadge);
        content = lines.join('\n');
      } else {
        // Fallback: add after any existing shields.io badges
        let insertIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('[![') && lines[i].includes('shields.io')) {
            insertIndex = i + 1;
          } else if (insertIndex !== -1 && !lines[i].startsWith('[![') && lines[i].trim() !== '') {
            break;
          }
        }
        
        if (insertIndex !== -1) {
          lines.splice(insertIndex, 0, '', sitesBadge, upcomingBadge, previousBadge);
          content = lines.join('\n');
        }
      }
    }
    
    fs.writeFileSync(readmePath, content, 'utf8');
    console.log('✅ README badges updated successfully');
    
  } catch (error) {
    console.error('❌ Error updating README file:', error.message);
    process.exit(1);
  }
}

function main() {
  console.log('🔍 Counting arrays in Pug files...');
  
  // Count arrays
  const upcomingTalks = countArrayInPugFile(
    path.join(__dirname, '../../pug/partials/_talks.pug'),
    'upcomingTalks'
  );
  
  const previousTalks = countArrayInPugFile(
    path.join(__dirname, '../../pug/partials/_talks.pug'),
    'previousTalks'
  );
  
  const lemonSites = countArrayInPugFile(
    path.join(__dirname, '../../pug/partials/_sites.pug'),
    'lemonSites'
  );
  
  console.log(`📊 Counts found:`);
  console.log(`   Upcoming Talks: ${upcomingTalks}`);
  console.log(`   Previous Talks: ${previousTalks}`);
  console.log(`   Lemon Sites: ${lemonSites}`);
  
  // Update README badges
  updateReadmeBadges(upcomingTalks, previousTalks, lemonSites);
  
  console.log('🎉 Badge update complete!');
}

if (require.main === module) {
  main();
}

module.exports = { countArrayInPugFile, updateReadmeBadges };