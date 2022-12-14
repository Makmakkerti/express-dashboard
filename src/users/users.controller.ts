import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { TYPES } from '../types';
import { IUserController } from './user.interface';
import { sign } from 'jsonwebtoken';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './users.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configSerice: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
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
			this.loggerService.error('[UserController]: Invalid credentials');
			return next(new HTTPError(401, 'invalid credentials'));
		}

		const foundUser = await this.userService.getUserInfo(body.email);
		if (!foundUser) {
			this.loggerService.error('[UserController]: Unable to find the user');
			return next(new HTTPError(401, 'invalid credentials'));
		}

		const secret = await this.configSerice.get('JWTSECRET');
		if (!secret) {
			return next(new Error('[UserController]: Unable to get JWT secret'));
		}
		const jwt = await this.signJWT(body.email, secret);
		this.ok(res, { jwt });
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

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const dbUser = await this.userService.getUserInfo(user);
		this.ok(res, { ...dbUser, password: null });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
