import './App.css';
import { useEffect, useState } from 'react';
import * as React from 'react'
import {Alert, Button, ButtonGroup, Grid, IconButton, Modal, Snackbar, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { gradientStyles, modal1, modal2 } from './constant';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

// const Alert = React.forwardRef<HTMLDivElement,AlertProps>(function Alert(
//   props,
//   ref,
// ) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });


function App() {
  const [state,setState] = useState({
    collection:{},
    currList:[]
  })
  const [showCollection,setShowCollection] = useState(false)
  const [showListModal,setShowListModal] = useState(false)
  const [showCollectionModal,setShowCollectionModal] = useState(false)
  const [modalText,setModalText] = useState('')  
  const [prevText,setPrevText] = useState('')
  const [currentCollectionKey, setCurrentCollectionKey] = useState('')
  const [message,setMessage] = useState(null)

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('store'));
    if (items) {
     setState(items);
    }
  }, []);
  
  const handleClose = ()=>{
    setModalText('')
    if(prevText!=='')setPrevText('')
    setShowListModal(false)
    setShowCollectionModal(false)
  }
  
  const handleOpen = (isEdit,prev,isModal1)=>{
    if(isModal1){
    if(isEdit){
      setModalText(prev)
      setPrevText(prev)
    }
    console.log(prev);
    setShowListModal(true)
  }
  else{
    setShowCollectionModal(true)
  }
  }
  
  const textChangeHandler = (e) =>{
    setModalText(e.target.value)
  }

  // LIST METHODS
  const addTask = (e)=>{
    e.preventDefault()
    if(modalText===''){
      showMessage('TaskName is Compulsory. Try Again!','error')
      return
    }
    if(prevText!==''){
      const newList = state.currList.map(item=>(item===prevText)?modalText:item)
      setState(st=>({...state,currList:newList}))
      setPrevText('')
    } 
    else{
      setState(st=>({...state,currList:[...st.currList,modalText]}))
    }
    handleClose();
  }
  
  const removeTask = (item) =>{
    const newList = state.currList.slice()
    newList.splice(newList.indexOf(item),1)
    setState(st=>({...state,currList:newList}))
  }

  const saveList = () =>{
    if(currentCollectionKey!==''){
    setState(st=>({collection:{...st.collection,[currentCollectionKey]:st.currList}, currList:[]}))
    setCurrentCollectionKey('')
    }
    localStorage.setItem('store',JSON.stringify(state))
    showMessage('Data Saved','info')
  }
  const resetList = () =>{
    const items = JSON.parse(localStorage.getItem('store'));
    if (items) {
     setState(items);
    }else{
      setState({
        collection:{},
        currList:[]
      });
    }
  }
  const toggleShowCollection = () =>setShowCollection(b=>!b)
  
  // MESSAGE METHODS
  const showMessage = (msg,severity) =>{
    setMessage({msg,severity})
    setTimeout(() => {
      setMessage('')
    }, 3000);
  }
  const closeMessage = () => setMessage(null)


  // COLLECTION METHODS
  const addToCollection = (e) =>{
    e.preventDefault()
    if(modalText===''){
      showMessage('Title is compulsary. Try again!','error')
      return
    }
    const newCollection = JSON.parse(JSON.stringify(state.collection))
    newCollection[modalText] = state.currList.slice()
    setState(st=>({...st,collection:newCollection}))
    handleClose()
    showMessage('Added To Collection','success')
  }

  const removeFromCollection = (key)=>{
    const newCollection = JSON.parse(JSON.stringify(state.collection))
    delete newCollection[key]
    setState(st=>({...st,collection:newCollection}))
  }

  const editCollectionList = (key)=>{
    setState(st=>({...st,currList:[...st.collection[key]]}))
    setCurrentCollectionKey(key)
    setShowCollection(false)
  }

  const takeToCurrList = (key)=>{
    setState(st=>({...st,currList:[...st.collection[key]]}))
    setCurrentCollectionKey('')
    setShowCollection(false)
  }

  return (
    <div className="App">
      <Grid container justifyContent="center" alignItems={'center'} spacing={2}>
        <Grid container item xs={12} sm={8} md={6} lg={5} spacing={2} justifyContent="center" alignContent={"space-around"}>
          <Grid item xs={12}>
            <Typography className='clrwhite' variant='h4' fontWeight={"400"}>What would you like to do today?</Typography>
          </Grid>
          <Grid item xs={5}>
            <button className="btn" style={gradientStyles[0]} onClick={handleOpen.bind(this,false,-1,true)}>Add Todo</button>
          </Grid>
          <Grid item xs={5}>
            <button className="btn" style={gradientStyles[1]} onClick={saveList}>Save</button>
          </Grid>
          <Grid item xs={5}>
            <button className="btn" style={gradientStyles[2]} onClick={resetList}>Reset</button>
          </Grid>
          <Grid item xs={5}>
            <button className="btn" style={gradientStyles[3]} onClick={handleOpen.bind(this,'','',false)}>Add To Collection</button>
          </Grid>
          <Grid item xs={5}>
            <button className="btn" style={gradientStyles[4]} onClick={toggleShowCollection}>{showCollection?'Go To List':'View Collection'}</button>
          </Grid>

          {/* LIST VIEW */}
          {!showCollection &&
            state.currList.map((item,index)=><Grid
               key={item} item  xs={11} container justifyContent="space-around" alignItems='center'className="task" style={gradientStyles[index%5]}>
                 <Grid item xs={8}><Typography variant='inherit' align='left'>{item}</Typography></Grid>
                 <Grid item xs={1}>
                   <IconButton variant="contained" size='large' onClick={handleOpen.bind(this,true,item,true)}>
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

          {/* COLLECTION VIEW */}
          {showCollection &&
            Object.keys(state.collection).map((item,index)=><Grid
               key={item} item  xs={11} container justifyContent="space-around" alignItems={'center'} className="task" style={gradientStyles[index%5]}>
                 <Grid item xs={6}><Typography variant='inherit' align='left'>{item}</Typography></Grid>
                 <Grid item xs={6}>
                 <ButtonGroup variant="filled" aria-label="outlined primary button group">
                    <Button onClick={editCollectionList.bind(this,item)}>Edit</Button>
                    <Button onClick={removeFromCollection.bind(this,item)}>Delete</Button>
                    <Button onClick={takeToCurrList.bind(this,item)}>Select</Button>
                  </ButtonGroup>
                 </Grid>
               </Grid>)               
          }
        </Grid>        
      </Grid>

      {/* LIST MODAL */}
      <Modal
        open={showListModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form className='modal' style={{background:modal1}} onSubmit={addTask}>
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

      {/* COLLECTION MODAL */}
      <Modal
        open={showCollectionModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form className='modal' style={{backgroundImage:modal2}} onSubmit={addToCollection}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography id="modal-modal-title" className='clrwhite' variant="h4" align='center' component="h2">
              Add Title to your List
            </Typography>
            </Grid>
          <Grid item xs={12}>
          <TextField id="filled-basic" label={<Typography className='clrwhite'>Your task!</Typography>} variant="filled" fullWidth onChange={textChangeHandler} value={modalText} className='clrwhite' InputProps={{inputProps:{className:'clrwhite'}}}/>
          </Grid>
          <Grid item xs={12} container justifyContent={'space-around'}>
            <Grid item xs={5}>
              <Button type='submit' variant='contained' color='success' onClick={addToCollection} fullWidth>{prevText!==''?'Replace':'Add'}</Button>
            </Grid>
            <Grid item xs={5}>
              <Button type='button' variant='contained' color="error" onClick={handleClose} fullWidth>Cancel</Button>
            </Grid>
          </Grid>
          </Grid>
        </form>
      </Modal>
      {message && <Snackbar anchorOrigin={{horizontal:'center',vertical:'bottom'}} open={showMessage!==null} autoHideDuration={3000} onClose={closeMessage}>
        <MuiAlert variant='filled' elevation={8} onClose={closeMessage} severity={message?.severity} sx={{ width: '100%' }}>
          {message?.msg}
        </MuiAlert>
      </Snackbar>}
    </div>
  );
}

export default App;
