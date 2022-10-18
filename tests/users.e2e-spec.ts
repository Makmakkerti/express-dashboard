import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
import { UserModel } from '@prisma/client';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

const mockUser = {
	email: 'test@test.com',
	name: 'testuser',
	password: '12345',
};

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app).post('/user/register').send({
			email: 'test@test.com',
			password: '12345',
		});
		expect(res.statusCode).toBe(422);
	});

	// it('Register - success', async () => {
	// 	const res = await request(application.app).post('/user/register').send(mockUser);
	// 	expect(res.statusCode).toBe(200);
	// });

	it('Login - success', async () => {
		const res = await request(application.app).post('/user/login').send(mockUser);
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/user/login')
			.send({ ...mockUser, password: '1' });
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const {
			body: { jwt },
		} = await request(application.app).post('/user/login').send(mockUser);
		const res = await request(application.app)
			.get('/user/info')
			.set('Authorization', `Bearer ${jwt}`);
		expect(res.body.email).toBe(mockUser.email);
	});

	it('Info - error', async () => {
		const jwt = 'fakejwt';
		const res = await request(application.app)
			.get('/user/info')
			.set('Authorization', `Bearer ${jwt}`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
