import React,{useEffect,useState} from 'react'
import { Layout, Menu } from 'antd';
import './index.css'
import {withRouter} from 'react-router-dom'
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import axios from 'axios'
const {  Sider } = Layout;
const { SubMenu } = Menu;

//左侧导航栏的图标
const iconList ={
  '/home':<UserOutlined />,
  '/user-manage':<UserOutlined />,
  '/right-manage':<DesktopOutlined />,
  '/news-manage':<DesktopOutlined />,
  '/audit-manage':<DesktopOutlined />,
  '/publish-manage':<PieChartOutlined />,
  '/user-manage/list':<UploadOutlined />,
  '/right-manage/role/list':<UploadOutlined />,
  '/right-manage/right/list':<UploadOutlined />,
  '/news-manage/add':<UploadOutlined />,
  '/news-manage/draft':<UploadOutlined />,
  '/audit-manage/audit':<UploadOutlined />,
  '/audit-manage/list':<UploadOutlined />,
  '/publish-manage/unpublished':<UploadOutlined />,
  '/publish-manage/published':<UploadOutlined />,
  '/publish-manage/sunset':<UploadOutlined />,
}

//获取左侧导航栏中的文字信息
function SideMenu(props) {
  // 更新状态
  const [menu,setMenu] =useState([])

  useEffect(()=>{
    // 请求的是所有的左侧列表的所有信息，如果成功了就使用setMenu更新状态值
    axios.get("/rights?_embed=children").then(res=>{
      setMenu(res.data)
    })
  },[])

  // 获取到json-server中rights列表的值  这些值就是左侧列表的第一个子节点的值
  const {role:{rights}} =JSON.parse(localStorage.getItem("token"))

  const checkPer =((item)=>{
    return item.pagepermisson   && rights.includes(item.key)
    // item.pagepermisson判断是否渲染，当他是true的时候渲染左侧列表，反之不渲染
  })
  //下拉列的功能函数，保证下拉列得到想要的结果

  // 这个函数是将拿到的数据首先进行遍历，在遍历的时候做出判断，如果他有孩子并且pagepermisson为真，rights列表中包含路径，那么就将他渲染，并且在渲染过后再次递归调用；如果没有孩子直接渲染
  const rendeMenu =(menuList)=>{
    return menuList.map(item =>{
      // console.log(item.children)
      if(item.children?.length>0 && checkPer(item)){
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                {rendeMenu(item.children)}
                {/* 调用了递归的方法，最简单 */}
               </SubMenu>
      }
      return checkPer(item) && <Menu.Item key={item.key} icon={iconList[item.key]}
        onClick={()=>{ props.history.push(item.key)}}
        // 调用onClick函数，当点击的时候，跳转到相应的页面（因为key所以才可以跳转到想去的页面）
      >{item.title}</Menu.Item>
    })
  }

  // 获取的是当前你鼠标点击所在的位置的路径
  const selectKey =[props.location.pathname]
  // console.log(props.location.pathname);

  const openKey =['/'+props.location.pathname.split('/')[1]]
  //这里设置这两个const的目的是为了让页面即使刷新也能保持不变


  return (
    <Sider trigger={null} collapsible >
      <div style={{display:'flex',height:'100%','flexDirection':'column'}}>
        <div className="logo" >新闻发布管理系统</div>
        <div style={{flex:1,"overflow":'auto'}}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKey} defaultOpenKeys={openKey}>
            {
              rendeMenu(menu)
            }
            {/* 通过遍历得到左侧边栏的结构 */}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

//withRouter的作用是让SideMenu拿到组件的props   高阶组件获取低阶组件，生成高阶组件，从而让低阶组件拿到所有的props对象值
export default withRouter(SideMenu)