"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="node_modules/@types/node/index.d.ts"/>
var http = require("http");
var mysql = require('mysql2');
var connection = mysql.createConnection({ host: 'localhost', user: 'root', database: 'skomobo', password: 'dev1234' });
/**
 * Like the python range function, returns number array starting at start and ending at end
 *
 * @param {number} start
 * @param {number} end
 * @returns {number[]}
 */
function range(start, end) {
    var nums = Array.apply(null, Array(end + 1)).map(function (_, i) { return i; });
    return nums.slice(start);
}
function repeat(col, times) {
    return range(1, times).map(function (value) {
        return col + String(value);
    });
}
/**
 * Checks if the object contains any null children or if it itself is null
 *
 * @param {*} object
 */
function has_null(object) {
    if (object != null) {
        object.map(function (value, index) {
            return value == null;
        });
    }
    else {
        return object == null;
    }
}
function extract(url) {
    // breaks up each value by a dash and removes / in the front
    var tokens = url.slice(1).split('_');
    // layout how the data is going to be mapped
    // use javascript array.map for this somehow
    var col_names = ['Dust1', 'Dust2_5', 'Dust10', 'Box_ID', 'Temperature', 'Humidity', 'CO2', 'Decibals']
        .concat(repeat('Distance', 7)).concat(['Presence', 'Time']);
    var values = {};
    tokens.map(function (value, index) {
        values[col_names[index]] = value;
    });
    values['Presence'] = values['Presence'] == 'true';
    return values;
}
function handleRequest(request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(request.url != '/favicon.ico')) return [3 /*break*/, 3];
                    values = extract(request.url);
                    console.log(values);
                    if (!!has_null(values)) return [3 /*break*/, 2];
                    return [4 /*yield*/, connection.query('INSERT INTO sensor_data set ?', values)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    console.log("Invalid request!");
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//Create a server
var server = http.createServer(handleRequest);
var ip = require("ip");
//Lets start our server
server.listen(8080, '0.0.0.0', function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://%s:%s", ip.address(), 8080);
});
//# sourceMappingURL=server.js.map