import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Wrong email' })
	email!: string;

	@IsString({ message: 'Empty password' })
	password!: string;

	@IsString({ message: 'Empty name' })
	name!: string;
}
