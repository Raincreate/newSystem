import React, { useEffect } from 'react'
import SideMenu from '../../components/SandboxTwo/SideMenu'
import TopHeader from '../../components/SandboxTwo/TopHeader'
import NewsRouter from '../../components/SandboxTwo/NewsRouter';
import { Layout } from 'antd';
import './index.css'
import Nprogress from 'nprogress'
import   'nprogress/nprogress.css';

const {Content } =Layout

// 可以将其看作是一个中转的组件   组件包含侧边栏组件、顶部组件、以及各个路由的组件
export default function Sandbox() {
  // 加载进度条
  Nprogress.start()

  useEffect(()=>{
    Nprogress.done()
    // 关闭加载的进度条
  })

  return (
    <Layout>
        <SideMenu/>
        <Layout className="site-layout">
          <TopHeader/>

          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              overflow:'auto'
            }}
          >
            <NewsRouter></NewsRouter>
          </Content>
        </Layout>
    </Layout>
  )
}
