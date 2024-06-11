import {HTML_ELS} from './common.mjs';
import {CURSOR_CONFIGS, startAnimation, stopAnimation} from './cursor.mjs';
import {castableSkills} from './datasources.mjs';
import {createJobSkillOptGroup, onChangeNumberInput, onSkillChange, startCasting, updateFinalCastTime} from './dom.mjs';

//Setup cursor animation when mouse enters document, and stop when it leaves
document.addEventListener('pointerenter', () => startAnimation(CURSOR_CONFIGS.DEFAULT));
document.addEventListener('pointerleave', stopAnimation);

//Add event handlers to all elements that should cause cast time to be re-calculated
HTML_ELS.skillSelectEl.addEventListener('change', onSkillChange);
HTML_ELS.castButtonEl.addEventListener('click', startCasting);
[HTML_ELS.intEl, HTML_ELS.dexEl, HTML_ELS.skillLevelEl]
  .forEach(el => el.addEventListener('change', updateFinalCastTime));

//Number input validation handlers
document.querySelectorAll('input[type=number]')
  .forEach(el => el.addEventListener('change', onChangeNumberInput));

//Populate skill dropdown with DB info
const skillsByJob = Object.groupBy(castableSkills, skill => skill.Job);
const finalSkillOptionEls = Object.entries(skillsByJob)
  .map(createJobSkillOptGroup);
HTML_ELS.skillSelectEl.replaceChildren(...finalSkillOptionEls);

//Now that options exist, trigger calculation update
onSkillChange();
