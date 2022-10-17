import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { TYPES } from '../types';
import { IUser } from './user.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user';
import { IUserService } from './users.service.interface';

@injectable()
export class UserController extends BaseController implements IUser {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/error', method: 'post', func: this.error },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		this.ok(res, { login: 200 });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this.userService.createUser(body);
		if (!newUser) {
			return next(new HTTPError(422, 'User already exists'));
		}
		const { name, email } = newUser;
		this.ok(res, { name, email });
	}

	error(req: Request, res: Response, next: NextFunction): void {
		console.log('Some error has happened!');
		next(new HTTPError(522, 'Testing error message', 'Testing error context'));
	}
}
