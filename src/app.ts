import express, { Express } from 'express';
import { Server } from 'http';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { UserController } from './users/users.controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server | undefined;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUser) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter
	) {
		this.app = express();
		this.port = 3000;
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
