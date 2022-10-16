import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';

const bootstrap = async () => {
	const logger = new LoggerService();
	const app = new App(3000, logger, new UserController(logger), new ExceptionFilter(logger));
	await app.init();
};

bootstrap();
