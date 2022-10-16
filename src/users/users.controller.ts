import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { LoggerService } from '../logger/logger.service';

export class UserController extends BaseController {
	constructor(logger: LoggerService) {
		super(logger);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/error', method: 'post', func: this.error },
		]);
	}

	login(req: Request, res: Response, next: NextFunction) {
		res.json({ login: 200 });
	}

	register(req: Request, res: Response, next: NextFunction) {
		res.json({ register: 200 });
	}

	error(req: Request, res: Response, next: NextFunction) {
		next(new HTTPError(522, 'Testing error message', 'Testing error context'));
	}
}
