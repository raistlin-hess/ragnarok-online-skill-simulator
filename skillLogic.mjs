import {HTML_ELS} from './common.mjs';

//TODO: How is this determined? And how is it different than sumFixedCastModifiers?
const MAX_FIX_CAST_REDUCTION = 0;

export function calculateCastTimeSeconds(skill, skillLevel, playerStats) {
  const baseFixedCastTime = getFixedCastTime(skill, skillLevel);
  const sumFixedCastModifiers = getFixedCastModifiers();

  const baseVarCastTime = getVarCastTime(skill, skillLevel);
  const sumGearVarCastModifiers = getVarCastModifiersFromGear();
  const sumVarCastModifiersFromSkills = getVarCastModifiersFromSkills();
  const sumVarCastModifiers = getDirectVarCastModifiers();

  let totalFct = /* (baseFixedCastTime - sumFixedCastModifiers) * */ (1 - MAX_FIX_CAST_REDUCTION / 100);
  let totalVct = /* (baseVarCastTime - sumVarCastModifiers) * */ (1 - Math.sqrt((playerStats.dex * 2 + playerStats.int) / 530)) * (1 - sumGearVarCastModifiers / 100) * (1 - sumVarCastModifiersFromSkills / 100);

  //Update calculations directly as seconds, or as percentage
  const isModifierInSeconds = HTML_ELS.freeformRadioSeconds.checked;
  if (isModifierInSeconds) {
    totalFct *= baseFixedCastTime - sumFixedCastModifiers;
    totalVct *= baseVarCastTime - sumVarCastModifiers;
  } else {
    totalFct = totalFct * baseFixedCastTime * (1 - sumFixedCastModifiers);
    totalVct = totalVct * baseVarCastTime * (1 - sumVarCastModifiers);
  }

  //Limit floor to 0
  totalFct = Math.max(0, totalFct);
  totalVct = Math.max(0, totalVct);

  return {
    fixed: totalFct,
    variable: totalVct,
    total: totalFct + totalVct,
  };
}

function getVarCastTime(skill, skillLevel) {
  return getCastTimeByProperty('CastTime', skill, skillLevel);
}

function getFixedCastTime(skill, skillLevel) {
  return getCastTimeByProperty('FixedCastTime', skill, skillLevel);
}

function getCastTimeByProperty(propertyName, skill, skillLevel) {
  let castTimeMs = 0;
  if (typeof skill[propertyName] == 'number') {
    castTimeMs = skill[propertyName] ?? 0;
  } else {
    castTimeMs = skill[propertyName]?.find(ct => ct.Level == skillLevel)?.Time ?? 0;
  }

  return castTimeMs / 1000;
}


function getDirectVarCastModifiers() {
  return Number(HTML_ELS.freeformInputVct.value) || 0;
}

function getFixedCastModifiers() {
  return Number(HTML_ELS.freeformInputFct.value) || 0;
}

function getVarCastModifiersFromGear() {
  //TODO: Implement
  return 0;
}

function getVarCastModifiersFromSkills() {
  //TODO: Implement
  return 0;
}
