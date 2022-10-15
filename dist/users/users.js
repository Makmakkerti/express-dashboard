"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.userRouter = express_1.default.Router();
exports.userRouter.get('/', (req, res) => {
    res.send('User page');
});
exports.userRouter.get('/login', (req, res) => {
    res.send('Login page');
});
exports.userRouter.post('/login', (req, res) => {
    res.json({ ok: 200 });
});
exports.userRouter.post('/register', (req, res) => {
    res.json({ ok: 200 });
});
