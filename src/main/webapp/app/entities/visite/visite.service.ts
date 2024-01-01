import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { IVisite } from '@/shared/model/visite.model';

const baseApiUrl = 'api/visites';

export default class VisiteService {
  public find(id: number): Promise<IVisite> {
    return new Promise<IVisite>((resolve, reject) => {
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

  public retrieveVisitesForPatient(req?: any): Promise<any> {
    return new Promise(resolve => {
      axios
        .get(`api/visites/patient?${buildPaginationQueryOpts(req)}`)
        .then(res => {
          resolve(res);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  public retrieveVisitesForMedecin(req?: any): Promise<any> {
    return new Promise(resolve => {
      axios
        .get(`api/visite/medecin?${buildPaginationQueryOpts(req)}`)
        .then(res => {
          resolve(res);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  public retrieveForPat(id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      axios
        .get(`${baseApiUrl}/${id}/patient`)
        .then(res => {
          resolve(res);
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

  public create(entity: IVisite): Promise<IVisite> {
    return new Promise<IVisite>((resolve, reject) => {
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

  public update(entity: IVisite): Promise<IVisite> {
    return new Promise<IVisite>((resolve, reject) => {
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

  public partialUpdate(entity: IVisite): Promise<IVisite> {
    return new Promise<IVisite>((resolve, reject) => {
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
