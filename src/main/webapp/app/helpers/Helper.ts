import axios from 'axios';

export async function refreshStorage() {
  const response = await axios.get('api/account');
  delete response.data.patient.photo;
  for (let i = 0; i < response.data.patient.rendezVous.length; i++) {
    delete response.data.patient.rendezVous[i].medecin.photo;
    delete response.data.patient.rendezVous[i].patient.photo;
  }
  sessionStorage.setItem('user-info', JSON.stringify(response.data));
}
