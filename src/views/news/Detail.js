import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import {HeartOutlined } from '@ant-design/icons'
import axios from 'axios';
import moment from 'moment'

// 游客系统的组件，详细的一个新闻的内容
export default function Detail(props) {
    // 
    const [newsInfo,setNewsInfo]=useState(null)

    useEffect(()=>{
        // console.log(props.match.params.id);
        // 获取它的id
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then((res)=>{

            setNewsInfo({
                ...res.data,
                view:res.data.view+1
            })

            return res.data
        }).then(res=>{
            axios.patch(`/news/${props.match.params.id}`,{
                view:res.view+1
            })
        })
    },[props.match.params.id])

    // 更新星星数量
    const handleStar= ()=>{
        setNewsInfo({
            ...newsInfo,
            star:newsInfo.star+1
        })

        axios.patch(`/news/${props.match.params.id}`,{
            star:newsInfo.star+1
        })
    }

    return (
        <div>
            {
                newsInfo &&<div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                {newsInfo.category.title}
                                <HeartOutlined onClick={()=>handleStar()} />
                            </div>}>
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者"> {newsInfo.author} </Descriptions.Item>
                            <Descriptions.Item label="发布时间"> {newsInfo.publishTime?moment(newsInfo.createTime).format("YYYY-MM-DD  HH:mm:ss"):"-"}  </Descriptions.Item>
                            <Descriptions.Item label="区域"> {newsInfo.region} </Descriptions.Item>
                            <Descriptions.Item label="访问数量"> {newsInfo.view}   </Descriptions.Item>
                            <Descriptions.Item label="点赞数量"> {newsInfo.star} </Descriptions.Item>
                            <Descriptions.Item label="评论数量"> 0 </Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        padding:'0 24px'
                    }}  ></div>
                </div>
            }
        </div>
    )
}
