import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user';
import { IUserService } from './users.service.interface';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.IConfigService) private configSerice: IConfigService) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null | Error> {
		// TODO: If user existst, return null
		const newUser = new User(name, email);
		const salt = parseInt(this.configSerice.get('SALT'));
		if (!Number.isInteger(salt)) {
			return new Error('[UserService]: invalid salt provided');
		}
		await newUser.setPassword(password, salt);
		return newUser;
	}

	validateUser(dto: UserLoginDto): boolean {
		return true;
	}
}
