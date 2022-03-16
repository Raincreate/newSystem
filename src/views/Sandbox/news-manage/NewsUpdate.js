import React,{useEffect, useState,useRef } from 'react'
import { PageHeader, Button, Steps,Form,Input, Select, message,notification  } from 'antd';
import style from './News.module.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } =Select




export default function NewsUpdate(props) {

  const [current,setCurrent] =useState(0)
  const [categoryList,setcategoryList] =useState([]);

  const [formInfo,setformInfo] =useState({})
  const [content,setcontent] =useState("")

  useEffect(()=>{
    axios.get('/categories').then((res)=>{
      setcategoryList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then((res)=>{
        let {title,categoryId,content} =res.data
        NewsForm.current.setFieldsValue({
            title,
            categoryId
        })

        setcontent(content)
    })
},[props.match.params.id])

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

  // 上一步的调用函数
  const handlePrevious =() =>{
    setCurrent(current -1)
  }

  const NewsForm =useRef(null)
  
  const handleSave=(auditState)=>{
    axios.patch(`/news/${props.match.params.id}`,{
      ...formInfo,
      "content":content,
      "auditState": auditState,
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
      title="更新新闻"
      onBack={()=>{
        props.history.goBack()
      }}
    >
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
        }} content={content} ></NewsEditor>
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
