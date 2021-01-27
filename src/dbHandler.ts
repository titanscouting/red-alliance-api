/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/order */
/**
 * @module dbHandler
 */
export { default as addKey } from './db-handlers/addKey';
export { default as addUserToTeam } from './db-handlers/addUserToTeam';
export { default as getUserTeam } from './db-handlers/getUserTeam';
export { default as checkKey } from './db-handlers/checkKey';
export { default as submitMatchData } from './db-handlers/submitMatchData';
export { default as fetchMatchesForCompetition } from './db-handlers/fetchMatchesForCompetition';
export { default as fetchAllTeamNicknamesAtCompetition } from './db-handlers/fetchAllTeamNicknamesAtCompetition';
export { default as findTeamNickname } from './db-handlers/findTeamNickname';
export { default as fetchMatchData } from './db-handlers/fetchMatchData';
export { default as fetchCompetitionSchedule } from './db-handlers/fetchCompetitionSchedule';
export { default as fetch2022Schedule } from './db-handlers/fetch2022Schedule';
export { default as fetchScouterUIDs } from './db-handlers/fetchScouterUIDs';
export { default as fetchScouterSuggestions } from './db-handlers/fetchScouterSuggestions';
export { default as addScouterToMatch } from './db-handlers/addScouterToMatch';
export { default as removeScouterFromMatch } from './db-handlers/removeScouterFromMatch';
export { default as submitStrategy } from './db-handlers/submitStrategy';
export { default as fetchStrategy } from './db-handlers/fetchStrategy';
export { default as fetchUserStrategy } from './db-handlers/fetchUserStrategy';
export { default as fetchPitData } from './db-handlers/fetchPitData';
export { default as submitPitData } from './db-handlers/submitPitData';
export { default as fetchPitConfig } from './db-handlers/fetchPitConfig';
export { default as fetchMatchConfig } from './db-handlers/fetchMatchConfig';
export { default as fetchMetricsData } from './db-handlers/fetchMatchConfig';
export { default as fetchAnalysisFlags } from './db-handlers/fetchAnalysisFlags';
export { default as fetchAllTeamMatchData } from './db-handlers/fetchAllTeamMatchData';
export { default as fetchAllTeamPitData } from './db-handlers/fetchAllTeamPitData';
export { default as fetchPitVariableData } from './db-handlers/fetchPitVariableData';