import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader,Card, Col, Row,List } from 'antd';
import _ from 'lodash'

// 游客组件之一，主要是游客组件的新闻列表
export default function News() {
    // 
    const [list,setlist] =useState([])

    useEffect(()=>{
        axios.get("http://localhost:5000/news?publishState=2&_expand=category").then(res=>{
            // console.log(Object.entries(_.groupBy(res.data,item => item.category.title)));
            setlist(Object.entries(_.groupBy(res.data,item => item.category.title)))
        })
    },[])

    return (
        <div style={{width:'96%',margin:'0 auto'}} >
            <PageHeader
                className="site-page-header"
                title="新闻"
                subTitle="更多新闻正在更新中"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16,16]}>
                    {
                        list.map(item=>(
                            <Col span={8} key={item[0]} >
                                <Card title={item[0]} bordered={true} hoverable={true} >
                                    <List
                                        size="large"
                                        dataSource={item[1]}
                                        pagination={{pagesize:2}}
                                        renderItem={data => 
                                            <List.Item> <a href={`#/detail/${data.id}`} >{data.title}</a> </List.Item>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div>
        </div>
    )
}
