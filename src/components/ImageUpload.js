import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed-image.jpg'; // Optional: Customize the filename here
    link.click();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !width || !height) {
      alert('Please select a file and specify both width and height.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/images/upload?width=${width}&height=${height}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      setCompressedImage(`http://localhost:5000/${response.data.path}`);
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
  };

  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input
        type="number"
        placeholder="Width (px)"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />
      <input
        type="number"
        placeholder="Height (px)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <button onClick={handleUpload}>Upload & Compress</button>

      {compressedImage && (
        <div>
          <h3>Compressed Image:</h3>
          <img src={compressedImage} alt="Compressed" style={{ maxWidth: '300px' }} />
          <br />
          {/* Clickable Download Link */}
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
