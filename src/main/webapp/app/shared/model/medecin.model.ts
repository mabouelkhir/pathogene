import { IUser } from '@/shared/model/user.model';
import { IClassification } from '@/shared/model/classification.model';
import { IRendezVous } from '@/shared/model/rendez-vous.model';
import { ISecretaire } from '@/shared/model/secretaire.model';

export interface IMedecin {
  id?: number;
  code?: string | null;
  nom?: string | null;
  numEmp?: string | null;
  prenom?: string | null;
  expertLevel?: number | null;
  photoContentType?: string | null;
  photo?: string | null;
  type?: string | null;
  nbrPatients?: number | null;
  rating?: number | null;
  description?: string | null;
  user?: IUser | null;
  classifications?: IClassification[] | null;
  rendezVous?: IRendezVous[] | null;
  secretaire?: ISecretaire | null;
}

export class Medecin implements IMedecin {
  constructor(
    public id?: number,
    public code?: string | null,
    public nom?: string | null,
    public numEmp?: string | null,
    public prenom?: string | null,
    public expertLevel?: number | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public type?: string | null,
    public nbrPatients?: number | null,
    public rating?: number | null,
    public description?: string | null,
    public user?: IUser | null,
    public classifications?: IClassification[] | null,
    public rendezVous?: IRendezVous[] | null,
    public secretaire?: ISecretaire | null
  ) {}
}
