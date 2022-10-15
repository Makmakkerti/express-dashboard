import { App } from './app';
import { LoggerService } from './logger/logger.service';

const bootstrap = async () => {
	const app = new App(3000, new LoggerService());
	await app.init();
};

bootstrap();
