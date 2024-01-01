import { Component, Vue, Inject } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IRendezVous, RendezVous } from '@/shared/model/rendez-vous.model';
import FullCalendar from '@fullcalendar/vue';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import RendezVousService from './rendez-vous.service';
import AlertService from '@/shared/alert/alert.service';
import PatientService from '@/entities/patient/patient.service';
import { IPatient } from '@/shared/model/patient.model';
import MedecinService from '@/entities/medecin/medecin.service';
import { IMedecin } from '@/shared/model/medecin.model';
import AccountService from '@/account/account.service';
import { IVisite, Visite } from '@/shared/model/visite.model';
import VisiteService from '@/entities/visite/visite.service';

const validations: any = {
  rendezVous: {
    date: {},
    heure: {},
  },
};

@Component({
  mixins: [Vue2Filters.mixin],
  validations,
  components: {
    FullCalendar,
  },
})
export default class RendezVouss extends Vue {
  @Inject('rendezVousService') private rendezVousService: () => RendezVousService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('patientService') private patientService: () => PatientService;
  @Inject('medecinService') private medecinService: () => MedecinService;
  @Inject('accountService') private accountService: () => AccountService;
  @Inject('visiteService') private visiteService: () => VisiteService;

  private rendezVouss: IRendezVous[] = [];
  private rendezVous: IRendezVous;
  private visite: IVisite;
  private idPatient: number = null;
  private idMedecin: number = null;
  private patients: IPatient[] = [];
  private medecins: IMedecin[] = [];
  private idRdv: number;

  public calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'fr',
    headerToolbar: {
      left: 'prev today next',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek',
    },
    buttonText: {
      today: "Ajourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'Liste',
    },
    hiddenDays: [0],
    selectable: false,
    editable: false,
    events: [],
    select: this.selectDate,
    eventClick: this.eventClick,
    eventDrop: this.changeDate,
  };

  public mounted(): void {
    if (this.isSecretaire()) {
      this.calendarOptions.selectable = true;
      this.calendarOptions.editable = true;
      this.retrieveAllRendezVouss();
      this.retrievePatientsMedecins();
    } else if (this.isMedecin()) this.retrieveAllRendezVousMedecin();
    else if (this.isPatient()) this.retrieveAllRendezVousPatient();
  }

  // recuperer tous les rdvs
  public async retrieveAllRendezVouss() {
    try {
      this.idRdv = null;
      this.idPatient = null;
      this.idMedecin = null;
      this.calendarOptions.events = [];
      this.rendezVous = new RendezVous();
      const ev = await this.rendezVousService().retrieve();
      this.rendezVouss = ev.data;
      if (this.rendezVouss != null) {
        for (let i = 0; i < this.rendezVouss.length; i++) {
          if (this.rendezVouss[i].status == 'pending' || this.rendezVouss[i].status == 'accepted') {
            if (this.validDate(new Date(this.rendezVouss[i].date))) {
              this.calendarOptions.events.push({
                id: this.rendezVouss[i].id,
                title: `M: ${this.rendezVouss[i].medecin.nom} P: ${this.rendezVouss[i].patient.nom}`,
                start: this.rendezVouss[i].date,
                className: this.rendezVouss[i].status === 'accepted' ? 'accepted-event' : '',
                color: this.rendezVouss[i].status === 'accepted' ? 'green' : '',
              });
            } else {
              this.calendarOptions.events.push({
                id: this.rendezVouss[i].id,
                title: `M: ${this.rendezVouss[i].medecin.nom} P: ${this.rendezVouss[i].patient.nom}`,
                start: this.rendezVouss[i].date,
                color: 'red',
              });
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  // recuperer tous les rdvs d'un medecin
  public async retrieveAllRendezVousMedecin() {
    try {
      this.calendarOptions.events = [];
      //let medecin = JSON.parse(sessionStorage.getItem('user-info'));
      const rv = await this.rendezVousService().retrieveAllRendezVousForMedecin();
      this.rendezVouss = rv.data;
      if (this.rendezVouss != null) {
        for (let i = 0; i < this.rendezVouss.length; i++) {
          if (this.rendezVouss[i].status == 'pending' || this.rendezVouss[i].status == 'accepted')
            this.calendarOptions.events.push({
              id: this.rendezVouss[i].id,
              title: `P: ${this.rendezVouss[i].patient.nom}`,
              start: this.rendezVouss[i].date,
              className: this.rendezVouss[i].status === 'accepted' ? 'accepted-event' : '',
              color: this.rendezVouss[i].status === 'accepted' ? 'green' : '',
            });
        }
      } else
        (this.$root as any).$bvToast.toast("You don't have any appointment", {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'info',
          solid: true,
          autoHideDelay: 500,
        });
    } catch (e) {
      console.log(e);
    }
  }

  // recuperer tous les rdvs d'un patient
  public async retrieveAllRendezVousPatient() {
    try {
      this.calendarOptions.events = [];
      //let patient = JSON.parse(sessionStorage.getItem('user-info'));
      const rd = await this.rendezVousService().retrieveAllRendezVousForPatient();
      this.rendezVouss = rd.data;
      if (this.rendezVouss != null) {
        for (let i = 0; i < this.rendezVouss.length; i++) {
          if (this.rendezVouss[i].status == 'pending' || this.rendezVouss[i].status == 'accepted')
            this.calendarOptions.events.push({
              id: this.rendezVouss[i].id,
              title: `M: ${this.rendezVouss[i].medecin.nom}`,
              start: this.rendezVouss[i].date,
              className: this.rendezVouss[i].status === 'accepted' ? 'accepted-event' : '',
              color: this.rendezVouss[i].status === 'accepted' ? 'green' : '',
            });
        }
      } else
        (this.$root as any).$bvToast.toast("You don't have any appointment", {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'info',
          solid: true,
          autoHideDelay: 500,
        });
    } catch (e) {
      console.log(e);
    }
  }

  // recuperer tous les medecins et les patients
  public async retrievePatientsMedecins() {
    try {
      const dataPatients = await this.patientService().retrieve();
      const dataMedecins = await this.medecinService().retrieve();
      this.patients = dataPatients.data;
      this.medecins = dataMedecins.data;
    } catch (e) {
      console.log(e);
    }
  }

  // ajourner un rdv
  public async changeDate(selectionInfo) {
    try {
      if (this.validDate(selectionInfo.event.start)) {
        this.rendezVous = await this.rendezVousService().find(selectionInfo.event.id);
        this.rendezVous.date = selectionInfo.event.start;
        await this.rendezVousService().update(this.rendezVous);
        (this.$root as any).$bvToast.toast('A Rendez-vous is updated', {
          toaster: 'b-toaster-top-center',
          title: 'Success',
          variant: 'success',
          solid: true,
          autoHideDelay: 5000,
        });
      } else this.alertService().showError(this, 'Date incorrect');
    } catch (e) {
      console.log(e);
    }
    this.retrieveAllRendezVouss();
  }

  // sauvegarder un rdv
  public async save() {
    try {
      this.rendezVous.patient = await this.patientService().find(this.idPatient);
      this.rendezVous.medecin = await this.medecinService().find(this.idMedecin);
      const time = this.rendezVous.heure.split(':');
      this.rendezVous.date.setHours(parseInt(time[0]), parseInt(time[1]));
      this.rendezVous.status = 'pending';
      await this.rendezVousService().create(this.rendezVous);
      (<any>this.$refs.createEntity).hide();
      (this.$root as any).$bvToast.toast('A Rendez-vous is added', {
        toaster: 'b-toaster-top-center',
        title: 'Success',
        variant: 'success',
        solid: true,
        autoHideDelay: 5000,
      });
      this.retrieveAllRendezVouss();
    } catch (e) {
      console.log(e);
    }
  }

  // valider un rdv => visite
  public async valideRendezVous() {
    try {
      this.rendezVous = await this.rendezVousService().find(this.idRdv);
      this.rendezVous.status = 'passed';
      await this.rendezVousService().update(this.rendezVous);
      this.closeDialog();
      (this.$root as any).$bvToast.toast('A Rendez-vous is confirmed', {
        toaster: 'b-toaster-top-center',
        title: 'Success',
        variant: 'success',
        solid: true,
        autoHideDelay: 5000,
      });
      this.visite = new Visite();
      this.visite.rendezVous = this.rendezVous;
      this.visite.date = this.rendezVous.date;
      const res = await this.visiteService().create(this.visite);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
    this.retrieveAllRendezVouss();
  }

  // annuler un rdv
  public async removeRendezVous() {
    try {
      await this.rendezVousService().delete(this.idRdv);
      this.$bvToast.toast('A Rendez-vous is deleted', {
        toaster: 'b-toaster-top-center',
        title: 'Success',
        variant: 'success',
        solid: true,
        autoHideDelay: 5000,
      });
    } catch (e) {
      console.log(e);
    }
    this.retrieveAllRendezVouss();
    this.closeDialog();
  }

  // evenement du click sur un rdv
  public eventClick(selectionInfo) {
    if (this.isSecretaire()) {
      this.idRdv = selectionInfo.event.id;
      (<any>this.$refs.removeEntity).show();
    }
  }

  // evenement du selection d'un jour
  public selectDate(selectionInfo): void {
    if (this.validDate(selectionInfo.start)) {
      this.rendezVous.date = selectionInfo.start;
      (<any>this.$refs.createEntity).show();
    } else this.alertService().showError(this, 'Date incorrect');
  }

  // verification de la validation d'une date choisit
  public validDate(date): boolean {
    console.log(new Date());
    console.log(date);
    return date > new Date();
  }

  public isMedecin(): boolean {
    return this.accountService().userAuthorities.includes('MEDECIN');
  }

  public isPatient(): boolean {
    return this.accountService().userAuthorities.includes('PATIENT');
  }

  public isSecretaire(): boolean {
    return this.accountService().userAuthorities.includes('SECRETAIRE');
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
    (<any>this.$refs.createEntity).hide();
  }
}
