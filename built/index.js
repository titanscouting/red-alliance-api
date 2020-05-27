"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_mongo_db_1 = __importDefault(require("express-mongo-db"));
var uuid_apikey_1 = __importDefault(require("uuid-apikey"));
var dbHandler = require("./dbHandler");
var auth = require("./authHandler");
var port = process.env.PORT || 8190;
var app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
var options = {
    keepAlive: 1, connectTimeoutMS: 30000,
};
// Make sure to set the connection string as an environment variable
// e.g export REDALLIANCEDBKEY='fjsldjfksldfjaklfjsdalkfd'
try {
    app.use(express_mongo_db_1.default(process.env.REDALLIANCEDBKEY, options));
}
catch (e) {
    console.log('Could not connect to the MongoDB instance');
}
/**
 * NOTE TO DEVELOPERS: the `auth.checkAuth` statement is simply middleware which contacts
 * authHandler.js to ensure that the user has a valid authentication token.
 * Within the documentation, the token input for each authenticated route
 * (routes which require authentication) will be referred to as @param token.
*/
/**
 * GET route '/'
 * Base route; allows the frontend application and/or developer to sanity check
 * to ensure the API is live.
 * @returns HTTP Status Code 200 OK
 */
app.get('/', function (req, res) {
    res.send('The Red Alliance API. Copyright 2020 Titan Scouting.');
    res.status(200);
});
/**
 * POST route '/api/submitMatchData'
 * Allows the application to submit data to the API, with some key data seperated within the
 * JSON and the rest submitted as arbirtary structures within the data key.
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @param competitionID is the identifier for the competition: e.g. '2020ilch'.
 * @param matchNumber is the number of the match scouted: e.g. '1'.
 * @param teamScouted is the team that was being scouted: e.g. '3061'.
 * @param data is the arbritrary other data that needs to be recorded for the match.
 * @returns back to the client resobj (success boolean, competition id, and match number)
 * and HTTP Status Code 200 OK.
 */
app.post('/api/submitMatchData', auth.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, scouter, competitionID, matchNumber, teamScouted, data, err_1, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scouter = { name: String(res.locals.name), id: String(res.locals.id) };
                competitionID = String(req.body.competitionID);
                matchNumber = parseInt(req.body.matchNumber, 10);
                teamScouted = parseInt(req.body.teamScouted, 10);
                data = req.body.data;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.submitMatchData(req.db, scouter, competitionID, matchNumber, teamScouted, data).catch(function (e) {
                        console.error(e);
                        val.err_occur = true;
                    })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competitionID,
                        matchNumber: matchNumber,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
/**
 * GET route '/api/fetchMatches'
 * Allows the application to fetch the list of matches and the number of scouters for the match.
 * @param competitionID is the identifier for the competition: e.g. '2020ilch'.
 * @returns back to the client resobj (competition, list of matches, andn number of scouters) and 200 OK.
 */
app.get('/api/fetchMatches', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, competition, err_2, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                competition = String(req.query.competition);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetchMatchesForCompetition(req.db, competition).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competition,
                        data: val.data.data,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
/**
 * GET route '/api/checkUser'
 * Allows the application to fetch the list of matches and the number of scouters for the match.
 * @param token is the token obtained from Google OAuth and the JWT.
 * @returns back to the client let resobj (name and Google ID of user) and HTTP Status Code 200 OK.
 */
app.get('/api/checkUser', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, _a, err_3, resobj;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                val = { data: {}, err_occur: false, err_reasons: [] };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = val;
                return [4 /*yield*/, dbHandler.checkKey(req.db, req.query.CLIENT_ID, req.query.CLIENT_SECRET).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                console.error(err_3);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (!val.err_occur) {
                    resobj = {
                        success: true,
                        isAuth: val.data,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
/**
 * GET route '/api/fetchScouterSuggestions'
 * Allows the application to fetch the suggestions that a scouter made for a match (presumably one that Titan Robotics is part of, or else why would they make suggestions?).
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @param matchNumber is the number of the match scouted: e.g. '1'.
 * @returns back to the client let resobj (competition id, match number, and reccoemendation) and HTTP Status Code 200 OK.
 */
app.get('/api/fetchScouterSuggestions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, competition, matchNumber, err_4, dataInterim, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                competition = String(req.query.competition);
                matchNumber = parseInt(req.query.match_number, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetchScouterSuggestions(req.db, competition, matchNumber).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.error(err_4);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                try {
                    dataInterim = val.data;
                }
                catch (e) {
                    val.err_occur = true;
                }
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competition,
                        matchNumber: matchNumber,
                        data: dataInterim,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
/**
 * GET route '/api/fetchScouterUIDs'
 * Allows the application to fetch which users are scouting a given match.
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @param matchNumber is the number of the match scouted: e.g. '1'.
 * @returns back to the client let resobj (competition id, array containing scouter information, and corresponding index teams) and HTTP Status Code 200 OK.
 */
app.get('/api/fetchScouterUIDs', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, competition, matchNumber, e_1, scoutersInterim, teamsInterim, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                competition = String(req.query.competition);
                matchNumber = parseInt(req.query.match_number, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetchScouterUIDs(req.db, competition, matchNumber).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                try {
                    scoutersInterim = val.scouters;
                    teamsInterim = val.teams;
                }
                catch (e) {
                    val.err_occur = true;
                }
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competition,
                        scouters: scoutersInterim,
                        teams: teamsInterim,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
/**
 * GET route '/api/fetchAllTeamNicknamesAtCompetition'
 * Allows the application to fetch the nicknames for all the teams which are at a competition. (For example, Team 2022 = Titan Robotics)
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @returns back to the client let resobj (competition id, JSON of the team number and nicknames) and HTTP Status Code 200 OK.
 */
app.get('/api/fetchAllTeamNicknamesAtCompetition', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, competition, e_2, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                competition = String(req.query.competition);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetchAllTeamNicknamesAtCompetition(req.db, competition).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                console.error(e_2);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competition,
                        data: val.data,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
/**
 * GET route '/api/findTeamNickname'
 * Allows the application to get the nickname for a team, given the team number.
 * @param teamNum is the FRC team number: e.g. '2022'.
 * @returns back to the client let resobj (team number and nickname) and HTTP Status Code 200 OK.
 */
app.get('/api/findTeamNickname', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, teamNumber, e_3, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                teamNumber = req.query.team_number;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.findTeamNickname(req.db, teamNumber).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                console.error(e_3);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        teamNum: teamNumber,
                        nickname: val.data,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
/**
 * GET route '/api/fetchCompetitionSchedule'
 * Allows the application to get all the matches for a given competition.
 * @param competition is the Competition id: e.g. '2020ilch'.
 * @returns back to the client let resobj (competition and ) and HTTP Status Code 200 OK.
 */
app.get('/api/fetchCompetitionSchedule', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, competition, e_4, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                competition = String(req.query.competition);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetchCompetitionSchedule(req.db, competition).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_4 = _a.sent();
                console.error(e_4);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competition,
                        data: val.data,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/fetch2022Schedule', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, competition, e_5, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                competition = String(req.query.competition);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetch2022Schedule(req.db, competition).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                console.error(e_5);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competition,
                        data: val.data,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/fetchMatchData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, competitionID, matchNumber, teamScouted, err_5, dataInterim, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                competitionID = String(req.query.competition);
                matchNumber = parseInt(req.query.match_number, 10);
                teamScouted = parseInt(req.query.team_scouted, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetchMatchData(req.db, competitionID, matchNumber, teamScouted).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.error(err_5);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                try {
                    dataInterim = val.data.data;
                }
                catch (e) {
                    val.err_occur = true;
                }
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competitionID,
                        matchNumber: matchNumber,
                        teamScouted: teamScouted,
                        data: dataInterim,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
// app.get('/api/fetchShotChartData', async (req: any, res:any) => {
//   let val;
//   const competitionID = String(req.body.competitionID);
//   const matchNumber = parseInt(req.body.matchNumber, 10);
//   const teamScouted = parseInt(req.body.teamScouted, 10);
//   try {
//     val = await dbHandler.fetchShotChartData(req.db, competitionID, matchNumber, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
//   } catch (err) {
//     console.error(err);
//     val.err_occur = true;
//   }
//   let resobj = null;
//   if (val.err_occur === false) {
//     resobj = {
//       success: true,
//       competition: competitionID,
//       matchNumber,
//       teamScouted,
//       data: val.data.data,
//     };
//   } else {
//     resobj = {
//       success: false,
//       reasons: val.err_reasons,
//     };
//   }
//   res.json(resobj);
// });
// app.post('/api/submitShotChartData', auth.checkAuth, async (req: any, res:any) => {
//   let val;
//   const scouter = { name: String(res.locals.name), id: String(res.locals.id) };
//   const competitionID = String(req.body.competitionID);
//   const matchNumber = parseInt(req.body.matchNumber, 10);
//   const teamScouted = parseInt(req.body.teamScouted, 10);
//   const { data } = req.body;
//   try {
//     val = await dbHandler.submitShotChartData(req.db, scouter, competitionID, matchNumber, teamScouted, data).catch((e) => { console.error(e); val.err_occur = true; });
//   } catch (err) {
//     console.error(err);
//     val.err_occur = true;
//   }
//   let resobj = null;
//   if (val.err_occur === false) {
//     resobj = {
//       success: true,
//       competition: competitionID,
//       matchNumber,
//     };
//   } else {
//     resobj = {
//       success: false,
//       reasons: val.err_reasons,
//     };
//   }
//   res.json(resobj);
// });
/**
 * POST route '/api/addAPIKey'
 * Allows the creation of API keys from current OAuth users.
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @returns back to the client let resobj (success, client id, and client secret generated) and HTTP Status Code 200 OK.
 */
app.post('/api/addAPIKey', auth.noAPIKey, auth.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, clientInfo, err_6, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, uuid_apikey_1.default.create()];
            case 1:
                clientInfo = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, dbHandler.addKey(req.db, clientInfo.uuid, clientInfo.apiKey).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 3:
                val = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_6 = _a.sent();
                console.error(err_6);
                val.err_occur = true;
                return [3 /*break*/, 5];
            case 5:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        CLIENT_ID: clientInfo.uuid,
                        CLIENT_SECRET: clientInfo.apiKey,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/addScouterToMatch', auth.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, match, user, teamScouted, userName, err_7, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                match = String(req.body.match);
                user = parseInt(res.locals.id, 10);
                teamScouted = parseInt(req.body.team_scouting, 10);
                userName = String(res.locals.name);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.addScouterToMatch(req.db, user, userName, match, teamScouted).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                console.error(err_7);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/removeScouterFromMatch', auth.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, match, user, teamScouted, err_8, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                match = String(req.body.match);
                user = parseInt(res.locals.id, 10);
                teamScouted = parseInt(req.body.team_scouting, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.removeScouterFromMatch(req.db, user, match, teamScouted).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_8 = _a.sent();
                console.error(err_8);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/submitStrategy', auth.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, scouter, comp, data, doGet, match, resobj, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scouter = String(res.locals.name);
                comp = String(req.body.competition);
                data = String(req.body.data);
                doGet = true;
                // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
                if (data === 'null' || scouter === 'undefined') {
                    doGet = false;
                }
                match = String(req.body.match);
                resobj = null;
                if (!(doGet === true)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.submitStrategy(req.db, scouter, match, comp, data)];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_9 = _a.sent();
                console.error(err_9);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                return [3 /*break*/, 6];
            case 5:
                resobj = {
                    success: false,
                    reasons: 'Data is null',
                };
                _a.label = 6;
            case 6:
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/fetchStrategy', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, comp, match, err_10, dataInterim, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                comp = String(req.query.competition);
                match = String(req.query.match);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetchStrategy(req.db, comp, match).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_10 = _a.sent();
                console.error(err_10);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                try {
                    dataInterim = val.data;
                }
                catch (e) {
                    val.err_occur = true;
                }
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        data: dataInterim,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/getUserStrategy', auth.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, comp, match, name, err_11, dataInterim, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                comp = String(req.query.competition);
                match = String(req.query.match_number);
                name = String(res.locals.name);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.getUserStrategy(req.db, comp, match, name).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_11 = _a.sent();
                console.error(err_11);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                try {
                    dataInterim = val.data;
                }
                catch (e) {
                    val.err_occur = true;
                }
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        data: dataInterim,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
// Privacy Policy
app.get('/privacy-policy', function (req, res) {
    res.redirect('https://drive.google.com/a/imsa.edu/file/d/11_cAuaerCrQ3BBXNx_G_zw1ZyGaTWx0z/view?usp=sharing');
});
app.get('/api/fetchMatchConfig', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        response = [
            {
                Auto: [
                    {
                        name: 'Passed Auto Line?',
                        key: 'pass-line',
                        widget: 'segment',
                        options: ['Don\'t Know', 'No', 'Yes'],
                    },
                    {
                        name: 'Initial Balls Stored',
                        key: 'balls-started',
                        widget: 'stepper',
                    },
                    {
                        name: 'Extra Balls Collected',
                        key: 'balls-collected',
                        widget: 'stepper',
                    },
                    {
                        name: 'Balls Scored Upper',
                        key: 'balls-upper-auto',
                        widget: 'stepper',
                    },
                    {
                        name: 'Balls Scored Lower',
                        key: 'balls-lower-auto',
                        widget: 'stepper',
                    },
                ],
            },
            {
                Teleop: [
                    {
                        name: 'Spun Wheel?',
                        key: 'spun-wheel',
                        widget: 'segment',
                        options: ['Don\'t know', 'No', 'Position', 'Color'],
                    },
                    {
                        name: 'Balls Scored Upper',
                        key: 'balls-upper-teleop',
                        widget: 'stepper',
                    },
                    {
                        name: 'Balls Scored Lower',
                        key: 'balls-lower-teleop',
                        widget: 'stepper',
                    },
                    {
                        name: 'Did they shoot from a vulnerable location??',
                        key: 'shooting-vulnerable',
                        widget: 'segment',
                        options: ['Don\'t know', 'No', 'Yes'],
                    },
                    {
                        name: 'Where could they shoot from?',
                        key: 'shooting-notes',
                        widget: 'text-area',
                    },
                    {
                        name: 'Did they climb?',
                        key: 'climb',
                        widget: 'segment',
                        options: ['Don\'t know', 'No Attempt', 'Failed', 'Yes'],
                    },
                    {
                        name: 'Did they play defense?',
                        key: 'defense',
                        widget: 'segment',
                        options: ['Don\'t know', 'No', 'Yes'],
                    },
                    {
                        name: 'What teams did this one play defense on?',
                        key: 'defense-notes',
                        widget: 'text-area',
                    },
                ],
            },
            {
                Notes: [
                    {
                        name: 'Overall Competency',
                        key: 'competency',
                        widget: 'segment',
                        options: ['Don\'t know', 'Awful', 'Meh', 'Good', 'Best'],
                    },
                    {
                        name: 'Speed',
                        key: 'speed',
                        widget: 'segment',
                        options: ['Don\'t know', 'Slow', 'Med.', 'Fast', 'Ludicrous'],
                    },
                    {
                        name: 'Strategic Focus',
                        key: 'strategic-focus',
                        widget: 'segment',
                        options: ['Don\'t know', 'Offense', 'Defense', 'Hybrid'],
                    },
                    {
                        name: 'How could we use this robot in a strategy?',
                        key: 'strategy-notes',
                        widget: 'text-area',
                    },
                ],
            },
        ];
        res.json(response);
        return [2 /*return*/];
    });
}); });
app.get('/api/fetchPitConfig', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        response = [
            {
                Pit: [
                    {
                        name: 'Updated on Match',
                        key: 'match-updated',
                        widget: 'stepper',
                    },
                    {
                        name: 'Can do low balls?',
                        key: 'low-balls',
                        widget: 'segment',
                        options: ['Don\'t Know', 'Yes', 'No'],
                    },
                    {
                        name: 'Can do high balls?',
                        key: 'high-balls',
                        widget: 'segment',
                        options: ['Don\'t Know', 'Yes', 'No'],
                    },
                    {
                        name: 'Has wheel mechanism?',
                        key: 'wheel-mechanism',
                        widget: 'segment',
                        options: ['Don\'t Know', 'Yes', 'No'],
                    },
                    {
                        name: 'Demonstrated wheel success?',
                        key: 'wheel-success',
                        widget: 'segment',
                        options: ['Don\'t Know', 'Yes', 'No'],
                    },
                    {
                        name: 'Strategic focus',
                        key: 'strategic-focus',
                        widget: 'segment',
                        options: ['idk', 'Offense', 'Defense', 'Hybrid'],
                    },
                    {
                        name: 'Climb mechanism',
                        key: 'climb-mechanism',
                        widget: 'segment',
                        options: ['Don\'t Know', 'x0', 'x1', 'x2', 'x3'],
                    },
                    {
                        name: 'Climb requirements (space? time?)',
                        key: 'climb-requirements',
                        widget: 'text-area',
                    },
                    {
                        name: 'Attitude toward Titan Robotics',
                        key: 'attitude',
                        widget: 'segment',
                        options: ['Don\'t Know', 'Negative', 'Neutral', 'Positive', 'Love'],
                    },
                    {
                        name: 'Other notes',
                        key: 'defense-notes',
                        widget: 'text-area',
                    },
                ],
            },
        ];
        res.json(response);
        return [2 /*return*/];
    });
}); });
app.post('/api/submitPitData', auth.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, scouter, competitionID, matchNumber, teamScouted, data, err_12, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scouter = { name: String(res.locals.name), id: String(res.locals.id) };
                competitionID = String(req.body.competitionID);
                matchNumber = parseInt(req.body.matchNumber, 10);
                teamScouted = parseInt(req.body.teamScouted, 10);
                data = req.body.data;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.submitPitData(req.db, scouter, competitionID, matchNumber, teamScouted, data).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_12 = _a.sent();
                console.error(err_12);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competitionID,
                        matchNumber: matchNumber,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/fetchPitData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var val, competitionID, matchNumber, teamScouted, err_13, dataInterim, resobj;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                competitionID = String(req.query.competition);
                matchNumber = parseInt(req.query.match_number, 10);
                teamScouted = parseInt(req.query.team_scouted, 10);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbHandler.fetchPitData(req.db, competitionID, matchNumber, teamScouted).catch(function (e) { console.error(e); val.err_occur = true; })];
            case 2:
                val = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_13 = _a.sent();
                console.error(err_13);
                val.err_occur = true;
                return [3 /*break*/, 4];
            case 4:
                try {
                    dataInterim = val.data.data;
                }
                catch (e) {
                    val.err_occur = true;
                }
                resobj = null;
                if (val.err_occur === false) {
                    resobj = {
                        success: true,
                        competition: competitionID,
                        matchNumber: matchNumber,
                        teamScouted: teamScouted,
                        data: dataInterim,
                    };
                }
                else {
                    resobj = {
                        success: false,
                        reasons: val.err_reasons,
                    };
                }
                res.json(resobj);
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () { return console.log("Listening on port " + port); });
module.exports = app;
