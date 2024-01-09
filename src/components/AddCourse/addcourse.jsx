"use client";
import React, { useState } from 'react';
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
} from '@mui/material';
import Image from 'next/image';
import { Add } from '@mui/icons-material';

const AddCourse = () => {


  const [title,setTitle] = useState('')
  const [description,setDescriptiom] = useState('')
  const [image,setImage] = useState(null);
  const [price,setPrice]= useState(80)
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [dateTimeChips, setDateTimeChips] = useState([]);


  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
};

const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
};

const addDateTime = () => {
    if (selectedDate && selectedTime) {
        const existingDate = dateTimeChips.find(entry => entry.date === selectedDate);

        if (existingDate) {
            // Check if the selected time already exists for this date
            if (!existingDate.time.includes(selectedTime)) {
                existingDate.time.push(selectedTime);
                setDateTimeChips([...dateTimeChips]);
            } else {
                // Optional: Provide feedback to the user that this time is already selected
                alert("This time is already selected for the chosen date.");
            }
        } else {
            setDateTimeChips([...dateTimeChips, { date: selectedDate, time: [selectedTime] }]);
        }

        setSelectedTime('');
    }
};


const handleSubmit = async(event)=>{
  event.preventDefault(); // Prevent default form submission behavior

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('image', image);
  formData.append('dateTimeChips', JSON.stringify(dateTimeChips)); // Convert array to JSON string

  try {
    const response = await fetch('/api/addcourse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Handle the response from the server
    const result = await response.json();
    console.log('Server response:', result);
    // Reset form or redirect user based on the response
  } catch (error) {
    console.error('Submission error:', error);
  }
}
  


  const times = ['09:00', '12:00', '15:00', '18:00'];

  return (
    <Paper style={{ padding: '20px', margin: '20px', width: '60%' }}>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>
        Add New Course
      </Typography>
      <form onSubmit={handleSubmit} >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Course Title"
              variant="outlined"
              fullWidth
              name="title"
           
              onChange={(e)=>{setTitle(e.target.value)}}
            />
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize
              minRows={3}
              placeholder="Course Description"
              style={{
                width: '100%',
                borderRadius: '4px',
                fontSize: '16px',
                border: '1px solid #ced4da', // Standard border color
                padding: '8px', // Standard padding
                marginTop: '8px', // Standard margin top
              }}
              name="description"
            
              onChange={(e)=>{setDescriptiom(e.target.value)}}
            />
          </Grid>
          <Grid item xs={12}>
          <TextField type='file' placeholder='Uplaod the image' sx={{width:'100%'}} onChange={(e)=>setImage(e.target.files[0])} /> 
        </Grid>
          <Grid item xs={12}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              name="price"
              
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              onChange={(e)=>{setPrice(e.target.value)}}
            />
          </Grid>
          <Grid item xs={12}>
          <>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', margin: '1rem', justifyContent: 'center' }}>
                <TextField
                    type="date"
                    fullWidth
                    value={selectedDate}
                    sx={{ width: '20%' }}
                    onChange={handleDateChange}
                />
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedTime}
                    sx={{ width: '70%' }}
                    onChange={handleTimeChange}
                >
                    {times.map((time, index) => (
                        <MenuItem key={index} value={time}>{time}</MenuItem>
                    ))}
                </Select>
                <Button sx={{width:'10%'}} onClick={addDateTime}>
                    <Add />
                </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px',justifyContent:'center' }}>
                {dateTimeChips.map((entry, index) => (
                    <Box key={index}>
                        <Typography variant="subtitle1">{entry.date}</Typography>
                        {entry.time.map((time, timeIndex) => (
                            <Chip key={timeIndex} sx={{marginRight:'1rem'}} label={time} />
                        ))}
                    </Box>
                ))}
            </Box>
        </>
            

                

          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Course
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddCourse;
