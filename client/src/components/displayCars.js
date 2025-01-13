import { PictureOutlined } from '@ant-design/icons';
import { message } from 'antd';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/displayCars.css';
import NavBar from './navBar';

const DisplayCars = ({ mode }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndices, setImageIndices] = useState({});
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const userId = sessionStorage.getItem('userId');

  const error = useCallback((content, callback = null) => {
    messageApi.open({ type: 'error', content });
    setTimeout(() => { if (callback) callback(); }, 1500);
  }, [messageApi]);

  useEffect(() => {
    const fetchCars = async () => {
      let endpoint;

      if (mode === 'YourCars') {
        if (!userId) {
          error('User ID not found. Please log in.', () => navigate('/addCar'));
          setLoading(false);
          return;
        }
        endpoint = `http://localhost:5000/displayCars?id=${userId}`;
      } else {
        endpoint = 'http://localhost:5000/displayAllCars';
      }

      setLoading(true);
      try {
        const response = await axios.get(endpoint);
        const carData = response.data.cars || [];
        setCars(carData);
        setLoading(false);

        // Initialize imageIndices for each car
        const initialIndices = carData.reduce((acc, car) => {
          acc[car.model] = 0;
          return acc;
        }, {});
        setImageIndices(initialIndices);
      } catch (err) {
        console.error('Error fetching cars:', err);
        error('Failed to load car data. Please try again.');
        setLoading(false);
      }
    };

    fetchCars();
  }, [mode, userId, navigate, error]);

  const handleBufferData = (bufferObject) => {
    try {
      if (bufferObject?.type === 'Buffer' && Array.isArray(bufferObject.data)) {
        const buffer = new Uint8Array(bufferObject.data);
        return btoa(String.fromCharCode(...buffer));
      }
      return null;
    } catch (err) {
      console.error('Error processing buffer:', err);
      return null;
    }
  };

  const handleArrowClick = (carModel, direction) => {
    setImageIndices((prevIndices) => {
      const currentIndex = prevIndices[carModel] || 0;
      const car = cars.find((car) => car.model === carModel);
      if (!car || car.images.length === 0) return prevIndices;
  
      const newIndex =
        direction === 'right'
          ? (currentIndex + 1) % car.images.length
          : (currentIndex - 1 + car.images.length) % car.images.length;
  
      return { ...prevIndices, [carModel]: newIndex };
    });
  };
  
  const isLeftArrowVisible = (carModel) => {
    const currentIndex = imageIndices[carModel] || 0;
    return currentIndex > 0; // Left arrow visible if not at the first image
  };
  
  const isRightArrowVisible = (carModel) => {
    const currentIndex = imageIndices[carModel] || 0;
    const car = cars.find((car) => car.model === carModel);
    return currentIndex < (car?.images.length || 0) - 1; // Right arrow visible if not at the last image
  };
  
  return (
    <>
      {contextHolder}
      <NavBar />
      <h1>{mode === 'YourCars' ? 'Your Cars' : 'Cars for Sale'}</h1>
      <div className="display">
        {cars.map((car, index) => (
          <div className="cards" key={index}>
            <div className="carousel">
              {car.images?.length > 0 ? (
                <>
                  {isLeftArrowVisible(car.model) && (
                    <button
                      className="arrow left-arrow"
                      onClick={() => handleArrowClick(car.model, 'left')}
                    >
                      &#9664;
                    </button>
                  )}
                  <img
                    className="carousel-img"
                    src={`data:image/jpeg;base64,${handleBufferData(
                      car.images[imageIndices[car.model] || 0]
                    )}`}
                    alt={`Car ${car.model}`}
                  />
                  {isRightArrowVisible(car.model) && (
                    <button
                      className="arrow right-arrow"
                      onClick={() => handleArrowClick(car.model, 'right')}
                    >
                      &#9654;
                    </button>
                  )}
                  <div style={{ marginTop: '60%', marginLeft: '-40%' }}>
                    <PictureOutlined /> {car.images.length}
                  </div>
                </>
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="details">
              <div className="title">
                <h3>{car.model}</h3>
                <p>PKR {car.price}</p>
              </div>
              <div className="owner">
                <h3>Owner Details:</h3>
                {car.ownerID ? <p>Name: {car.ownerID.name}</p> : <p>''</p>}
                {car.ownerID ? <p>Email: {car.ownerID.email}</p> : <p>''</p>}
                {car.phoneNo ? <p>Phone No: {car.phoneNo}</p> : <p>''</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
  
};

export default DisplayCars;
