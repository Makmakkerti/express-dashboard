import express, { Express, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { UserController } from './users/users.controller';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { json } from 'body-parser';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server | undefined;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IConfigService) private configSerice: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
	) {
		this.app = express();
		this.port = 3000;
	}
	useMiddlewares(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configSerice.get('JWTSECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.get('/', (req, res) => {
			this.logger.log('healthcheck');
			res.send('Welcome to Dashboard');
		});
		this.app.use('/user', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();

		this.server = this.app.listen(this.port);
		this.logger.log(`Server running on port ${this.port}`);
	}
}
