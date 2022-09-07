// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import Login from '../pages/Login'
import About from '../pages/Home'
//引入子级组件
import Basic from '../pages/menu/Basic'
import Cpu from '../pages/menu/Cpu'
import Mem from '../pages/menu/Mem'
import Net from '../pages/menu/Net'
import Set from '../pages/menu/Set'
//创建并暴露一个路由器
const router = new VueRouter({
    routes: [
        {
            name: 'loginpage',
            path: '/login',
            component: Login,
            meta: { title: '登录' },

        },
        {
            name: 'homepage',
            path: '/home',
            component: About,
            meta: { isAuth: true, title: '主页' },
            children: [{
                name: 'basicpage',
                path: 'basic',
                component: Basic,
                meta: { title: '基本信息' }
            }, {
                name: 'cpupage',
                path: 'cpu',
                component: Cpu,
                meta: { title: 'cpu信息', keepAlive: true }
            }, {
                name: 'mempage',
                path: 'mem',
                component: Mem,
                meta: { title: '存储信息' }
            }, {
                name: 'setpage',
                path: 'set',
                component: Set,
                meta: { title: '设置' }
            }, {
                name: 'netpage',
                path: 'net',
                component: Net,
                meta: { title: '网络信息' }
            }]
        }
    ]
})
// //全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
// router.beforeEach((to,from,next)=>{
// 	console.log('前置路由守卫',to,from)
// 	if(to.meta.isAuth){ //判断是否需要鉴权
// 		if(localStorage.getItem('school')==='atguigu'){
// 			next()
// 		}else{
// 			alert('学校名不对，无权限查看！')
// 		}
// 	}else{
// 		next()
// 	}
// })

// //全局后置路由守卫————初始化的时候被调用、每次路由切换之后被调用
// router.afterEach((to,from)=>{
// 	console.log('后置路由守卫',to,from)
// 	document.title = to.meta.title || '硅谷系统'
// })

export default router