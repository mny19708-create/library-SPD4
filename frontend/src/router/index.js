import { createRouter, createWebHistory } from 'vue-router'

// User Views
import LoginRegister from '../views/user/LoginRegister.vue'
import UserHome from '../views/user/UserHome.vue'
import EbookCatalog from '../views/user/EbookCatalog.vue'
import EbookDetail from '../views/user/EbookDetail.vue'
import EbookReader from '../views/user/EbookReader.vue'
import UserCertificates from '../views/user/UserCertificates.vue'
import MyFavoriteBooks from '@/views/user/MyFavoriteBooks.vue'
import CategoryBooks from '@/views/user/EbookCatalog.vue'
// Admin Views
import AdminLogin from '../views/AdminLogin.vue'
import Dashboard from '../views/Dashboard.vue'
import ManageEbooks from '../views/ManageEbooks.vue'
import ManageCategories from '../views/ManageCategories.vue'
import UserManagement from '../views/ManageUsers.vue'


const routes = [
  // User Routes (គ្មានពាក្យ /user/ នាំមុខទេ គឺដូច URL របស់អ្នក)
  { path: '/', redirect: '/home' },
  { path: '/auth', name: 'LoginRegister', component: LoginRegister },
  { path: '/home', name: 'UserHome', component: UserHome },
  {
  path: '/profile',
  name: 'UserProfile',
  component: () => import('@/views/user/UserProfile.vue') // 🟢 ពិនិត្យមើល Folder Path ឱ្យត្រូវជាមួយ Component ដែលបានបង្កើត
},
  { path: '/ebook/:id', name: 'EbookDetail', component: EbookDetail,meta: { requiresAuth: true } },
  { path: '/read/:id', name: 'EbookReader', component: EbookReader ,meta: { requiresAuth: true }},
  { path: '/my-certificates', name: 'UserCertificates', component: UserCertificates },
  {path: '/categories',name: 'UserCategories',component: EbookCatalog},
  {path: '/user/category/:id', name: 'CategoryBooks', component: CategoryBooks}, 
  {path: '/user/favorites', name: 'MyFavorites', component: MyFavoriteBooks},

  

  // Admin Routes
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAdmin: true } },
  { path: '/manage-ebooks', name: 'ManageEbooks', component: ManageEbooks, meta: { requiresAdmin: true } },
  { path: '/manage-categories', name: 'ManageCategories', component: ManageCategories, meta: { requiresAdmin: true } },
  { path: '/users-progress', name: 'UserManagement', component: UserManagement, meta: { requiresAdmin: true } },
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔍 Navigation Guard ពិនិត្យ Token មុនពេលប្តូរទំព័រ
router.beforeEach((to, from, next) => {
  const adminToken = localStorage.getItem('adminToken')
  
  if (to.meta.requiresAdmin && !adminToken) {
    // បើគ្មាន Token ទេ បញ្ជូនទៅកាន់ទំព័រ Login វិញ
    next('/admin/login')
  } else {
    next()
  }
})

export default router