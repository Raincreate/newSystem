import React, { useEffect, useState } from 'react'
import { Card, Col, Row ,List } from 'antd';
import axios from 'axios';

export default function Home() {
  const [viewList,setViewList]=useState([])

  const [starList,setstarListt]=useState([])


  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=8").then((res)=>{
      setViewList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=8").then((res)=>{
      setstarListt(res.data)
    })
  },[])

  return (
    <div className="site-card-wrapper">
    <Row gutter={16}>
      <Col span={12}>
        <Card title="用户最常浏览" bordered={true}>
          <List
            dataSource={viewList}
            renderItem={item => (
              <List.Item>
                <a href={`#/news-manage/preview/${item.id}`} >{item.title}</a>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="用户点赞数" bordered={true}>
          <List
            dataSource={starList}
            renderItem={item => (
              <List.Item>
                <a href={`#/news-manage/preview/${item.id}`} >{item.title}</a>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  </div>
  )
}
