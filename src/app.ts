import express, { Express } from 'express';
import { userRouter } from './users/users';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';

export class App {
	app: Express;
	port: number;
	server: Server | undefined;
	logger: LoggerService;

	constructor(port: number, logger: LoggerService) {
		this.app = express();
		this.port = port;
		this.logger = logger;
	}

	useRoutes() {
		this.app.get('/', (req, res) => {
			this.logger.log('healthcheck');
			res.send('Welcome to Dashboard');
		});
		this.app.use('/user', userRouter);
	}

	public async init() {
		this.useRoutes();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server running on port ${this.port}`);
	}
}
