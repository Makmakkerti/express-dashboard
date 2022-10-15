import express from 'express';

export const userRouter = express.Router();

userRouter.get('/', (req, res) => {
	res.send('User page');
});

userRouter.get('/login', (req, res) => {
	res.send('Login page');
});

userRouter.post('/login', (req, res) => {
	res.json({ ok: 200 });
});

userRouter.post('/register', (req, res) => {
	res.json({ ok: 200 });
});
