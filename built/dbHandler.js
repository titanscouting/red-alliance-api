// Not implemented in this year's version of the API.
// exports.addUserToTeam = (db, idin, namein, teamin) => {
//     idin = String(idin)
//     var dbo = db.db("userlist");
//     var myobj = { "$set": {_id: idin, id: idin, name: namein, team: teamin}};
//     dbo.collection("data").updateOne({_id: idin}, myobj, {upsert:true}).then(function(err, res) {
//         if (err) {
//             console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//             errorcode = 1
//         }
//         console.log("1 document inserted");
//     });
// }
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
var _this = this;
// exports.getCompetitions = async (db, idin) => {
//     let rval;
//     idin = String(idin)
//     // Get the competitions for a team member. Currently, one user can only be part of one team.
//     var dbo = db.db("data_scouting");
//     var myobj = { id: idin};
//     var data = await dbo.collection("userlist").findOne(myobj)
//     return rval
// }
// const globalCompetition = '2020ilch';
var bcrypt = require('bcrypt');
exports.addKey = function (db, clientID, clientKey) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, hashedClientKey, myobj, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('userlist');
                hashedClientKey = bcrypt.hashSync(clientKey, 12);
                myobj = {
                    $set: {
                        clientID: clientID, hashedClientKey: hashedClientKey,
                    },
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbo.collection('api_keys').updateOne({ _id: clientID }, myobj, { upsert: true }).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_1);
                console.error(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.checkKey = function (db, clientID, clientKey) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, _a, err_2, isAuthorized;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('userlist');
                myobj = { clientID: clientID };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('api_keys').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; throw new Error('Database error'); })];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_2);
                console.error(err_2);
                return [3 /*break*/, 4];
            case 4:
                if (data.data == null) {
                    data.data = { hashedClientKey: 'obvsnotrightlfojdslf2e980' };
                }
                isAuthorized = bcrypt.compareSync(clientKey, data.data.hashedClientKey);
                return [2 /*return*/, isAuthorized];
        }
    });
}); };
exports.submitMatchData = function (db, scouter, competition, match, team_scouted, matchdata) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = {
                    $set: {
                        scouter: scouter, competition: competition, match: match, team_scouted: team_scouted,
                        data: matchdata,
                    },
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbo.collection('matchdata').updateOne({ _id: competition + match + team_scouted }, myobj, { upsert: true }).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_3);
                console.error(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.submitShotChartData = function (db, scouter, competition, match, team_scouted, datain) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = {
                    $set: {
                        scouter: scouter, competition: competition, match: match, team_scouted: team_scouted,
                        data: datain,
                    },
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbo.collection('shotchart').updateOne({ _id: competition + match + team_scouted }, myobj, { upsert: true }).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_4);
                console.error(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchMatchesForCompetition = function (db, compIdIn1) { return __awaiter(_this, void 0, void 0, function () {
    var data, compIdIn, dbo, myobj, interim, _i, interim_1, m, numScouters, i, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reason = [];
                compIdIn = String(compIdIn1);
                dbo = db.db('data_scouting');
                myobj = { competition: String(compIdIn) };
                interim = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                data.data = [];
                return [4 /*yield*/, dbo.collection('matches').find(myobj).toArray()];
            case 2:
                interim = _a.sent();
                data.data.competition = String(compIdIn);
                data.data.data = [];
                for (_i = 0, interim_1 = interim; _i < interim_1.length; _i++) {
                    m = interim_1[_i];
                    numScouters = 0;
                    for (i = 0; i < 6; i += 1) {
                        if (String(typeof (m.scouters[i])) !== 'boolean') {
                            numScouters += 1;
                        }
                    }
                    data.data.data[m.match - 1] = numScouters;
                }
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                data.err_occur = true;
                console.error(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.getNumberScouts = function (db, compIdIn1) { return __awaiter(_this, void 0, void 0, function () {
    var data, compIdIn, dbo, myobj, inval, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                compIdIn = String(compIdIn1);
                dbo = db.db('data_scouting');
                myobj = { competition: String(compIdIn) };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbo.collection('schedule').findOne(myobj)];
            case 2:
                inval = _a.sent();
                data.data = inval.data.reduce(function (partialSum, a) { return partialSum + a; }, 0);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(e_1);
                console.error(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchAllTeamNicknamesAtCompetition = function (db, compIdIn1) { return __awaiter(_this, void 0, void 0, function () {
    var data, compIdIn, dbo, myobj, _a, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reason = [];
                compIdIn = String(compIdIn1);
                dbo = db.db('data_scouting');
                myobj = { competition: String(compIdIn) };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('teamlist').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_6 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_6);
                console.error(err_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.findTeamNickname = function (db, teamNumber) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, teamlist, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reason = [];
                dbo = db.db('data_scouting');
                myobj = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbo.collection('teamlist').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                teamlist = _a.sent();
                data.data = teamlist[teamNumber];
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_7);
                console.error(err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchMatchData = function (db, compIdIn, matchNumberIn, teamScoutedIn) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, _a, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), team_scouted: parseInt(teamScoutedIn, 10) };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('matchdata').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; throw new Error('Database error'); })];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_8 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_8);
                console.error(err_8);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchCompetitionSchedule = function (db, compIdIn) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, passin, _a, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                passin = { competition: String(compIdIn) };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('matches').find(passin).toArray()];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_9 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_9);
                console.error(err_9);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetch2022Schedule = function (db, compIdIn) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, _a, err_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = { teams: { $all: ['2022'] }, competition: String(compIdIn) };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('matches').find(myobj).toArray()];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_10 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_10);
                console.error(err_10);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchShotChartData = function (db, compIdIn, matchNumberIn, teamScoutedIn) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, _a, err_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), team_scouted: parseInt(teamScoutedIn, 10) };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('shotchart').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_11 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_11);
                console.error(err_11);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchScouterSuggestions = function (db, compIdIn, matchNumberIn) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, out, toProcess, _i, toProcess_1, scoutSub, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10) };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                out = [];
                return [4 /*yield*/, dbo.collection('matchdata').find(myobj).toArray().catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                toProcess = _a.sent();
                for (_i = 0, toProcess_1 = toProcess; _i < toProcess_1.length; _i++) {
                    scoutSub = toProcess_1[_i];
                    if (scoutSub.data['strategy-notes']) {
                        out.push({ scouter: scoutSub.scouter.name, strategy: scoutSub.data['strategy-notes'] });
                    }
                }
                data.data = out;
                return [3 /*break*/, 4];
            case 3:
                err_12 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_12);
                console.error(err_12);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchScouterUIDs = function (db, competition, matchNumberIn) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, matchdata, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reason = [];
                dbo = db.db('data_scouting');
                myobj = { competition: competition, match: parseInt(matchNumberIn, 10) };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbo.collection('matches').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                matchdata = _a.sent();
                data.scouters = matchdata.scouters;
                data.teams = matchdata.teams;
                return [3 /*break*/, 4];
            case 3:
                err_13 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_13);
                console.error(err_13);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.addScouterToMatch = function (db, userin, namein, matchin, teamScouted) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, interim, index, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = { match: parseInt(matchin, 10) };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, dbo.collection('matches').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                interim = _a.sent();
                index = interim.teams.indexOf(String(teamScouted));
                if (index < 0) {
                    console.error('Does not exist');
                    data.err_occur = true;
                    data.err_reasons.push('Team does not exist in scout schedule');
                }
                interim.scouters[index] = { name: String(namein), id: String(userin) };
                return [4 /*yield*/, dbo.collection('matches').findOneAndReplace(myobj, interim, { upsert: true }).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_14 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_14);
                console.error(err_14);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, data];
        }
    });
}); };
exports.removeScouterFromMatch = function (db, userin, matchin, teamScouted) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, interim, index, err_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = { match: parseInt(matchin, 10) };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, dbo.collection('matches').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                interim = _a.sent();
                index = interim.teams.indexOf(String(teamScouted));
                if (index < 0) {
                    console.error('Does not exist');
                    data.err_occur = true;
                    data.err_reasons.push('Team does not exist in scout schedule');
                }
                interim.scouters[index] = false;
                return [4 /*yield*/, dbo.collection('matches').findOneAndReplace(myobj, interim, { upsert: true }).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_15 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_15);
                console.error(err_15);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, data];
        }
    });
}); };
exports.submitStrategy = function (db, scouterin, matchin, compin, datain) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, err_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('strategies');
                myobj = {
                    $set: {
                        scouter: scouterin, competition: compin, match: matchin, data: datain,
                    },
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbo.collection('data').updateOne({ _id: compin + scouterin + matchin }, myobj, { upsert: true })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_16 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_16);
                console.error(err_16);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchStrategy = function (db, compIdIn, matchIdIn) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, _a, err_17;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('strategies');
                myobj = { competition: String(compIdIn), match: String(matchIdIn) };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('data').find(myobj).toArray()];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_17 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_17);
                console.error(err_17);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.getUserStrategy = function (db, compIdIn, matchIdIn, namein) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, _a, err_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('strategies');
                myobj = { competition: String(compIdIn), match: String(matchIdIn), scouter: String(namein) };
                console.log(myobj);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('data').find(myobj).toArray()];
            case 2:
                _a.data = _b.sent();
                console.log(data.data);
                return [3 /*break*/, 4];
            case 3:
                err_18 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_18);
                console.error(err_18);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.submitPitData = function (db, scouterin, competitionin, matchin, teamin, datain) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, err_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = {
                    $set: {
                        scouter: scouterin, competition: competitionin, match: matchin, team_scouted: teamin, data: datain,
                    },
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dbo.collection('pitdata').updateOne({ _id: competitionin + matchin + teamin }, myobj, { upsert: true }).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_19 = _a.sent();
                data.err_occur = true;
                data.err_reasons.push(err_19);
                console.error(err_19);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
exports.fetchPitData = function (db, compIdIn, matchNumberIn, teamScoutedIn) { return __awaiter(_this, void 0, void 0, function () {
    var data, dbo, myobj, _a, err_20;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = {};
                data.err_occur = false;
                data.err_reasons = [];
                dbo = db.db('data_scouting');
                myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), team_scouted: parseInt(teamScoutedIn, 10) };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = data;
                return [4 /*yield*/, dbo.collection('pitdata').findOne(myobj).catch(function (e) { console.error(e); data.err_occur = true; })];
            case 2:
                _a.data = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_20 = _b.sent();
                data.err_occur = true;
                data.err_reasons.push(err_20);
                console.error(err_20);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, data];
        }
    });
}); };
