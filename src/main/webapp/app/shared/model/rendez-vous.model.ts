import { IVisite } from '@/shared/model/visite.model';
import { IPatient } from '@/shared/model/patient.model';
import { IMedecin } from '@/shared/model/medecin.model';

export interface IRendezVous {
  id?: number;
  date?: Date | null;
  code?: string | null;
  status?: string | null;
  visite?: IVisite | null;
  patient?: IPatient | null;
  medecin?: IMedecin | null;
  heure?: string | null;
}

export class RendezVous implements IRendezVous {
  constructor(
    public id?: number,
    public date?: Date | null,
    public code?: string | null,
    public status?: string | null,
    public visite?: IVisite | null,
    public patient?: IPatient | null,
    public medecin?: IMedecin | null,
    public heure?: string | null
  ) {}
}
