import { Layout, Menu } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;

const items = [
  { key: '1', label: 'Sell' },
  { key: '2', label: 'Buy' },
  { key: '3', label: 'Your Cars' },
  { key: '4', label: 'Logout' },
].map((item) => ({...item, label: (
    <span style={{width: '50px', display: 'inline-block', textAlign: 'center', fontSize: '150%', color: 'rgba(255,255,255,0.9)',}}>
      {item.label}
    </span>
  ),
}));

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case '1': // Sell
        navigate('/addCar');
        break;
      case '2': // Buy
        navigate('/displayAllCars');
        break;
      case '3': // Your Cars
        navigate('/displayCars');
        break;
      case '4': // Logout
        sessionStorage.setItem('userId', '');
        navigate('/');
        break;
      default:
        break;
    }
  };

  const getSelectedKey = () => {
    switch (location.pathname) {
      case '/addCar':
        return ['1'];
      case '/displayAllCars':
        return ['2'];
      case '/displayCars':
        return ['3'];
      default:
        return [];
    }
  };

  return (
    <Layout>
      <Header
        style={{
          background: 'rgb(1, 8, 63)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0px 20px',
        }}
      >
        <div
          style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          CarHub
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={getSelectedKey()}
          items={items}
          style={{
            display: 'flex',
            background: 'rgb(1, 8, 63)',
            justifyContent: 'flex-end',
            flex: 1,
            marginTop: -2,
            padding: 0,
          }}
          onClick={handleMenuClick}
        />
      </Header>
    </Layout>
  );
};

export default NavBar;
