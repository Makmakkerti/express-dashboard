import express, { Express } from 'express';
import { Server } from 'http';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';

export class App {
	app: Express;
	port: number;
	server: Server | undefined;
	logger: LoggerService;
	userController: UserController;
	exceptionFilter: ExceptionFilter;

	constructor(
		port: number,
		logger: LoggerService,
		userController: UserController,
		exceptionfilter: ExceptionFilter
	) {
		this.app = express();
		this.port = port;
		this.logger = logger;
		this.userController = userController;
		this.exceptionFilter = exceptionfilter;
	}

	useRoutes() {
		this.app.get('/', (req, res) => {
			this.logger.log('healthcheck');
			res.send('Welcome to Dashboard');
		});
		this.app.use('/user', this.userController.router);
	}

	useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init() {
		this.useRoutes();
		this.useExceptionFilters();

		this.server = this.app.listen(this.port);
		this.logger.log(`Server running on port ${this.port}`);
	}
}
