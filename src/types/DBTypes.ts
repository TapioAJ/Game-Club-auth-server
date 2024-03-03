import {Document, Types} from 'mongoose';

type User = Partial<Document> & {
  id: Types.ObjectId | string;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  bio: string | null;
};

type UserOutput = Omit<User, 'password' | 'role' | 'bio'>;

type UserInput = Omit<User, 'id' | 'role'>;

type UserTest = Partial<User>;

type LoginUser = Omit<User, 'password' | 'bio'>;

type TokenContent = {
  token: string;
  user: LoginUser;
};


export {
  User,
  LoginUser,
  TokenContent,
  UserOutput,
  UserInput,
  UserTest,
};