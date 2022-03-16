import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { EditorState,convertToRaw,ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'


export default function NewsEditor(props) {
    // 更新文本的值
    const [editorState,setEditorState] =useState()

    //调用这个函数的目的是在更新的时候获取新闻内容的文本值
    useEffect(()=>{
        // 获取文本的内容
        const html =props.content
        // 设置内容不能够为空
        if(html === undefined) return ;
        // 将html转化为文本
        const contentBlock =htmlToDraft(html)
        if(contentBlock){
            const contentState =ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState =EditorState.createWithContent(contentState)
            setEditorState(editorState)
        }
    },[props.content])

    return (
        <div>
            <Editor
                editorState ={editorState}
                onEditorStateChange={(editorState)=>{
                    setEditorState(editorState)
                }}

                onBlur={()=>{
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}


