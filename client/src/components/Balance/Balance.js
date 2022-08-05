import React from 'react';

const Balance = (props) => {
  console.log(props);
  const { balance, activeBets = [] } = props;

  const containerStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '10px 5px',
    background: '#121212',
    borderTop: '2px solid yellow',
  };

  const cellStyles = {
    flex: '0 0 auto',
  };

  return (
    <div style={containerStyles}>
      <div style={cellStyles}>Active Bets: {activeBets.length}</div>
      <div style={cellStyles}>Balance: {balance}</div>
    </div>
  );
};

export default Balance;
