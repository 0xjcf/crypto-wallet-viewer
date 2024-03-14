import express from "express";
import session from "express-session";
import passport from "passport";

type UserMock = {
  id?: string;
  bitcoinAddress?: string;
  ethereumAddress?: string;
};

export function initializeTestApp(
  routePrefix: string,
  controller: express.Router,
  isAuthenticated: boolean = true,
  userMock: UserMock = {}
) {
  const app = express();
  app.use(express.json());

  app.use(
    session({
      secret: "test secret",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((request, _response, next) => {
    request.isAuthenticated = () => isAuthenticated;
    request.user = userMock as Express.User;
    next();
  });

  app.use((request, _response, next) => {
    type RequestLogout = typeof request.logOut;
    if (request.query.mockLogoutError) {
      request.logOut = ((callback: (err?: any) => void): void => {
        callback(new Error("Logout Error"));
      }) as RequestLogout;
    } else {
      request.logOut = ((callback: (err?: any) => void): void => {
        callback();
      }) as RequestLogout;
    }

    next();
  });

  app.use(routePrefix, controller);

  return app;
}
