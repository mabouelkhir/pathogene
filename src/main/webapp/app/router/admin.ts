import { Authority } from '@/shared/security/authority';

const JhiUserManagementComponent = () => import('@/admin/user-management/user-management.vue');
const JhiUserManagementViewComponent = () => import('@/admin/user-management/user-management-view.vue');
const JhiUserManagementEditComponent = () => import('@/admin/user-management/user-management-edit.vue');
const JhiDocsComponent = () => import('@/admin/docs/docs.vue');
const JhiConfigurationComponent = () => import('@/admin/configuration/configuration.vue');
const JhiHealthComponent = () => import('@/admin/health/health.vue');
const JhiLogsComponent = () => import('@/admin/logs/logs.vue');
const JhiMetricsComponent = () => import('@/admin/metrics/metrics.vue');
const AddMedecins = () => import('@/admin/user-management/medecins/add-medecins.vue');
const AddSecretaires = () => import('@/admin/user-management/secretaires/add-secretaires.vue');
const AddPatients = () => import('@/admin/user-management/patients/add-patients.vue');

export default [
  {
    path: '/secretary/add-patient',
    name: 'AddPatients',
    component: AddPatients,
    meta: { authorities: [Authority.SECRETAIRE] },
  },
  {
    path: '/admin/add-medecin',
    name: 'AddMedecins',
    component: AddMedecins,
    meta: { authorities: [Authority.ADMIN] },
  },
  {
    path: '/admin/add-secretaire',
    name: 'AddSecretaires',
    component: AddSecretaires,
    meta: { authorities: [Authority.ADMIN] },
  },
  {
    path: '/admin/user-management',
    name: 'JhiUser',
    component: JhiUserManagementComponent,
    meta: { authorities: [Authority.ADMIN, Authority.SECRETAIRE] },
  },
  {
    path: '/admin/user-management/new',
    name: 'JhiUserCreate',
    component: JhiUserManagementEditComponent,
    meta: { authorities: [Authority.ADMIN, Authority.SECRETAIRE] },
  },
  {
    path: '/admin/user-management/:userId/edit',
    name: 'JhiUserEdit',
    component: JhiUserManagementEditComponent,
    meta: { authorities: [Authority.ADMIN, Authority.SECRETAIRE] },
  },
  {
    path: '/admin/user-management/:userId/view',
    name: 'JhiUserView',
    component: JhiUserManagementViewComponent,
    meta: { authorities: [Authority.ADMIN, Authority.SECRETAIRE] },
  },
  {
    path: '/admin/docs',
    name: 'JhiDocsComponent',
    component: JhiDocsComponent,
    meta: { authorities: [Authority.ADMIN, Authority.MEDECIN, Authority.SECRETAIRE] },
  },
  {
    path: '/admin/health',
    name: 'JhiHealthComponent',
    component: JhiHealthComponent,
    meta: { authorities: [Authority.ADMIN] },
  },
  {
    path: '/admin/logs',
    name: 'JhiLogsComponent',
    component: JhiLogsComponent,
    meta: { authorities: [Authority.ADMIN] },
  },
  {
    path: '/admin/metrics',
    name: 'JhiMetricsComponent',
    component: JhiMetricsComponent,
    meta: { authorities: [Authority.ADMIN] },
  },
  {
    path: '/admin/configuration',
    name: 'JhiConfigurationComponent',
    component: JhiConfigurationComponent,
    meta: { authorities: [Authority.ADMIN] },
  },
];
