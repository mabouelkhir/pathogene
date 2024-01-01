import { IRendezVous } from '@/shared/model/rendez-vous.model';
import { IDetection } from '@/shared/model/detection.model';

export interface IVisite {
  id?: number;
  code?: string | null;
  date?: Date | null;
  rendezVous?: IRendezVous | null;
  detection?: IDetection | null;
}

export class Visite implements IVisite {
  constructor(
    public id?: number,
    public code?: string | null,
    public date?: Date | null,
    public rendezVous?: IRendezVous | null,
    public detection?: IDetection | null
  ) {}
}
