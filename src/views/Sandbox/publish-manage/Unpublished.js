import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Table,Button,notification } from 'antd'

export default function Unpublished() {

  const [dataSource,setDataSource] =useState([])

  const {username} =JSON.parse(localStorage.getItem("token"))

  useEffect(()=>{
    axios(`/news?author=${username}&publishState=1&_expand=category`).then(res=>{
      // console.log(res.data);
      setDataSource(res.data)
    })
  },[username])


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
            <Button type='primary' onClick={()=> handlePublish(item)}  >发布</Button>
          </div>
        ) 
    }
    },
  ];


  const handlePublish =(item) =>{
      // console.log(item.id);
      setDataSource(dataSource.filter(data =>data.id !== item.id))
      // console.log(item.publishState);

      axios.patch(`/news/${item.id}`,{
        publishState:2
      }).then(res=>{
        notification.info({
          message: `通知`,
          description:
            `您可以在发布管理-已发布中查看您的新闻！`,
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
