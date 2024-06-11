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

const TYPE = {
  SKILL: 'skill',
  ENCHANT: 'enchantment',
};
const SCALE = {
  PCT: 'percentage',
  SEC: 'seconds',
};
// Source from: https://irowiki.org/wiki/Skills#Cast_Time
const modifiers = {
  '16th Night': {
    type: TYPE.SKILL,
    restriction: {
      job: 'ninja'
    },
    variableModifier: {
      scale: SCALE.PCT,
      value: -100,
    },
    fixedModifer: {
      scale: SCALE.PCT,
      value: -100, //ex fixed cast - 100%
    },
  },
  //Automatic Modification Orb (Fixed Cast Time) //TODO: Implement if necessary. Didn't immediately understand
  'Call Ventus': {
    type: TYPE.SKILL,
    restriction: {
      job: 'sorcerer',
    },
    fixedModifier: {
      scale: SCALE.SEC,
      value: -1,
    },
  },
  //Fixed Casting Decrease //TODO: Are costume enchantments common?
  //TODO: Find way to repeat this 10 times OR add another inputEl with formula
  'Hit Barrel [1 coin]': { //Also called Heat Barrel
    type: TYPE.SKILL,
    restriction: {
      job: 'rebel',
    },
    fixedModifer: {
      scale: SCALE.PCT,
      value: 5,
    },
  },
  'Hit Barrel [10 coins]': { //Also called Heat Barrel
    type: TYPE.SKILL,
    restriction: {
      job: 'rebel',
    },
    fixedModifer: {
      scale: SCALE.PCT,
      value: 50,
    },
  },
  'Magic Enchant': {
    type: TYPE.ENCHANT,
    fixtedModifier: {
      scale: SCALE.PCT,
      value: 1,
    },
  }
};
