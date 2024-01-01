import { IMedecin } from '@/shared/model/medecin.model';
import { IStade } from '@/shared/model/stade.model';
import { IUnclassified } from '@/shared/model/unclassified.model';

export interface IClassification {
  id?: number;
  code?: string | null;
  score?: boolean | null;
  medecin?: IMedecin | null;
  stade?: IStade | null;
  unclassified?: IUnclassified | null;
}

export class Classification implements IClassification {
  constructor(
    public id?: number,
    public code?: string | null,
    public score?: boolean | null,
    public medecin?: IMedecin | null,
    public stade?: IStade | null,
    public unclassified?: IUnclassified | null
  ) {
    this.score = this.score ?? false;
  }
}
