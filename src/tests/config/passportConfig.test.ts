import bcrypt from "bcrypt";
import configurePassport, { verify } from "../../config/passportConfig";
import User, { IUser } from "../../models/User";

const passport = jest.requireActual("passport");

jest.mock("../../models/User", () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
}));

describe("Passport Configuration", () => {
  // Assuming mockUser is defined in your context
  const mockUser = {
    id: "123",
    username: "testUser",
    password: "hashedPassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    configurePassport(passport);
  });

  it("verify - should authenticates a user", (done) => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    verify("testUser", "testPassword", (error, user) => {
      expect(error).toBe(null);
      expect(user).toBe(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ username: "testUser" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "testPassword",
        "hashedPassword"
      );
      done();
    });
  });

  it("verify - fails to authenticate a user when the user is not found", (done) => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    verify("testUser", "testPassword", (error, user) => {
      expect(error).toBe(null);
      expect(user).toBe(false);
      expect(User.findOne).toHaveBeenCalledWith({ username: "testUser" });
      done();
    });
  });

  it("verify - fails to authenticate a user when an error occurs during user search", (done) => {
    (User.findOne as jest.Mock).mockRejectedValue(
      new Error("User search failed")
    );

    verify("testUser", "testPassword", (error, user) => {
      expect(error).toBeInstanceOf(Error);
      expect(user).toBe(undefined);
      expect(User.findOne).toHaveBeenCalledWith({ username: "testUser" });
      done();
    });
  });

  it("verify - fails to authenticate when bcrypt comparison fails", (done) => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    verify("testUser", "testPassword", (error, user) => {
      expect(error).toBe(null);
      expect(user).toBe(false);
      expect(User.findOne).toHaveBeenCalledWith({ username: "testUser" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "testPassword",
        mockUser.password
      );
      done();
    });
  });

  it("verify - throws an error if bcrypt comparison fails due to error", (done) => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockRejectedValue(
      new Error("Bcrypt comparison failed")
    );

    verify("testUser", "testPassword", (error, user) => {
      expect(error).toBeInstanceOf(Error);
      expect(user).toBe(undefined);
      expect(User.findOne).toHaveBeenCalledWith({ username: "testUser" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "testPassword",
        mockUser.password
      );
      done();
    });
  });

  it("serializeUser - should serialize a user", (done) => {
    passport.serializeUser(mockUser, (error: Error, id: string) => {
      expect(error).toBe(null);
      expect(id).toBe("123");
      done();
    });
  });

  it("deserializeUser - fails to deserialize a user when the user is not found", (done) => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    passport.deserializeUser("123", (error: Error, user: IUser) => {
      expect(error).toBe(null);
      expect(user).toBe(false);
      expect(User.findById).toHaveBeenCalledWith("123");
      done();
    });
  });

  it("deserializeUser - throws an error during deserialization if User.findById fails", (done) => {
    (User.findById as jest.Mock).mockRejectedValue(
      new Error("User search failed")
    );

    passport.deserializeUser("123", (error: Error, user: IUser) => {
      expect(error).toBeInstanceOf(Error);
      expect(user).toBe(undefined);
      expect(User.findById).toHaveBeenCalledWith("123");
      done();
    });
  });
});
