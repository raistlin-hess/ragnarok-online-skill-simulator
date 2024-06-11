import {parse} from 'yaml';

async function getSkillDb() {
  //Fetch official Renewal Skill DB from the rAthena Github repo
  const response = await fetch('https://raw.githubusercontent.com/rathena/rathena/master/db/re/skill_db.yml');
  const rawYaml = await response.text();
  return parse(rawYaml).Body;
}


//Download job tree to augment skill db
let treeDb = await fetch('https://raw.githubusercontent.com/rathena/rathena/master/db/re/skill_tree.yml');
treeDb = await treeDb.text();
treeDb = parse(treeDb).Body;


//Filter skill db to user-castable skills, those with a non-zero casttime, and add a job to each from the skill tree
export const castableSkills = (await getSkillDb())
  .filter(humanCastableSkill)
  .map(addJobToSkills)
  .filter(s => s.Job);


function humanCastableSkill(skill) {
  return skill.CastTime && (
    !skill.TargetType           //Default is "Passive"
    || !skill?.Flags?.IsNpc     //Monster skills
    || !skill?.Flags?.IsGuild   //Guild Skills
  );
}

function addJobToSkills(skill) {
  const tree = treeDb.find(t => t.Tree?.find(tt => tt.Name == skill.Name));
  skill.Job = tree?.Job?.replace('_', ' ');
  return skill;
}

export function getSkillById(skillId) {
  return castableSkills.find(s => s.Id == Number(skillId));
}
