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
var OAuth2Client = require('google-auth-library').OAuth2Client;
var dbHandler = require('./dbHandler.js');
var CLIENT_ID = '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com';
var client = new OAuth2Client(CLIENT_ID);
module.exports.checkAuth = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var extUsers, isAuthorized, ticket, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                extUsers = ['Jon Abend', 'Robyn Abend', 'Dev Singh', 'Jacob Levine', 'Arthur Lu', 'Ian Fowler'];
                if (!req.query.CLIENT_ID) return [3 /*break*/, 2];
                return [4 /*yield*/, dbHandler.checkKey(req.db, req.query.CLIENT_ID, req.query.CLIENT_SECRET)];
            case 1:
                isAuthorized = _a.sent();
                if (isAuthorized) {
                    res.locals.id = 0;
                    res.locals.name = 'API User';
                }
                else {
                    res.status(401);
                    res.json({
                        success: false,
                        reason: 'User could not be authenticated',
                    });
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, client.verifyIdToken({
                    idToken: String(req.header('token')),
                    audience: [CLIENT_ID, '291863698243-eg5i4fh001n7sl28b0bqgp4h2vae9gn2.apps.googleusercontent.com', '291863698243-ofnqubd0fh5dqfhjo368c39uto1fmudt.apps.googleusercontent.com', '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com', '291863698243-ovppseib28p6usahf60igsp7ia3ovq6l.apps.googleusercontent.com', '291863698243-0dsmvs8uetpd9odms7aqn63iknroi4op.apps.googleusercontent.com'],
                }).catch(function (err) { console.error(err); res.status(401); })];
            case 3:
                ticket = _a.sent();
                try {
                    payload = ticket.getPayload();
                    if (payload.hd === 'imsa.edu' || extUsers.indexOf(payload.name) > -1 || extUsers.indexOf(payload.sub) > -1) {
                        res.locals.id = payload.sub;
                        res.locals.name = payload.name;
                    }
                    else {
                        res.status(401);
                        res.json({
                            success: false,
                            reason: 'User is not part of imsa.edu domain',
                        });
                        throw new Error('User is not part of imsa.edu domain');
                    }
                }
                catch (e) {
                    console.error("Could not get payload from ticket for reason: " + e);
                    res.status(401);
                    res.json({
                        success: false,
                        reason: 'User could not be authenticated',
                    });
                }
                _a.label = 4;
            case 4:
                next();
                return [2 /*return*/];
        }
    });
}); };
module.exports.noAPIKey = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.query.CLIENT_ID || req.query.CLIENT_SECRET) {
            res.status(401);
            res.json({ success: false, reason: 'This route does not allow authentication via API key' });
        }
        next();
        return [2 /*return*/];
    });
}); };
// after this point, the token has now been verified as valid and 'res.locals.id'
// can be treated as a unique identifier for a google user.
