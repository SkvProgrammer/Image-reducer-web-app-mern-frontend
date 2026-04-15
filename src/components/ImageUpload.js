import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);  // ✅ Added
  const [error, setError] = useState(null);        // ✅ Added

const handleDownload = async () => {
  try {
    // Fetch the image as a blob
    const response = await fetch(compressedImage);
    const blob = await response.blob();

    // Create a local object URL from the blob
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'compressed-image.jpg';
    document.body.appendChild(link); // ✅ Must be in DOM for Firefox
    link.click();
    document.body.removeChild(link); // ✅ Clean up

    URL.revokeObjectURL(blobUrl); // ✅ Free memory
  } catch (error) {
    console.error('Download failed:', error);
    alert('Download failed. Please try again.');
  }
};
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !width || !height) {
      alert('Please select a file and specify both width and height.');
      return;
    }

    setLoading(true);   // ✅ Added
    setError(null);     // ✅ Added

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

      // ✅ Fixed: was `http://localhost:5000/${response.data.path}` causing double slash
      setCompressedImage(response.data.url);

    } catch (error) {
      console.error('Error uploading the image:', error);
      setError('Upload failed. Please try again.'); // ✅ Added
    } finally {
      setLoading(false); // ✅ Added
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

      {/* ✅ Fixed: Button disabled during upload */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload & Compress'}
      </button>

      {/* ✅ Added: Show error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {compressedImage && (
        <div>
          <h3>Compressed Image:</h3>
          <img src={compressedImage} alt="Compressed" style={{ maxWidth: '300px' }} />
          <br />
          <button onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;