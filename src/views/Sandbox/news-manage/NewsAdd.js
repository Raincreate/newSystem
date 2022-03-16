import React,{useEffect, useState,useRef } from 'react'
import { PageHeader, Button, Descriptions,Steps,Form,Input, Select, message,notification  } from 'antd';
import style from './News.module.css'
import axios from 'axios';
import moment from 'moment'
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } =Select




export default function NewsAdd(props) {

  //
  const [current,setCurrent] =useState(0)
  //
  const [categoryList,setcategoryList] =useState([]);
  //
  const [formInfo,setformInfo] =useState({})
  //
  const [content,setcontent] =useState("")
  //
  const user =JSON.parse(localStorage.getItem("token"))

  //
  useEffect(()=>{
    axios.get('/categories').then((res)=>{
      setcategoryList(res.data)
    })
  },[])

  const handleNext=()=>{
    if(current === 0){

      NewsForm.current.validateFields().then(res =>{
        setformInfo(res)
        setCurrent(current+1)
      }).catch(error=>{

      })
    }else{
      if(content === ""   ||content.trim() === "<p></p>"){
        message.error("请输入新闻信息！")
      }else{
        setCurrent(current+1)
      }
    }
  }

  const handlePrevious =() =>{
    setCurrent(current -1)
  }

  const NewsForm =useRef(null)
  
  const handleSave=(auditState)=>{
    axios.post('/news',{
      ...formInfo,
      "content":content,
      "region":user.region?user.region : "全国",
      "author": user.username,
      "roleId": user.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      "publishTime": 0
    }).then((res)=>{
      props.history.push(auditState === 0 ? '/news-manage/draft':'/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以在${auditState === 0 ?'草稿箱':'审核列表'}中查看您的新闻！`,
        placement:"bottom-right",
      });
    })
  }

  

  return (
    <div>
      <PageHeader
      ghost={false}
      title="撰写新闻"
      extra={[
        <Button key="1" type="primary">
          装饰按钮
        </Button>,
      ]}
    >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{user?.username}</Descriptions.Item>
          <Descriptions.Item label=""></Descriptions.Item>
          <Descriptions.Item label="创建时间">{moment(Date.now()).format("YYYY-MM-DD  HH:mm:ss")}</Descriptions.Item>          
        </Descriptions>
      </PageHeader>

      {/* 标题进度条 */}
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" subTitle="" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div className={current === 0 ? '' : style.active} >
        <Form
          name="wrap"
          ref ={NewsForm}
        >
        <Form.Item label="新闻标题" name="title" rules={[{ required: true, message:"请输入新闻标题" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="新闻分类" name="categoryId" rules={[{ required: true, message:"请输入新闻分类" }]}>
          <Select>
            {
              categoryList.map(item =>(
                <Option key={item.id} >{item.title}</Option>
              ))
            }
          </Select>
        </Form.Item>

      </Form>
      </div>
      <div className={current === 1 ? '' : style.active} >
        <NewsEditor getContent={(value)=>{
          setcontent(value)
        }} ></NewsEditor>
      </div>
      <div className={current === 2 ? '' : style.active} ></div>

      <div style={{margin:'50px'}}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={()=>handleSave(0)} >保存草稿箱</Button>
            <Button danger onClick={()=>handleSave(1)} >提交审核</Button>
          </span>
        }
        {
          current <2 && <Button type='primary' onClick={handleNext} > 下一步 </Button>
        }
        {
          current >0 && <Button onClick={handlePrevious} >上一步</Button>
        }
      </div>
    </div>
  )
}

