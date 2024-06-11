//Constants for element ids for querying
const EL_IDS = {
  SKILL_SELECT: 'skill-select',
  SKILL_META: 'skill-metadata',
  SKILL_LVL: 'skill-level',
  FINAL_CAST: 'final-cast-time',
  CAST_BTN: 'cast-button',
  STAT_INT: 'int',
  STAT_DEX: 'dex',
  VAR_CAST_TIME: 'var-cast-time',
  FIX_CAST_TIME: 'fixed-cast-time',
  SKILL_ICON: 'skill-icon',
  SKILL_PROGRESS: 'skill-progress',
  SKILL_NAME: 'skill-name',
  JOB_GIF: 'job-gif',
  ENABLE_FREEFORM_CHECKBOX: 'free-form-checkbox',
  FREEFORM_PANEL: 'freeform-modifiers',
};

export const HTML_ELS = {
  //Get reference to all elements that are interacted with
  skillSelectEl: document.getElementById(EL_IDS.SKILL_SELECT),
  skillLevelEl: document.getElementById(EL_IDS.SKILL_LVL),
  metadataEl: document.getElementById(EL_IDS.SKILL_META),
  castButtonEl: document.getElementById(EL_IDS.CAST_BTN),
  finalCastEl: document.getElementById(EL_IDS.FINAL_CAST),
  intEl: document.getElementById(EL_IDS.STAT_INT),
  dexEl: document.getElementById(EL_IDS.STAT_DEX),
  varCastEl: document.getElementById(EL_IDS.VAR_CAST_TIME),
  fixCastEl: document.getElementById(EL_IDS.FIX_CAST_TIME),
  skillIconEl: document.getElementById(EL_IDS.SKILL_ICON),
  skillProgressEl: document.getElementById(EL_IDS.SKILL_PROGRESS),
  skillNameEl: document.getElementById(EL_IDS.SKILL_NAME),
  jobEl: document.getElementById(EL_IDS.JOB_GIF),
  enableFreeFormEl: document.getElementById(EL_IDS.ENABLE_FREEFORM_CHECKBOX),
  freeformPanel: document.getElementById(EL_IDS.FREEFORM_PANEL),
};
