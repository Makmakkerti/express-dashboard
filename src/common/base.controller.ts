import { Router, Response } from 'express';
import { ILogger } from '../logger/logger.interface';
import { IControllerRoute } from './route.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, message: T): Response {
		return res.status(code).type('application/json').json(message);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send(res, 200, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}]: ${route.path}`);
			const handler = route.func.bind(this);
			this.router[route.method](route.path, route.func);
		}
	}
}
