import React from 'react'
import { Form,Input,Checkbox,Button, message } from 'antd'
import './index.css'
import axios from 'axios';


export default function Login(props) {

  const onFinish=(values)=>{
    // console.log(values);

    // 获取输入的用户名以及密码是否在json-server中包含，如果包含才能登录，不包含不能登录
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState =true&_expand=role`).then(res =>{
      // console.log(res.data);
      if(res.data.length === 0){
        message.error("您输入的账号或密码有错误")
      }else{
        // 如果他的长度不等于0，说明账号或密码都有填写，所以在这里需要保存并且跳转页面
        localStorage.setItem("token",JSON.stringify(res.data[0]))
        props.history.push('/')
      }
    })
  }

  return (
    <div style={{background:'rgb(35,39,65',height:"100%"}}>
      <div className='formContainer' >
        <div className='LoginTitle'> 新闻发布管理系统 </div>
        <div className='div_form'>
          <Form
          className='form-antd'
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入您的用户名!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入您的密码!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
