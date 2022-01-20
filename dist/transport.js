"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class AbstractTransport {
    constructor(baseURL) {
        this.agent = axios_1.default.create({
            baseURL,
        });
    }
    async authenticate() { }
    async init(scope, connector) { }
    onError(exception) { }
}
exports.default = AbstractTransport;
