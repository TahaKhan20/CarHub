import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginScreen.css';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const showMessage = (type, content) => {
    messageApi.open({ type, content });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('https://curious-alfajores-cf5190.netlify.app/login', {
        email: values.email,
        password: values.password,
      });

      sessionStorage.setItem('userId', response.data.userId);
      showMessage('success', 'Login Successful');
      
      setTimeout(() => navigate('/addCar'), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during login.';
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login'>
      {contextHolder}
      <h1>Welcome to CarHub</h1>
      <h3>Drive Your Dream, Sell with Ease.</h3>

      <div className="form-container">
        <h3 style={{marginBottom:'7%'}}>Please Log In to Continue</h3>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 400 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters in length!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button className='submit-button' type="primary" htmlType="submit" loading={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form.Item>
        </Form>

        <p style={{ fontSize: "80%", textAlign: 'center', marginBottom:'1%' }}>
          Don't have an account? Please use these credentials
        </p>
        <p style={{ fontSize: "80%", textAlign: 'center', marginBottom:'1%'  }}>
          Email: faraz@RhodiumTech.com
        </p>
        <p style={{ fontSize: "80%", textAlign: 'center', marginBottom:'1%'  }}>
          Password: 123456abc
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
