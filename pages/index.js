import { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.scss'

export default function Home() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  /**
   * handleOnChange
   * @description Triggers when the file input changes (ex: when a file is selected)
   */

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function(onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    }
  
    reader.readAsDataURL(changeEvent.target.files[0]);
  }
  console.log(imageSrc)

  async function handleOnSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({name}) => name === "file");

    const formData = new FormData();

    for( const file of fileInput.files){
      formData.append('file', file);
    }

    formData.append('upload_preset', 'my-upload');

    const data = await fetch("https://api.cloudinary.com/v1_1/dtram9qiy/image/upload", {
      method: 'POST',
      body: formData
    }).then(res => res.json());

    setImageSrc(data.secure_url)
    setUploadData(data)
    console.log(data)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Uploader</title>
        <meta name="description" content="Upload your image to Cloudinary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Image Uploader
        </h1>

        <p className={styles.description}>
          Upload your image to Cloudinary!
        </p>

        <form className={styles.form} method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
          <p>
            <input type="file" name="file" />
          </p>
          
          <img src={imageSrc} alt="uploaded-image" />
          
          {imageSrc && !uploadData && (
            <p>
              <button>Upload Files</button>
            </p>
          )}

          {uploadData && (
            <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
          )}
        </form>
      </main>
    </div>
  )
}
