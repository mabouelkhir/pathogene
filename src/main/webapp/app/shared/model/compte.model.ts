import { IUser } from '@/shared/model/user.model';

export interface ICompte {
  id?: number;
  user?: IUser | null;
}

export class Compte implements ICompte {
  constructor(public id?: number, public user?: IUser | null) {}
}
