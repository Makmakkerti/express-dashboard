import express, { Express } from 'express';
import { userRouter } from './users/users';
import { Server } from 'http';

export class App {
	app: Express;
	port: number;
	server: Server | undefined;

	constructor(port: number) {
		this.app = express();
		this.port = port;
	}

	useRoutes() {
		this.app.get('/', (req, res) => {
			res.send('Welcome to Dashboard');
		});
		this.app.use('/user', userRouter);
	}

	public async init() {
		this.useRoutes();
		this.server = this.app.listen(this.port);
		console.log(`Server running on port ${this.port}`);
	}
}
