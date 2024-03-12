import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel';
import {LoginUser, UserInput, UserOutput} from '../../types/DBTypes';
import {UserResponse} from '../../types/MessageTypes';

const salt = bcrypt.genSaltSync(12);

const check = (req: Request, res: Response) => {
  console.log('check');
  res.json({message: 'I am alive'});
};

const userListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('userListGet');
    const users = await userModel.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select('-password');
    if (!user) {
      next(new CustomError('User not found', 404));
    }
    res.json(user);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const userPost = async (
  req: Request<{}, {}, UserInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, salt);
    const newUser = await userModel.create(user);
    const response: UserResponse = {
      message: 'user created',
      user: {
        user_name: newUser.user_name,
        id: newUser._id,
        bio: newUser.bio,
      },
    };
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const userPut = async (
  req: Request<{id?: string}, {}, UserInput>,
  res: Response<UserResponse, {userFromToken: LoginUser}>,
  next: NextFunction,
) => {
  try {
    const {userFromToken} = res.locals;

    let id = userFromToken.id;
    if (req.params.id) {
      id = req.params.id;
    }
    console.log('id', id, req.body);
    const result = await userModel
      .findByIdAndUpdate(id, req.body, {
        new: true,
      })
      .select('-password');
    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: UserResponse = {
      message: 'user updated',
      user: {
        user_name: result.user_name,
        id: result._id,
        bio: result.bio,
      },
    };
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const userDelete = async (
  req: Request<{id?: string}>,
  res: Response<UserResponse, {userFromToken: LoginUser}>,
  next: NextFunction,
) => {
  try {
    const {userFromToken} = res.locals;
    let id;
    const result = await userModel
      .findByIdAndDelete(id)
      .select('-password');
    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }
    const response: UserResponse = {
      message: 'user deleted',
      user: {
        user_name: result.user_name,
        id: result._id,
        bio: result.bio,
      },
    };
    console.log('delete response', response);
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const checkToken = async (
  req: Request,
  res: Response<UserResponse, {userFromToken: LoginUser}>,
  next: NextFunction,
) => {
  console.log('res.locals.userFromToken', res.locals.userFromToken);
  try {
    const userData: UserOutput = await userModel
      .findById(res.locals.userFromToken.id)
      .select('user_name bio');

    console.log('userData', userData);
    if (!userData) {
      next(new CustomError('Token not valid', 404));
      return;
    }
    const message: UserResponse = {
      message: 'Token valid',
      user: userData,
    };
    res.json(message);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {check, userListGet, userGet, userPost, userPut, userDelete, checkToken};
