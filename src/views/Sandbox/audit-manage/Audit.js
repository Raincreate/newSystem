import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { Table,Button,notification } from 'antd'



export default function Audit() {
  const [dataSource,setDataSource] = useState([])

  const {roleId,region,username} =JSON.parse(localStorage.getItem("token"))

  //从json-server获取用户的所有信息
  useEffect(()=>{
    axios.get('/news?auditState=1&_expand=category').then((res)=>{
      //roleId等于1代表的是系统管理员，roleId等于2代表的是城市管理员，roleId等于3代表的是城市编辑，roleId等于4代表的是报社编辑
      setDataSource(roleId === 1 ? res.data:[
        ...res.data.filter(item =>item.author === username),
        ...res.data.filter(item=> item.region ===region && item.roleId === 4)
      ])
    })
  },[roleId,region,username])


  const columns = [
    {
      title:"新闻标题",
      dataIndex:"title",
      render:(title,item)=>{
        return <a href={`#/news-manage/preview/${item.id}`} >{title}</a>
      }
    },
    {
      title:"作者",
      dataIndex:"author",
    },
    {
      title:"新闻分类",
      dataIndex:"category",
      render:(category)=>{
        return category.title
      }
    },
    {
      title:"操作",
      render:(item)=>{
        return (
          <div>
            <Button type="primary" onClick={()=>handlePass(item,2,1)} >通过</Button>
            <Button danger onClick={()=>handlePass(item,3,0)} >驳回</Button>
          
          </div>
        ) 
      }
    },
  ];

  const handlePass =(item,auditState,publishState)=>{
    setDataSource(dataSource.filter(data =>data.id !== item.id))

    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState
    }).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `您可以在审核管理-审核列表中查看您的新闻！`,
        placement:"bottom-right",
      });
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={item=> item.id} />

    </div>
  )
}
