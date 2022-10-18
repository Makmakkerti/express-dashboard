import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from '../types';
import { UserService } from './users.service';
import { User } from './user';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.IConfigService);
	usersService = container.get<IUserService>(TYPES.IUserService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

let createdUser: UserModel | null;
const mockUser = {
	email: 'test@test.com',
	name: 'testuser',
	password: '12345',
};

describe('User service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest
			.fn()
			.mockImplementationOnce(
				({ name, email, password }: User): UserModel => ({ name, email, password, id: 1 }),
			);

		createdUser = (await usersService.createUser(mockUser)) as UserModel;

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validatePassword - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser(mockUser);
		expect(res).toBeTruthy();
	});

	it('validatePassword - fail', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		mockUser.password = '1';
		const res = await usersService.validateUser(mockUser);
		mockUser.password = '12345';
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong email', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		mockUser.email = 'test1@test.com';
		const res = await usersService.validateUser(mockUser);
		mockUser.email = 'test@test.com';
		expect(res).toBeFalsy();
	});
});
