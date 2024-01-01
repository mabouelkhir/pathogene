import { IStade } from '@/shared/model/stade.model';

export interface IImage {
  id?: number;
  code?: string | null;
  photoContentType?: string | null;
  photo?: string | null;
  stade?: IStade | null;
}

export class Image implements IImage {
  constructor(
    public id?: number,
    public code?: string | null,
    public photoContentType?: string | null,
    public photo?: string | null,
    public stade?: IStade | null
  ) {}
}
