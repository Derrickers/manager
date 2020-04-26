import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import Servers from "@/components/servers/Servers";
import Repairs from "@/components/workOrders/Repairs";
import Detects from "@/components/workOrders/Detects";
import DeviceErrorCode from "@/components/devices/DeviceErrorCode";
import DeviceClassification from "@/components/devices/DeviceClassification";
import AssetDevice from "@/components/devices/AssetDevice";
import AccessoryType from "@/components/devices/AccessoryType";
import AccessoryDevice from "@/components/devices/AccessoryDevice";
import UnAssetType from "@/components/devices/UnAssetType";
import UnAssetDevice from "@/components/devices/UnAssetDevice";
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },{
    path: '/',
    redirect:'/login'
  },{
    path:'/home',
    component:Home,
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/servers',component:Servers},
      {path:'/repairs',component:Repairs},
      {path:'/detects',component:Detects},
      {path:'/codes',component:DeviceErrorCode},
      {path:'/classification',component:DeviceClassification},
      {path:'/asset',component:AssetDevice},
      {path:'/accessoryType',component:AccessoryType},
      {path:'/accessoryDevice',component:AccessoryDevice},
      {path:'/unAssetType',component:UnAssetType},
      {path:'/unAssetDevice',component:UnAssetDevice},
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login')
    return next();
  if(!window.sessionStorage.getItem('token'))
    return next('/login');
  next();
})
export default router
