import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { TYPES } from '../types';
import { IUserController } from './user.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/error', method: 'post', func: this.error },
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isValidUser = await this.userService.validateUser(body);
		if (!isValidUser) {
			this.loggerService.error('[UserController]: login (invalid credentials)');
			return next(new Error('invalid credentials'));
		}

		const foundUser = await this.userService.getUserInfo(body.email);
		if (!foundUser) {
			this.loggerService.error('[UserController]: login (user not found)');
			return next(new Error('user not found)'));
		}

		this.ok(res, foundUser);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'User already exists'));
		}
		if (result instanceof Error) {
			return next(result);
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	error(req: Request, res: Response, next: NextFunction): void {
		console.log('Some error has happened!');
		next(new HTTPError(522, 'Testing error message', 'Testing error context'));
	}
}
