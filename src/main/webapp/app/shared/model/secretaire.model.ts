import { IUser } from '@/shared/model/user.model';
import { IMedecin } from '@/shared/model/medecin.model';
import { IPatient } from '@/shared/model/patient.model';

export interface ISecretaire {
  id?: number;
  code?: string | null;
  nom?: string | null;
  numEmp?: string | null;
  prenom?: string | null;
  admin?: boolean | null;
  photoContentType?: string | null;
  photo?: string | null;
  user?: IUser | null;
  medecins?: IMedecin[] | null;
  patients?: IPatient[] | null;
}

export class Secretaire implements ISecretaire {
  constructor(
    public id?: number,
    public code?: string | null,
    public nom?: string | null,
    public numEmp?: string | null,
    public prenom?: string | null,
    public admin?: boolean | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public user?: IUser | null,
    public medecins?: IMedecin[] | null,
    public patients?: IPatient[] | null
  ) {
    this.admin = this.admin ?? false;
  }
}
