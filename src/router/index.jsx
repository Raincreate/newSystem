import React from 'react'
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import Login from '../views/Login/index'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
import Sandbox from '../views/Sandbox/index'

export default function index() {
  return (
    <HashRouter>
        <Switch>            
            {/* 管理员登录的组件 */}
            <Route path='/login' component={Login}/>

            {/* 游客访问的新闻界面组件 */}
            <Route path='/news' component={News}/>

            {/* 游客访问的新闻具体写了什么的组件 */}
            <Route path='/detail/:id' component={Detail}/>
            
            {/* <Route path='/' component={Sandbox}/> */}
            <Route path='/' render={()=> localStorage.getItem("token") ?
               <Sandbox></Sandbox> : <Redirect to='/login'/>}/>
        </Switch>
    </HashRouter>
  )
}
