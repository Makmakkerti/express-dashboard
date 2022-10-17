import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user';
import { IUserService } from './users.service.interface';
import { injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		// TODO: If user existst, return null
		const newUser = new User(name, email);
		await newUser.setPassword(password);
		return newUser;
	}

	validateUser(dto: UserLoginDto): boolean {
		return true;
	}
}
