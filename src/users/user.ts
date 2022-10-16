import { hash } from 'bcryptjs';

export class User {
	private _password!: string;
	constructor(private readonly _name: string, private readonly _email: string) {}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string): Promise<void> {
		this._password = await hash(pass, 10);
	}
}
