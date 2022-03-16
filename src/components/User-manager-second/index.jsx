import React, { forwardRef,useEffect,useState } from 'react'
import {Form,Input,Select} from 'antd'
const { Option } = Select;

// 写成这个样子是为了能够多次传入数据
const User_manager = forwardRef((props,ref) => {

    // 用来维护传进来的对象的显示与隐藏状态
    const [isViliable,setisViliable] =useState(false)

    // 获取区域以及角色名称的信息
    const { roleId,region } =JSON.parse(localStorage.getItem("token"))
    
    // 
    useEffect(()=>{
        setisViliable(props.isUpdateVisible)
    },[props.isUpdateVisible])

    // 在这里是判断区域的，如果说发现创建或更新的对象他是系统管理员，那么返回false，反之返回true
    const checkDisabled=(item)=>{
        if(props.isUpdate){
            if(roleId ===1){
                return false
            }else{
                return true
            }
        }else{
            if(roleId ===1){
                return false
            }else{
                return item.value !==region
            }
        }
    }

    // 用来判断角色名称
    const checkDisabledRole=(item)=>{
        if(props.isUpdate){
            if(roleId ===1){
                return false
            }else{
                return true
            }
        }else{
            if(roleId ===1){
                return false
            }else{
                return item.id !==4
            }
        }
    }

    return (
        <Form ref={ref}>
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '必填项！' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '必填项!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="region"
                label="区域"
                rules={isViliable ? [] :[{ required: true, message: '必填项!' }]}
            >
                {/* Select是选择项，可以下拉的列表 */}
                <Select disabled={isViliable} >
                {
                    // 从父组件中继承相应的地理位置，将其遍历
                    props.regionList.map((item) =>{
                        return <Option value={item.value} disabled={checkDisabled(item)} key={item.id} >{item.title}</Option>
                    })
                }
                </Select>
            </Form.Item>

            <Form.Item
                name="roleId"
                label="角色名称"
                rules={ [{ required: true, message: '必填项!' }]}
            >
                <Select onChange={(value)=>{
                    if(value*1 ===1){
                        setisViliable(true)
                        ref.current.setFieldsValue({
                            region:""
                        })
                    }else{
                        setisViliable(false)
                    }
                }} >
                {
                    // 遍历角色名称
                    props.isRoles.map((item) =>{
                        return <Option value={item.id} key={item.id} disabled={checkDisabledRole(item)} >{item.roleName}</Option>
                    })
                }
                </Select>
            </Form.Item>
        </Form>
    )
})


export default User_manager
