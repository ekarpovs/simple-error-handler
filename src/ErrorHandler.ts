import { NextFunction, Request, Response } from "express";

import { AppError, ResponseCode } from "./AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    appErrorHandler(err, res);
  } else {
    internalErrorHandler(err, res);
  };
};

const appErrorHandler = (err: AppError, res: Response) => {
  res.status(err.code).json({ message: err.message });
};

const internalErrorHandler = (err: Error, res: Response) => {
  res.status(ResponseCode.INTERNAL_SERVER_ERROR).send('Internal server error');
};

const isAppError = (err: Error): boolean => {
  return (err instanceof AppError);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('unhandledRejection', (err: Error, prom: Promise<unknown>) => {
  throw err;
});

process.on('uncaughtException', (err: Error) => {
  // just received an error that was never handled, 
  // time to handle it and then decide whether a restart is needed
  if (!isAppError(err)) {
    process.exit(1);
  }
});