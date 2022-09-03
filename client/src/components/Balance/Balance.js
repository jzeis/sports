import React from 'react';
import CurrencyFormat from 'react-currency-format';
import AccountMenu from '../Navbar/Menu';

const Balance = (props) => {
  console.log(props);
  const { balance, activeBets = [] } = props;

  const containerStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'none',
    background: '#121212',
    borderTop: '2px solid yellow',
  };

  const flexContainerStyles = {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'none',
    justifyContent: 'space-evenly',
    padding: 5,
    alignItems: 'center'
  }

  const menuStyles = {
    flex: '0 0 75px',
    display: 'flex',
    justifyContent: 'center'

  }

  const cellStyles = {
    flex: '0 0 auto',
  };

  return (
    <div style={containerStyles}>
      <div style={menuStyles}>
        <AccountMenu />
      </div>
      <div style={flexContainerStyles}>
        <div style={cellStyles}>Active Bets: {activeBets.length}</div>
        <div style={cellStyles}>Balance: <CurrencyFormat value={balance} displayType={'text'} thousandSeparator={true} prefix={'$'} />
      </div>
    </div>
    </div>
  );
};

export default Balance;
