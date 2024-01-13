import { createRouter, createWebHistory } from 'vue-router'

import Projects from '@/views/Projects.vue';
// import Well from '@/views/Well.vue';
// import NewWell from '@/views/NewWell.vue';

import Carpet from '@/views/Carpet.vue';
import Dashboard from '@/views/Dashboard.vue';
import DrillingMovementTable from '@/views/DrillingMovementTable.vue';
import DrillsList from '@/views/DrillsList.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Projects',
      component: Projects,
      meta: {root: 'Projects'}
    },
    {
      path: '/drillsList',
      name: 'DrillsList',
      component: DrillsList,
      meta: {root: 'DrillsList', verboseName: 'Загрузка буровых станков', carpetControls: true}
    },
    {
      path: '/:projId/carpet',
      name: 'Carpet',
      component: Carpet,
      meta: {root: 'Carpet', verboseName: 'Реализация проекта', carpetControls: true},
      props: true
    },
    {
      path: '/:projId/drillingMovementTable',
      name: 'DrillingMovementTable',
      component: DrillingMovementTable,
      meta: {root: 'DrillingMovementTable', verboseName: 'График бурения и движения БУ'},
      props: true
    },
    {
      path: '/:projId/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {root: 'Dashboard', verboseName: 'Аналитика'},
      props: true
    },
  ]
})

export default router
