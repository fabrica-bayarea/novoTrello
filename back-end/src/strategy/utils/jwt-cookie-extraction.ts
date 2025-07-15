import { Request } from 'express';

export const jwtFromCookie = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['trello-session'];
  }
  return token;
};