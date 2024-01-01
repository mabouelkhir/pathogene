import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { IMaladie } from '@/shared/model/maladie.model';

const baseApiUrl = 'api/maladies';

export default class MaladieService {
  public find(id: number): Promise<IMaladie> {
    return new Promise<IMaladie>((resolve, reject) => {
      axios
        .get(`${baseApiUrl}/${id}`)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public retrieve(paginationQuery?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      axios
        .get(baseApiUrl + `?${buildPaginationQueryOpts(paginationQuery)}`)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public findByPatient(): Promise<IMaladie> {
    return new Promise<any>((resolve, reject) => {
      axios
        .get(`api/maladie/patient`)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public delete(id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      axios
        .delete(`${baseApiUrl}/${id}`)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public create(entity: IMaladie): Promise<IMaladie> {
    return new Promise<IMaladie>((resolve, reject) => {
      axios
        .post(`${baseApiUrl}`, entity)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public uploadModel(maladieId: number, formData: FormData): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios
        .post(`${baseApiUrl}/uploadModel/${maladieId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public update(entity: IMaladie): Promise<IMaladie> {
    return new Promise<IMaladie>((resolve, reject) => {
      axios
        .put(`${baseApiUrl}/${entity.id}`, entity)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public partialUpdate(entity: IMaladie): Promise<IMaladie> {
    return new Promise<IMaladie>((resolve, reject) => {
      axios
        .patch(`${baseApiUrl}/${entity.id}`, entity)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
