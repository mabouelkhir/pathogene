import { Component, Provide, Vue } from 'vue-property-decorator';

import UserService from '@/entities/user/user.service';
import ClassificationService from './classification/classification.service';
import CompteService from './compte/compte.service';
import DetectionService from './detection/detection.service';
import ImageService from './image/image.service';
import MaladieService from './maladie/maladie.service';
import MedecinService from './medecin/medecin.service';
import PatientService from './patient/patient.service';
import RendezVousService from './rendez-vous/rendez-vous.service';
import SecretaireService from './secretaire/secretaire.service';
import StadeService from './stade/stade.service';
import UnclassifiedService from './unclassified/unclassified.service';
import VisiteService from './visite/visite.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

@Component
export default class Entities extends Vue {
  @Provide('userService') private userService = () => new UserService();
  @Provide('classificationService') private classificationService = () => new ClassificationService();
  @Provide('compteService') private compteService = () => new CompteService();
  @Provide('detectionService') private detectionService = () => new DetectionService();
  @Provide('imageService') private imageService = () => new ImageService();
  @Provide('maladieService') private maladieService = () => new MaladieService();
  @Provide('medecinService') private medecinService = () => new MedecinService();
  @Provide('patientService') private patientService = () => new PatientService();
  @Provide('rendezVousService') private rendezVousService = () => new RendezVousService();
  @Provide('secretaireService') private secretaireService = () => new SecretaireService();
  @Provide('stadeService') private stadeService = () => new StadeService();
  @Provide('unclassifiedService') private unclassifiedService = () => new UnclassifiedService();
  @Provide('visiteService') private visiteService = () => new VisiteService();
  // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
}
