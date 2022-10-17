import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | null | Error>;
	validateUser: (dto: UserLoginDto) => boolean;
}
