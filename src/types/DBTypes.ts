import {Document, Types} from 'mongoose';

type User = Partial<Document> & {
  id: Types.ObjectId | string;
  user_name: string;
  password: string;
  bio: string | null;
};

type UserOutput = Omit<User, 'password'>;

type UserInput = Omit<User, 'id'>;

type UserTest = Partial<User>;

type LoginUser = Omit<User, 'password' | 'bio'>;

type TokenContent = {
  token: string;
  user: LoginUser;
};

export {User, LoginUser, TokenContent, UserOutput, UserInput, UserTest};
