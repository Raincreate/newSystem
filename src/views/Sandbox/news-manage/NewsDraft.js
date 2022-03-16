import React, { useState,useEffect } from 'react'
import {Table,Button,Modal,notification } from 'antd'
import axios from 'axios'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
const {confirm} =Modal

export default function NewsDraft(props) {
  const [dataSource,setDataSource] =useState([])

  const {username} =JSON.parse(localStorage.getItem("token"))

  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res)=>{
      const list =res.data
      setDataSource(list)
    })
  },[username])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id) =>{
        return <b>{id}</b>
      }
    },
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
            {/* 更新按钮 */}
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
              props.history.push(`/news-manage/update/${item.id}`)
            }} />

            {/* 删除按钮 */}
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={()=>del(item)} />

            {/* 提交审核按钮 */}
            <Button type="primary" shape="circle" icon={<CloudUploadOutlined />} onClick={()=>{handleCheck(item.id)}} />
          </div>
        ) 
      }
    },
  ];

  const handleCheck=(id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then((res)=>{
      props.history.push('/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以在审核列表中查看您的新闻！`,
        placement:"bottom-right",
      });
    })
  }


  const del= (item) =>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '当你点击OK按钮0.5秒钟后将会删除',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 1 ? resolve : reject, 500);
        }).catch(() => finallyDel(item));
      },
      onCancel() {},
    });
  }

  const finallyDel = (item) =>{

      setDataSource(dataSource.filter(data => data.id!== item.id))
      //通过filter筛选出需要删除的元素，将其他的元素进行渲染
      axios.delete(`/news/${item.id}`)

  }
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={item=> item.id} />;
      {/* pagination是用来配置表格一页有几项的 */}
    </div>
  )
}
