import { createRouter, createWebHistory } from 'vue-router'
import MainLayoutRecruitPage from '@/components/layout/MainLayoutRecruit.vue'
import CandidateList from '@/views/candidate/CandidateList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/recruit',
      component: MainLayoutRecruitPage,
      children: [
        {
          path: 'candidates',
          name: 'Candidates',
          component: CandidateList,
        },
      ],
    },
  ],
})

export default router
