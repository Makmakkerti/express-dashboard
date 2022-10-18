import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user';
import { IUserService } from './users.service.interface';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configSerice: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null | Error> {
		const userExists = await this.usersRepository.find(email);
		if (userExists) {
			return new Error('[UserService]: Create user (user exists)');
		}

		const newUser = new User(name, email);
		const salt = parseInt(this.configSerice.get('SALT'));
		if (!Number.isInteger(salt)) {
			return new Error('[UserService]: invalid salt provided');
		}
		await newUser.setPassword(password, salt);
		return await this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const user = await this.usersRepository.find(email);
		if (!user) {
			return false;
		}

		const newUser = new User(user.email, user.name, user.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}
}
