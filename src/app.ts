import express, { Express } from 'express';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';

export class App {
	app: Express;
	port: number;
	server: Server | undefined;
	logger: LoggerService;
	userController: UserController;

	constructor(port: number, logger: LoggerService, userController: UserController) {
		this.app = express();
		this.port = port;
		this.logger = logger;
		this.userController = userController;
	}

	useRoutes() {
		this.app.get('/', (req, res) => {
			this.logger.log('healthcheck');
			res.send('Welcome to Dashboard');
		});
		this.app.use('/user', this.userController.router);
	}

	public async init() {
		this.useRoutes();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server running on port ${this.port}`);
	}
}
