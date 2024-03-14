import { Request, Response, NextFunction } from "express";

type Options = { successRedirect: string; failureRedirect: string };

class PassportMock {
  authenticate = jest.fn(
    (strategy: string, options: Options) =>
      (request: Request, response: Response) => {
        if (
          strategy === "local" &&
          request.body.username === "testUser" &&
          request.body.password === "testPassword"
        ) {
          request.isAuthenticated = jest.fn().mockReturnValue(true);
          request.user = { username: "testUser" } as Express.User;
          return response.redirect(options.successRedirect);
        } else {
          request.isAuthenticated = jest.fn().mockReturnValue(false);
          return response.redirect(options.failureRedirect);
        }
      }
  );
  initialize = jest.fn(
    () => (_request: Request, _response: Response, next: NextFunction) => {
      next();
    }
  );
  session = jest.fn(
    () => (_request: Request, _response: Response, next: NextFunction) => {
      next();
    }
  );
  use = jest.fn();
  serializeUser = jest.fn();
  deserializeUser = jest.fn();
}

export default new PassportMock();
