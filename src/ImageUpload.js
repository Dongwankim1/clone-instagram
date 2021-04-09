import { Button } from '@material-ui/core';
import React, { useState } from 'react'
import {storage,db} from "./firebase";
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({username}){
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");
    const [progress,setProgress] = useState(0);
    const [caption,setCaption] = useState('');


    const handleChange = (e)=>{
        if(e.target.files[0]){
            console.log(e.target.files[0])
            setImage(e.target.files[0])
        }
    }

    const handleUpload = (e)=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_chnaged",
            (snapshot) =>{
                //progress functnion...
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error)=>{
                //Error function ...
                console.log(error);
                alert(error.message);
            },
            ()=>{
                //complete function...
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url =>{
                    // post image inside db
                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username
                    })

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        )
    }

    return(
        <div className="imageUpload">
            <progress className="imageupload__progress" value={progress} max="100"></progress>
            <input type="text" placeholder='Enter a caption...' onChange={e =>setCaption(e.target.value)} name="" value={caption}/>
            <input type="file" onChange={handleChange}></input>
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload;