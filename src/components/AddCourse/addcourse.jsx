"use client";
import React, { useRef, useState } from 'react';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  InputAdornment,
  Chip,
  Box,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';

import imgicon from '../../../public/imageicon.png'
import Music from '../../../public/music.webp'
import Video from '../../../public/video.png'
import File from '../../../public/file.png'
import Add from '../../../public/add.png'
import styles from './Addcourse.module.css'
import Link from 'next/link';
const AddCourse = () => {

  const ref = useRef()
  const [image,setImage] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [showIcon, setShowIcon] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [disable,setDisable] = useState(false)
  const [url,setUrl]=useState('')



const handleSubmit = async(event)=>{
  event.preventDefault(); 
  const formData = new FormData();
  formData.append('image', image);
  try {
    setDisable(true)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/addcourse', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(percentComplete,'hi percent');
        setUploadProgress(percentComplete);
      }
    };

    xhr.onloadstart = () => {
      setUploading(true);
    };

    xhr.onloadend = () => {
      setUploading(false);
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 201) {
          console.log('Server response:', xhr.responseText);
          setImage(null);
          setSelectedFileType('');
          setShowIcon(false);
          setUploadProgress(0);
          setDisable(false)
          const responseUrl = xhr.responseText.match(/https:\/\/mega\.nz\/file\/[^\s"]+/)[0];
          setUrl(responseUrl);
        } else {
          console.error('Submission error:', xhr.statusText);
          setDisable(false)
        }
      }
    };
   
    xhr.send(formData);
    // Reset form or redirect user based on the response
  } catch (error) {
    console.error('Submission error:', error);
    setDisable(false)
  }
}

const handleImage = ()=>{ref.current.click()}
  
const handleChange = (e)=>{
  const selectedFile = e.target.files[0]
  console.log(selectedFile,"image");
  if(selectedFile){
    setImage(selectedFile)
    const fileType = selectedFile.type.split('/')[0]; 
    setSelectedFileType(fileType);
    setTimeout(() => setShowIcon(true), 100);
  }
}

const renderIcon =()=>{
  switch(selectedFileType){
 case 'video':
  return  <Image src={Video} alt='icon' width={50} height={50}  /> ;
  case 'audio':
    return <Image src={Music} alt='music icon' width={50} height={50} />;
case 'image':
    return <Image src={imgicon} alt='image icon' width={50} height={50}  />;
default:
    return <Image src={File} alt='file icon' width={50} height={50} />;
  }
}


 

  return (
    <Box sx={{height:'100dvh',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <Box sx={{height:'70%',width:'70%',  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', zIndex:99,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'20px'}}>
              <Typography fontSize={20} fontWeight={600}>Upload Files</Typography>
              
               <Box sx={{width:'50%',height:'40%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'}}>
                       
                       <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',height:'80%',gap:'20px'}}>
                     
                     {image ? 
                     <Box
                     sx={{
                      transition: 'all 1s ease-in-out',
                      opacity: showIcon ? 1 : 0,
                      transform: showIcon ? 'scale(1)' : 'scale(0.8)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                 >
                     {renderIcon()}
                     <Box sx={{ 
     display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: '10px',
    textAlign: 'center',
    wordBreak: 'break-word',
    maxWidth: '100%' }}>
                         {image.name}
                     </Box>
                 </Box>
                     :
                     <>
                      <Image src={imgicon} alt='icon' width={50} height={50} style={{opacity:'0.5'}} />
                       <Image src={Music} alt='icon' width={50} height={50} style={{opacity:'0.5'}} />
                       <Image src={Video} alt='icon' width={50} height={50} style={{opacity:'0.5'}} />
                       <Image src={File} alt='icon' width={50} height={50} style={{opacity:'0.5'}} />
                     </>}
                      
                       </Box>

                       <Box  sx={{display:'flex',alignItems:'center',justifyContent:'center',}}>
                        <Image onClick={handleImage} src={Add} alt='addicon' width={30} height={30} style={{cursor:'pointer'}} />
                        <input
                        type='file'
                        ref={ref}
                        style={{display:'none'}}
                        onChange={handleChange}
                        />
                       </Box>

               </Box>
               <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',gap:'20px'}}>
             {image && (

  <Button
  sx={{
    border: 'none',
    outline: 'none',
    backgroundColor: '#fff200',
    padding: '10px 20px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff',
    borderRadius: '5px',
    transition: 'all ease 0.1s',
    boxShadow: '0px 5px 0px 0px #f0eaad',
    '&:active': {
      transform: 'translateY(5px)',
      boxShadow: '0px 0px 0px 0px #a29bfe',
    },
    '&:hover':{
      backgroundColor: '#fff200',
    }
  }}
  disabled={disable}
  onClick={handleSubmit}
>
 Upload
</Button>
             )}

<Link href={url}>
        <Typography fontSize='14px' marginTop='1.5rem'  sx={{zIndex:99}} color='red'>{url}</Typography>
 </Link>
             
             {uploading && uploadProgress!==100 && (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          color="success"
          variant='determinate'
          value={uploadProgress}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(uploadProgress)}%`}
          </Typography>
        </Box>
      </Box>
        )}
        
</Box>
         {uploadProgress==100 && (
          <Box sx={{position:'relative',zIndex:99,display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
          <div className={styles.loader}></div>
          <Typography fontSize='12px' marginTop='2rem' color='red'>Uploading Completed. Waiting for generating url......</Typography>
          </Box>
          )}

        </Box>
 

        <Box sx={{position:'absolute',left:0,bottom:0,background:'#fff200',height:'65dvh',width:'50%'}}>
     
       </Box>
    </Box>
  );
};

export default AddCourse;
