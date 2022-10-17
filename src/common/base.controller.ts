import { Router, Response } from 'express';
import { ILogger } from '../logger/logger.interface';
import { ExpressReturnType, IControllerRoute } from './route.interface';
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

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		return res.status(code).type('application/json').json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send(res, 200, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			// Binding context to each middleware
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			// Put middlewares before handler, if exists
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
