const TYPES = {
	Application: Symbol.for('Application'),
	ILogger: Symbol.for('ILogger'),
	IUserController: Symbol.for('IUserController'),
	IUserService: Symbol.for('IUserService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	IConfigService: Symbol.for('IConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	UsersRepository: Symbol.for('UsersRepository'),
};

export { TYPES };
