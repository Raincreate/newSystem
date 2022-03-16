import React, { useState,useEffect } from 'react'
import {Table,Tag,Button,Modal,Popover, Switch } from 'antd'
import axios from 'axios'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const {confirm} =Modal

export default function RigthList() {
  const [dataSource,setDataSource] =useState([])

  useEffect(()=>{
    axios.get('/rights?_embed=children').then((res)=>{
      const list =res.data
      list.forEach(item => {
        if(item.children.length === 0)
          item.children=""
      });
      setDataSource(list)
    })
  },[])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id) =>{
        return <b>{id}</b>
      }
    },
    {
      title:"权限名称",
      dataIndex:"title"
    },
    {
      title:"权限路径",
      dataIndex:"key",
      render:(key)=>{
        return <Tag color='blue'>{key}</Tag>
      }
    },
    {
      title:"操作",
      render:(item)=>{
        return (
          <div>
            <Popover content={
              <div style={{textAlign:"center"}}>
                <Switch checked={item.pagepermisson} onChange={()=>{switchMethod(item)}} ></Switch>
              </div>} 
              title="配置项" trigger={item.pagepermisson ===undefined ? '' : 'hover'} >
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson ===undefined} />
            </Popover>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={()=>del(item)} />
          </div>
        ) 
      }
    },
  ];

  const switchMethod =(item) =>{
    item.pagepermisson =!item.pagepermisson
    setDataSource([...dataSource])

    if(item.grade === 1){
      axios.patch(`/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }

  const del= (item) =>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '当你点击OK按钮一秒钟后将会删除',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 1 ? resolve : reject, 1000);
        }).catch(() => finallyDel(item));
      },
      onCancel() {},
    });
  }

  const finallyDel = (item) =>{
    // console.log(item);
    if(item.grade === 1){
      setDataSource(dataSource.filter(data => data.id!== item.id))
      //通过filter筛选出需要删除的元素，将其他的元素进行渲染
      axios.delete(`/rights/${item.id}`)
      //一级列表的删除方法
    }else{
      //通过获取上一级列表，列表的孩子再次筛选，将需要删除的元素筛选出list，这时的dataSource也会相应的做出改变
      let list =dataSource.filter(data =>data.id === item.rightId)
      list[0].children =list[0].children.filter(data => data.id!==item.id)
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  }
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}}/>;
      {/* pagination是用来配置表格一页有几项的 */}
    </div>
  )
}
