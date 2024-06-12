const MAX_FIX_CAST_REDUCTION = 0;

export function calculateCastTimeSeconds(skill, skillLevel, playerStats) {
  const baseFixedCastTime = getFixedCastTime(skill, skillLevel);
  const sumFixedCastModifiers = getFixedCastModifiers();

  const baseVarCastTime = getVarCastTime(skill, skillLevel);
  const sumGearVarCastModifiers = getVarCastModifiersFromGear(); //TODO: Implement
  const sumVarCastModifiersFromSkills = getVarCastModifiersFromSkills(); //TODO: Implement
  const sumVarCastModifiers = 0; //TODO: Implement

  const VCT = (baseVarCastTime - sumVarCastModifiers) * (1 - Math.sqrt((playerStats.dex * 2 + playerStats.int) / 530)) * (1 - sumGearVarCastModifiers / 100) * (1 - sumVarCastModifiersFromSkills / 100);
  const FCT = (baseFixedCastTime - sumFixedCastModifiers) * (1 - MAX_FIX_CAST_REDUCTION / 100);

  return {
    variable: VCT,
    fixed: FCT,
    total: VCT + FCT,
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

function getFixedCastModifiers() {
  //TODO: Implement
  return 0;
}

function getVarCastModifiersFromGear() {
  //TODO: Implement
  return 0;
}

function getVarCastModifiersFromSkills() {
  //TODO: Implement
  return 0;
}
