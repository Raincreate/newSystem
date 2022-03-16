import React, { useState,useEffect } from 'react'
import { Button,Table,Modal,Tree } from 'antd'
import axios from 'axios'
import {
  OrderedListOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;


export default function RoleList() {
  const [dataSource,setDataSource] =useState([])
  //整体数据其请求等的维护

  const [rightList,setRightList] =useState([])
  //权限数据的更新

  const [roleList,setroleList] =useState([])
  //维护树节点的更新等（也就是能够勾选与取消勾选）

  const [currendId,setcurrendId] =useState(0)
  //维护权限的id

  const [isModalVisible,setisModalVisible] =useState(false)
  //权限分配弹出框的隐藏与显示状态维护

  useEffect(()=>{
    axios.get('/roles').then((res) =>{
      setDataSource(res.data)
    })
  },[])
  //请求后端数据，将后端的数据逐一匹配更新

  //请求权限分配，当拿到权限之后进行更新
  useEffect(()=>{
    axios.get('/rights?_embed=children').then((res) =>{
      setRightList(res.data)
    })
  },[])

  const onCheck =(onCheck)=>{
    // console.log(onCheck);
    setroleList(onCheck)
  }


  const columns =[
    {
      title:'ID',
      dataIndex:'id',
      render:(id) =>{
        return <b>{id}</b>
      }
      // 页面效果
    },
    {
      title:'角色名称',
      dataIndex:'roleName'
    },
    {
      title:'操作',
      render:(item)=>{
        return(
          <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={()=>{ dele(item) }} />
            {/* 删除按钮 点击之后会显示出相应的内容 */}

            <Button type="primary" shape="circle" icon={<OrderedListOutlined />} onClick={()=>{
              setisModalVisible(true) ; setroleList(item.rights) ; setcurrendId(item.id)
            }} />

            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
              checkable
              checkedKeys={roleList}
              onCheck={onCheck}
              treeData={rightList}
            />
            </Modal>
          </div>
        )
      }
    }
  ]


  const dele =(item) =>{
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <Button>单击删除全部</Button>,
      onOk() {
        allDelete(item)
      },
      onCancel() {
      },
    });
  }

  //真正的删除函数  
  const allDelete = (item) =>{
    // console.log(item)
    setDataSource(dataSource.filter(data =>data.id !==item.id))
    //选出和条件不相符的元素，这些元素重新渲染的结果，就相当于删除了我们想要删除的元素
    axios.delete(`/roles/${item.id}`)
  }

  const handleCancel =()=>{
    //点击取消后隐藏弹出框
    setisModalVisible(false)
  }

  const handleOk = () =>{
    setisModalVisible(false)
    setDataSource(dataSource.map((item)=>{
      if(item.id === currendId){
        return{
          ...item,
          rights:roleList
        }
      }
      return item
    }))
    //维护状态，当将权限中的状态发生改变的时候，更新维护相应的状态
    axios.patch(`/roles/${currendId}`,{
      rights:roleList
    })
    //前端页面更改效果使之与后端数据保持一致
  }

  return (
    <div>
      {/* 显示出的表格 */}
      <Table columns={columns} dataSource={dataSource} rowKey={item=>item.id} />
    </div>
  )
}
