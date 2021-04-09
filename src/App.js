import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post'
import { db,auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [modalStyle] = useState(getModalStyle);

  const [open, setOpen] = useState(false);
  const [openSignIn ,setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user,setUser] = useState(null);
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in..
        console.log(authUser);
        setUser(authUser);

        if(authUser.displayName){
          //dont update username
        }else{
          return authUser.updateProfile({
            displayName:username,
          })
        }

      }else{
        // user has logged out...
        setUser(null);
      }
    })

    return () =>{
      // perform some cleanup acttions
      unsubscribe();
    }
  },[user,username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data()
      })))
    });
  }, []);


  const handleClose = () => {
    setOpen(false);
    setUsername('');
    setPassword('');
    setEmail('');
  }

  const handleSignInClose = () =>{
    setOpenSignIn(false);
    setPassword('');
    setEmail('');
  }

  const signUp = (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((err)=>{
      alert(err.message)
    });
  }

  const signIn = (e) =>{
    e.preventDefault();

    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
    
    setOpenSignIn(false);
  }


  return (
    <>
      {/* I want to have... */}
     
      
      <div className="app__header">
        <img className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        ></img>

{user?(
          <Button onClick={()=>auth.signOut()}>Logout</Button>):
          (<div className="app__loginContainer">
            <Button onClick={(e) => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={(e) => setOpen(true)}>Sign Up</Button>
            </div>
        )}
      </div>
      <div className="app">
    
      <Modal
          open={openSignIn}
          onClose={handleSignInClose}

        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                ></img>


              </center>
              <Input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}>
              </Input>
              <Input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}>
              </Input>
            

              <Button type="submit" onClick={signIn}>Sign In</Button>

            </form>

          </div>
        </Modal>


        <Modal
          open={open}
          onClose={handleClose}

        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                ></img>


              </center>
              <Input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}>
              </Input>
              <Input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}>
              </Input>
              <Input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}>
              </Input>

              <Button type="submit" onClick={signUp}>Sign Up</Button>

            </form>

          </div>
        </Modal>
        

        <h1>Hello lclear</h1>

        <div className="app__posts">
                  {

              posts.map(({ id, data }) => (

                <Post key={id} username={data.username} caption={data.caption} imageUrl={data.imageUrl} />
              ))
              }
        </div>

       


        {user?.displayName ? (
            <ImageUpload username={user.displayName}/>
          ):(
            <h3>Sorry you need to login to upload</h3>
          )}
      </div>
    </>
  );
}

export default App;
