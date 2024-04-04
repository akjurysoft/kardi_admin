import React, { useEffect, useState } from 'react'
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// const editorConfiguration = {
//     toolbar: [
//         'heading',
//         '|',
//         'bold',
//         'italic',
//         'bulletedList',
//         'numberedList',
//         '|',
//         'outdent',
//         'indent',
//         '|',
//         'blockQuote',
//         'insertTable',
//         'undo',
//         'redo'
//     ],
//     height: '300px'
// };



const Page = ({ initialData, onChange }) => {
    
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(initialData);
      }, [initialData]);

    const handleChange = (content, _, __, editor) => {
        setValue(content);
        onChange && onChange(content);
    };
    return (
        // <CKEditor
        //     editor={ClassicEditor}
        //     config={editorConfiguration}
        //     data={initialData}
        //     onChange={(event, editor) => {
        //         const data = editor.getData()
        //         onChange(data);
        //     }}
        //     style={{ height: '500px' }}
        // />
        <ReactQuill
            value={value}
            onChange={handleChange}
            modules={{
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['clean']
                ]
            }}
            formats={[
                'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image','align'
            ]}
        />
    )
}

export default Page