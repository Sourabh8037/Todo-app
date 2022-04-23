import './App.css';
import { useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, Modal, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const gradientStyles = [
  {backgroundImage: "linear-gradient(to right, #ff512f, #f09819)"},
  {backgroundImage: "linear-gradient(to right, #00b09b, #96c93d"},
  {backgroundImage: "radial-gradient( circle farthest-corner at 22.4% 21.7%, rgba(4,189,228,1) 0%, rgba(2,83,185,1) 100.2% )"},
  {backgroundImage: "linear-gradient(to right, #8e2de2, #4a00e0)"},
]

function App() {
  const [list,setList] = useState([]);
  const [showModal,setShowModal] = useState(false)
  const [modalText,setModalText] = useState('')  
  const [prevText,setPrevText] = useState('')

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('store'));
    if (items) {
     setList(items);
    }
  }, []);
  
  const handleClose = ()=>{
    setModalText('')
    if(prevText!=='')setPrevText('')
    setShowModal(false)
  }
  
  const handleOpen = (isEdit,prev)=>{
    if(isEdit){
      setModalText(prev)
      setPrevText(prev)
    }
    console.log(prev);
    setShowModal(true)
  }
  
  const textChangeHandler = (e) =>{
    setModalText(e.target.value)
  }

  const addTask = (e)=>{
    e.preventDefault()
    if(modalText===''){
      handleClose()
      return
    }
    if(prevText!==''){
      const newList = list.map(item=>(item===prevText)?modalText:item)
      setList(newList)
      setPrevText('')
    } 
    else{
      setList(l=>[...l,modalText])
    }
    handleClose();
  }
  
  const removeTask = (item) =>{
    const newList = list.slice()
    newList.splice(newList.indexOf(item),1)
    setList(newList)
  }

  const saveList = () =>localStorage.setItem('store',JSON.stringify(list))  
  const resetList = () =>setList([])

  return (
    <div className="App">
      <Grid container justifyContent="center" alignItems={'center'} spacing={2}>
        <Grid container item xs={12} sm={8} md={6} lg={5} spacing={2} justifyContent="center" alignContent={"space-around"}>
          <Grid item xs={12}>
            <Typography className='clrwhite' variant='h4' fontWeight={"400"}>What would you like to do today?</Typography>
          </Grid>
          <Grid item xs={5}>
            <button className="btn" style={gradientStyles[0]} onClick={handleOpen.bind(this,false,-1)}>Add Todo</button>
          </Grid>
          <Grid item xs={5}>
            <button className="btn" style={gradientStyles[1]} onClick={saveList}>Save List</button>
          </Grid>
          <Grid item xs={5}>
            <button className="btn" style={gradientStyles[2]} onClick={resetList}>Reset</button>
          </Grid>
          {/* <Grid item xs={5}>
            <button className="btn" style={gradientStyles[3]}>Add To Collection</button>
          </Grid> */}
          {
            list.map((item,index)=><Grid
               key={item} item  xs={11} container justifyContent="space-around" alignItems={'center'} className="task" style={gradientStyles[index%4]}>
                 <Grid item xs={8}><Typography variant='inherit' align='left'>{item}</Typography></Grid>
                 <Grid item xs={1}>
                   <IconButton variant="contained" size='large' onClick={handleOpen.bind(this,true,item)}>
                    <EditIcon fontSize='medium'></EditIcon>
                   </IconButton>
                 </Grid>
                 <Grid item xs={1}>
                 <IconButton variant="contained" size='large' onClick={removeTask.bind(this,item)}>
                   <DeleteIcon fontSize='medium'/>
                 </IconButton>
                 </Grid>
               </Grid>)               
          }
        </Grid>        
      </Grid>
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form className='modal' onSubmit={addTask}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography id="modal-modal-title" className='clrwhite' variant="h4" align='center' component="h2">
              Add Your Task
            </Typography>
            </Grid>
          <Grid item xs={12}>
          <TextField id="filled-basic" label={<Typography className='clrwhite'>Your task!</Typography>} variant="filled" fullWidth onChange={textChangeHandler} value={modalText} className='clrwhite' InputProps={{inputProps:{className:'clrwhite'}}}/>
          </Grid>
          <Grid item xs={12} container justifyContent={'space-around'}>
            <Grid item xs={5}>
              <Button type='submit' variant='contained' color='success' onClick={addTask} fullWidth>{prevText!==''?'Replace':'Add'}</Button>
            </Grid>
            <Grid item xs={5}>
              <Button type='button' variant='contained' color="error" onClick={handleClose} fullWidth>Cancel</Button>
            </Grid>
          </Grid>
          </Grid>
        </form>
      </Modal>
    </div>
  );
}

export default App;
