import React, {useState} from 'react';
import { getDownloadURL, uploadBytesResumable , ref} from 'firebase/storage';
import { storage } from './firebase/firebase';
import "./App.css";

function App() {
  const [image, setimage] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl]= useState("");
  const handleImage = event => {
    const image = event.target.files[0];
    setimage(image);
  }

  const onSubmit = event =>{
    event.preventDefault();
    if(image===""){
      console.log("image not found");
    }

    const storageRef = ref(storage, `file/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    //upload
    uploadTask.on(
      "state_changed",
      (snapshot) =>{
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) *100
        );
        setProgress(prog);
      },
      //showing error
      (error)  => console.log(error),

      //get Downloadable Link
      () =>{
        getDownloadURL(uploadTask.snapshot.ref).then((downnloadURL) =>{
          console.log("FIle available at", downnloadURL);
          setImageUrl(downnloadURL);
        })
      }
    )
  };

  
  return (
    <div className="App">
      <h1>Upload Image</h1>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={handleImage} />
        <button>Upload</button>
      </form>
      <hr />
      <h2>Upload done {progress}%</h2>
      <img src={imageUrl} alt="uploaded" />
    </div>
  );
}

export default App;
