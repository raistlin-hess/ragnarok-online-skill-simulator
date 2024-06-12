import {HTML_ELS} from './common.mjs';
import {getSkillById} from './datasources.mjs';
import {calculateCastTimeSeconds} from './skillLogic.mjs';


//Global ids for skill casting timers
let skillCastIntervalId;
let skillNameTimeoutId;

export function onChangeNumberInput(e) {
  let newValue = e.target.value;
  //Keep value under max
  if (!Number.isNaN(e.target.max)) {
    newValue = Math.min(e.target.max, e.target.value);
  }

  //Keep value over min
  if (!Number.isNaN(e.target.min)) {
    newValue = Math.max(e.target.min, e.target.value);
  }

  //Update value
  e.target.value = newValue;
}

export function createJobSkillOptGroup(skillsByJobEntry) {
  const [job, skills] = skillsByJobEntry;

  const skillEls = skills.map(createSkillOptionEl);

  const optGroupEl = document.createElement('optgroup');
  optGroupEl.label = job;
  optGroupEl.replaceChildren(...skillEls);

  return optGroupEl;
}

function createSkillOptionEl(skill) {
  if (!!skill.TargetType) {
    const optEl = document.createElement('option');
    optEl.setAttribute('value', skill.Id);
    optEl.text = skill.Description;
    return optEl;
  }
}

export function onSkillChange() {
  //Update max skill level, keeping current value within input bounds
  const selectedSkill = getSkillById(HTML_ELS.skillSelectEl.value);
  const selectedLevel = getSelectedSkillLevel();
  HTML_ELS.skillLevelEl.max = selectedSkill.MaxLevel;
  HTML_ELS.skillLevelEl.value = Math.min(HTML_ELS.skillLevelEl.max, selectedLevel); //Keep value under max
  HTML_ELS.skillLevelEl.value = Math.max(HTML_ELS.skillLevelEl.min, selectedLevel); //Keep value over min

  //Update skill icon
  HTML_ELS.skillIconEl.setAttribute('src', `assets/skillIcons/${selectedSkill.Name}.bmp`);
  HTML_ELS.skillIconEl.removeAttribute('hidden');

  //Update job gif
  const newSrc = `assets/jobs/${selectedSkill.Job}.png`;
  if (HTML_ELS.jobEl.getAttribute('src') != newSrc) {
    HTML_ELS.jobEl.setAttribute('src', newSrc);
  }

  updateFinalCastTime();
}

export function getSelectedSkillLevel() {
  return Number(HTML_ELS.skillLevelEl.value);
}

export function updateFinalCastTime() {
  //Update metadata textarea for parsing troubleshooting
  const selectedSkill = getSkillById(HTML_ELS.skillSelectEl.value);
  HTML_ELS.metadataEl.textContent = JSON.stringify(selectedSkill, null, 2);

  const playerStats = getPlayerStats();
  const castTimeSeconds = calculateCastTimeSeconds(selectedSkill, HTML_ELS.skillLevelEl.value, playerStats);
  const totalCastTimeSeconds = castTimeSeconds.total.toPrecision(4);

  HTML_ELS.finalCastEl.value = totalCastTimeSeconds;
  HTML_ELS.varCastEl.value = castTimeSeconds.variable.toPrecision(4);
  HTML_ELS.fixCastEl.value = castTimeSeconds.fixed.toPrecision(4);

  startCasting();
}

export function startCasting() {
  if (skillCastIntervalId) {
    stopCasting();
  }
  if (skillNameTimeoutId) {
    clearSkillName();
  }

  //Get final cast time from readonly element and update progress bar
  const totalCastTimeSeconds = Number(HTML_ELS.finalCastEl.value);
  const castTimeMs = totalCastTimeSeconds * 1000;
  HTML_ELS.skillProgressEl.value = 0;
  HTML_ELS.skillProgressEl.max = castTimeMs;
  HTML_ELS.skillProgressEl.classList.remove('hidden');

  //Create timer to update skill cast progress every so many ms
  let remainingCastTimeMs = castTimeMs;
  const skillUpdateDelayMs = 10;
  skillCastIntervalId = setInterval(() => {
    if (remainingCastTimeMs > 0) {
      HTML_ELS.skillProgressEl.value += skillUpdateDelayMs;
      remainingCastTimeMs -= skillUpdateDelayMs;
    } else {
      stopCasting();
    }
  }, skillUpdateDelayMs);

  //Set timeout to clear skill name cast
  const selectedSkill = getSkillById(HTML_ELS.skillSelectEl.value);
  HTML_ELS.skillNameEl.classList.remove('hidden');
  HTML_ELS.skillNameEl.textContent = `${selectedSkill.Description} !!`;
  skillNameTimeoutId = setTimeout(clearSkillName, castTimeMs + 3000);
}

function stopCasting() {
  clearInterval(skillCastIntervalId);
  HTML_ELS.skillProgressEl.classList.add('hidden');
}

function clearSkillName() {
  clearTimeout(skillNameTimeoutId);
  HTML_ELS.skillNameEl.classList.add('hidden');
}

function getPlayerStats() {
  return {
    int: Number(HTML_ELS.intEl.value),
    dex: Number(HTML_ELS.dexEl.value),
  };
}
