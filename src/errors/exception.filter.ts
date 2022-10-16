import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: LoggerService) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}]: Error ${err.statusCode} - ${err.message}`);
			res.status(err.statusCode).json({ err: err.message, context: err.context });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).json({ err: err.message });
		}
	}
}
