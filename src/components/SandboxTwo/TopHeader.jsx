import React from 'react'
import { Layout,Menu,Dropdown,Avatar } from 'antd';
import {withRouter} from 'react-router-dom'
const {  Header } = Layout;

// 这个是最顶部的位置组件
function TopHeader(props) {

  const {role:{roleName},username} =JSON.parse(localStorage.getItem("token"))

  const menu = (
    <Menu>
      <Menu.Item  >
        {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={()=>{
        localStorage.removeItem("token");
        // console.log(props.history);
        // 切换到login登录界面，进行登录
        props.history.replace('/login')
      }} >退出</Menu.Item>
    </Menu>
  );


  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      <div style={{float:"right"}}>
        <span>  欢迎{username}回来</span>   
        <Dropdown overlay={menu}>
          {/* Avatar是退出登录的头像 */}
          <Avatar src="https://joeschmoe.io/api/v1/random" />
        </Dropdown>
      </div>
    </Header>
  )
}

export default withRouter(TopHeader)
