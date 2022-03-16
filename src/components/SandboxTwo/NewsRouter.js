import React, { useEffect, useState } from 'react'
import Home from '../../views/Sandbox/Home/index.jsx'
import UserList from '../../views/Sandbox/User-manege/index'
import RightList from '../../views/Sandbox/right-manage/RigthList'
import RoleList from '../../views/Sandbox/right-manage/RoleList'
import NotFound from '../../views/Sandbox/NotFound/index'
import {Switch ,Route, Redirect} from 'react-router-dom'
import NewsDraft from '../../views/Sandbox/news-manage/NewsDraft.js'
import NewsAdd from '../../views/Sandbox/news-manage/NewsAdd.js'
import Sunset from '../../views/Sandbox/publish-manage/Sunset.js'
import Published from '../../views/Sandbox/publish-manage/Published.js'
import Unpublished from '../../views/Sandbox/publish-manage/Unpublished.js'
import Audit from '../../views/Sandbox/audit-manage/Audit.js'
import AuditList from '../../views/Sandbox/audit-manage/AuditList.js'
import axios from 'axios'
import NewsPreviews from '../../views/Sandbox/news-manage/NewsPreviews.js'
import NewsUpdate from '../../views/Sandbox/news-manage/NewsUpdate.js'


// 这里是所有的路由的路径以及对应的组件
const LocalRouterMap ={
    "/home":Home,
    "/user-manage/list":UserList,
    "/right-manage/role/list":RoleList,
    "/right-manage/right/list":RightList,
    '/news-manage/add':NewsAdd,
    '/news-manage/draft':NewsDraft,
    '/news-manage/preview/:id':NewsPreviews,
    '/news-manage/update/:id':NewsUpdate,
    '/audit-manage/audit':Audit,
    '/audit-manage/list':AuditList,
    '/publish-manage/unpublished':Unpublished,
    '/publish-manage/published':Published,
    '/publish-manage/sunset':Sunset,
}


export default function NewsRouter() {

    const [backRouteList,setbackRouteList] =useState([])

    useEffect(()=>{
        Promise.all([
            // axios请求信息
            axios.get('/rights'),
            axios.get('/children'),
        ]).then(res=>{
            // console.log(res);
            // 将所有的列表全部合并之后更新，使backRouteList得到想要的左侧边框的内容
            setbackRouteList([...res[0].data,...res[1].data])
            // console.log([...res[0].data,...res[1].data]);
        })
    },[])


    return (
        <Switch>
            {
                backRouteList.map( (item)  =>{

                    return <Route path ={item.key}  key ={item.key}  component={LocalRouterMap[item.key]} exact />
                })
            }

            {/* 这个是不使用遍历自己手动写的，也可以实现想要的效果，但是代码量太多，不建议使用
            <Route path='/home' component={Home} />
            <Route path='/user-manage/list' component={UserList} />
            <Route path='/right-manage/role/list' component={RoleList} />
            <Route path='/right-manage/right/list' component={RightList} />
            <Route path='/news-manage/add' component={NewsAdd} />
            <Route path='/news-manage/draft' component={NewsDraft} />
            <Route path='/news-manage/categorye' component={NewsCategory} />
            <Route path='/audit-manage/audit' component={Audit} />
            <Route path='/audit-manage/list' component={AuditList} />
            <Route path='/publish-manage/unpublished' component={Unpublished} />
            <Route path='/publish-manage/published' component={Published} />
            <Route path='/publish-manage/sunset' component={Sunset} /> */}

            {/* 重定位到home */}
            <Redirect from='/' to='/home' exact/>
            {/* 如果页面无法加载的话，就显示404页面 */}
            <Route path='*' component={NotFound} />
        </Switch>
    )
}
