import { App } from './app';

const bootstrap = async () => {
	const app = new App(3000);
	await app.init();
};

bootstrap();
