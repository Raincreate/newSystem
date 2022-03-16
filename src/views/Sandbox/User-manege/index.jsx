import React, { useState,useEffect,useRef } from 'react'
import { Table,Button,Switch,Modal } from 'antd'
import {
  OrderedListOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import User_manager from '../../../components/User-manager-second';
const { confirm } = Modal;


export default function UserList() {
  //更新用户的所有信息
  const [dataSource,setDataSource] = useState([])

  //维护添加用户按钮的显示与隐藏状态
  const [isvisible,setisvisible] = useState(false)
  
  //维护更新用户按钮的显示与隐藏
  const [isUpdateVisible,setisUpdateVisible] = useState(false)
  
  // 用来维护更新用户弹窗内的信息
  const [current,setcurrent] = useState(null)

  //用来更新区域旁边的筛选功能的信息状态以及添加更新用户中的区域的信息状态
  const [regionList,setregionList] = useState([])
  
  // 用来更新获取角色名称以及添加更新用户中的角色的信息状态
  const [isRoles,setisRoles] = useState([])

  const addForm =useRef(null)
  const updateForm=useRef(null)

  const {roleId,region,username} =JSON.parse(localStorage.getItem("token"))

  //从json-server获取用户的所有信息
  useEffect(()=>{
    axios.get('/users?_expand=role').then((res)=>{
      setDataSource(roleId === 1 ? res.data:[
        ...res.data.filter(item =>item.username === username),
        ...res.data.filter(item=> item.region ===region && item.roleId === 3)
      ])
    })
  },[roleId,region,username])

  // 获取所有管理员的地理位置
  useEffect(()=>{
    axios.get('/regions').then((res)=>{
      setregionList(res.data)
    })
  },[])

  // 获取管理员的角色名称
  useEffect(()=>{
    axios.get('http://localhost:5000/roles').then((res)=>{
      setisRoles(res.data)
    })
  },[])

  // 
  const columns=[
    {
      title:'区域',
      dataIndex:'region',
      filters:[
        ...regionList.map(item=>({
          text:item.title,
          value:item.value,
        })),
        {
          text:"全国",
          value:"全国"
        }
      ],

      onFilter:(value,item)=>{
        if(value === '全国'){
          return item.region ===""
        }
        return item.region === value
      },

      render:(region) =>{
        return <b>{region === '' ? '全国': region}</b>
      }
    },
    {
      title:'角色名称',
      dataIndex:'role',
      render:(role)=>{
        return role.roleName
      }
    },
    {
      title:'用户名',
      dataIndex:'username',
    },
    {
      title:'用户状态',
      dataIndex:'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default} onChange={() =>handleChange(item)} ></Switch>
      }
    },
    {
      title:'操作',
      render:(item)=>{
        return(
          <div>
            {/* 删除按钮 点击之后会显示出相应的内容 */}
            <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={()=> dele(item) } />

            <Button type="primary" shape="circle" icon={<OrderedListOutlined />} disabled={item.default} onClick={()=> handleUpdate(item)} />
          </div>
        )
      }
    }
  ]

  //更新用户列表中的所有信息
  const handleUpdate =(item)=>{

    setTimeout(() => {
      setisUpdateVisible(true)

      //拿到点击的用户数据状态
      updateForm.current.setFieldsValue(item)

    }, 0);

    setcurrent(item)
    
  }

  //更新用户状态信息
  const handleChange =((item)=>{

    item.roleState=!item.roleState
    //取反的目的主要是为了使用户状态发生改变
    setDataSource([...dataSource])
    axios.patch(`http://localhost:5000/users/${item.id}`,{
      roleState:item.roleState
    })
    //将改变的用户状态同时同步到后端
  })


  const dele =(item) =>{
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <Button>单击删除</Button>,
      onOk() {
        allDelete(item)
        //当点击ok的时候，调用allDelete函数进行删除
      },
      onCancel() {
      },
    });
  }

  //真正的删除函数  
  const allDelete = (item) =>{
    // console.log(item)
    setDataSource(dataSource.filter(data =>data.id !==item.id))
    //更新筛选数据，通过对dataSource使用filter函数，来选出没有点击的那些用户，再将这些数据通过setDataSource渲染，实现到前端的删除数据

    //选出和条件不相符的元素，这些元素重新渲染的结果，就相当于删除了我们想要删除的元素
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }

  return (
    <div>
      <Button type='primary' onClick={()=>{
        setisvisible(true)
      }} >添加用户</Button>
      <Table columns={columns} dataSource={dataSource} rowKey={item=>item.id} pagination={{pageSize:5}} />

      <Modal
        visible={isvisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel ={() =>{
          setisvisible(false)
        }}
        onOk={() => {
          addForm.current.validateFields().then(value =>{
            setisvisible(false)
            addForm.current.resetFields()
            //重置添加表格的页面

            //将添加的数据存储在后端的（假）数据库中去
            axios.post(`http://localhost:5000/users`,{
              ...value,
              "roleState":true,
              "default":false,
            }).then((res)=>{
              setDataSource([...dataSource,{
                ...res.data,
                role:isRoles.filter(item => item.id ===value.roleId)[0]
                //解决添加数据后角色名称无法第一次就出现的问题
              }])
            })
          }).catch(err =>{
          })
        }}
      >
        <User_manager regionList={regionList} isRoles={isRoles} ref={addForm} ></User_manager>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel ={() =>{
          setisUpdateVisible(false)

        }}
        onOk={() => {
          updateForm.current.validateFields().then(value =>{
            setisUpdateVisible(false)
            // console.log(value);

            setDataSource(dataSource.map(item=>{
              if(item.id === current.id){
                return {
                  ...item,
                  ...value,
                  role:isRoles.filter(data => data.id ===value.roleId)[0]
                }
              }
              return item
            }))

            axios.patch(`http://localhost:5000/users/${current.id}`,value)
          })
        }}
      >
        <User_manager regionList={regionList} isRoles={isRoles} ref={updateForm} isUpdate={true} ></User_manager>
      </Modal>
    </div>
  )
}
