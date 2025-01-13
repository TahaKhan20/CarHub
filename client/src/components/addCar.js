import { Button, Form, Input, InputNumber, message, Upload } from 'antd';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/addCar.css';
import NavBar from './navBar';

const AddCar = () => {
  const [imageList, setImageList] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  
  // UserID from SessionStorage to allow only authorized users to Add Car
  const userId = sessionStorage.getItem('userId');

  // error messages
  const error = useCallback((content) => {
    messageApi.open({ type: 'error', content });
  }, [messageApi]);  // Add messageApi to the dependency array if it's coming from props or context
  

  const success = (content) => {
    messageApi.open({ type: 'success', content });
  };

  // If user is not authorized then redirecting user to Login page
  useEffect(() => {
    if (!userId) {
      error('You need to be logged in to submit a car.');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [userId, navigate, error]);

  // Limiting total upload size
  const handleImageUpload = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      // Image Compression
      const compressedFile = await imageCompression(file, options);
      compressedFile.uid = file.uid;
      setImageList((prev) => [...prev, compressedFile]);
      return false;
    } catch {
      error('Failed to compress the image. Please try again.');
      return false;
    }
  };
  // Option to remove image
  const handleRemoveImage = (file) => {
    setImageList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  // To submit the form
  const handleSubmit = async (values) => {
    const { carModel, price, phoneNo } = values;
    const formData = new FormData();

    formData.append('model', carModel);
    formData.append('price', price);
    formData.append('phoneNo', phoneNo);
    formData.append('ownerID', userId);
    imageList.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/addCar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        success('Car submitted successfully!');
        setTimeout(() => navigate('/displayCars'), 2000);
      } else {
        error(response.data.message || 'Failed to submit the car.');
      }
    } catch {
      error('An error occurred while submitting the car.');
    }
  };

  if (!userId) {
    return <div>Please log in to submit a car.</div>;
  }

  return (
    <>
      <NavBar />
      {contextHolder}
      <h1 style={{ textAlign: 'center' }}>Submit Your Vehicle</h1>
      <div className="car-form-container">
        <Form
          layout="vertical"
          style={{ maxWidth: 500, margin: '0 auto' }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Car Model"
            name="carModel"
            rules={[
              { required: true, message: 'Please input the car model!' },
              { min: 3, message: 'Car model must be at least 3 characters' },
            ]}
          >
            <Input placeholder="Enter car model" />
          </Form.Item>

          <Form.Item
            label="Car Price"
            name="price"
            rules={[
              { required: true, message: 'Please input the price!' },
              { pattern: /^\d+$/, message: 'Price should be in digits only!' },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter price in PKR" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNo"
            rules={[
              { required: true, message: 'Please input the phone number!' },
              { pattern: /^[0-9]{11}$/, message: 'Phone number must contain 11 digits only' },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Upload"
            name="upload"
            rules={[{ required: true, message: 'Please upload at least one picture!' }]}
          >
            <Upload
              beforeUpload={handleImageUpload}
              onRemove={handleRemoveImage}
              listType="picture-card"
              multiple
              maxCount={10}
            >
              {imageList.length < 10 && <button type="button">Upload</button>}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button className='submit-button' type="primary" htmlType="submit" block>
              Add Car
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddCar;
