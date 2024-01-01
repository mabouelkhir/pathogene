import { IClassification } from '@/shared/model/classification.model';
import { IMaladie } from '@/shared/model/maladie.model';

export interface IUnclassified {
  id?: number;
  code?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  classifications?: IClassification[] | null;
  maladie?: IMaladie | null;
}

export class Unclassified implements IUnclassified {
  constructor(
    public id?: number,
    public code?: string | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public classifications?: IClassification[] | null,
    public maladie?: IMaladie | null
  ) {}
}
