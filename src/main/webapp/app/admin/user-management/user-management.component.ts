import { Component, Inject, Vue, Watch } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import UserManagementService from './user-management.service';
import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class JhiUserManagementComponent extends Vue {
  @Inject('userManagementService') private userManagementService: () => UserManagementService;
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('accountService') private accountService: () => AccountService;

  public error = '';
  public success = '';
  public users: any[] = [];
  public allUsers: any[] = [];
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;
  public isLoading = false;
  public removeId: number = null;
  public searchQuery = '';

  public mounted(): void {
    this.loadAll();
  }

  public setActive(user, isActivated): void {
    user.activated = isActivated;
    this.userManagementService()
      .update(user)
      .then(() => {
        this.error = null;
        this.success = 'OK';
        this.loadAll();
      })
      .catch(() => {
        this.success = null;
        this.error = 'ERROR';
        user.activated = false;
      });
  }

  public loadAll(): void {
    this.isLoading = true;

    this.userManagementService()
      .retrieve({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .then(res => {
        this.isLoading = false;
        this.users = res.data;
        this.allUsers = res.data;
        this.totalItems = Number(res.headers['x-total-count']);
        this.queryCount = this.totalItems;
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  get filteredUsersPatient() {
    // Filter out users with 'PATIENT' authority
    return this.users.filter(user => user.authorities.includes('PATIENT'));
  }

  get filteredUsersNotPatient() {
    return this.users.filter(user => !user.authorities.includes('PATIENT'));
  }

  public handleSyncList(): void {
    this.loadAll();
  }

  public sort(): any {
    const result = [this.propOrder + ',' + (this.reverse ? 'desc' : 'asc')];
    if (this.propOrder !== 'id') {
      result.push('id');
    }
    return result;
  }

  public loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  public transition(): void {
    this.loadAll();
  }

  public changeOrder(propOrder: string): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public deleteUser(): void {
    this.userManagementService()
      .remove(this.removeId)
      .then(res => {
        const message = this.$t(res.headers['x-pathogeneapp-alert'], {
          param: decodeURIComponent(res.headers['x-pathogeneapp-params'].replace(/\+/g, ' ')),
        });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.loadAll();
        this.closeDialog();
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public prepareRemove(instance): void {
    this.removeId = instance.login;
    if (<any>this.$refs.removeUser) {
      (<any>this.$refs.removeUser).show();
    }
  }

  public closeDialog(): void {
    if (<any>this.$refs.removeUser) {
      (<any>this.$refs.removeUser).hide();
    }
  }

  public get username(): string {
    return this.$store.getters.account?.login ?? '';
  }

  public isMedecin(): boolean {
    return this.accountService().userAuthorities.includes('MEDECIN');
  }

  public isSecretaire(): boolean {
    return this.accountService().userAuthorities.includes('SECRETAIRE');
  }

  public isAdmin(): boolean {
    return this.accountService().userAuthorities.includes('ROLE_ADMIN');
  }

  @Watch('searchQuery')
  onSearchQueryChanged(value: string, oldValue: string) {
    // Filtrer les patients chaque fois que searchQuery change
    this.searchUsers();
  }

  public searchUsers(): void {
    if (this.searchQuery !== '') {
      const searchQueryLowerCase = this.searchQuery.toLowerCase();
      this.users = this.allUsers.filter(user => {
        const login = user.login.toLowerCase();
        const email = user.email.toLowerCase();

        return login.includes(searchQueryLowerCase) || email.includes(searchQueryLowerCase);
      });
    } else {
      this.users = this.allUsers;
    }
  }
}
