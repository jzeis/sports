import { Button } from '@mui/material';
import { betTypes } from 'constants/betTypes.constants';
import { default as React, useState } from 'react';
import CurrencyFormat from 'react-currency-format';

const GameRow = (props) => {
  const { game, placeBetFunc, maxBet } = props;
  const homeTeamObj = game.teams.find((team) => team.homeAway === 'home');
  const awayTeamObj = game.teams.find((team) => team.homeAway === 'away');

  const homeTeamSpread = {
    team: homeTeamObj.abbreviation,
    points: homeTeamObj.odds.spread,
    type: betTypes.points,
  };

  const awayTeamSpread = {
    team: awayTeamObj.abbreviation,
    points: awayTeamObj.odds.spread,
    type: betTypes.points,
  };

  const underObj = {
    team: `${homeTeamObj.abbreviation}/${awayTeamObj.abbreviation}`,
    points: homeTeamObj.odds.overUnder || '50',
    type: betTypes.under,
  };

  const overObj = { ...underObj, type: betTypes.over };

  const [teamBet, setTeamBet] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = {
    containerStyles: {
      border: '0 solid yellow',
      borderWidth: '1px 0 0 0',
      padding: '20px 8px',
      display: 'grid',
      textAlign: 'center',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gridTemplateRows: 'auto auto 1fr 1fr',
      gridGap: '10px',
      gridTemplateAreas:
       `'spreadHeader spreadHeader spreadHeader spreadHeader'
       'label1 label2 label3 label4'
       'awayTeam awaySpread under amount'
       'homeTeam homeSpread over amount'`,
    },
    spreadHeader: {
      gridArea: 'spreadHeader',
    },
    gridLabel: {
      gridArea: 'label',
    },
    gridHomeTeam: {
      gridArea: 'homeTeam',
    },
    gridAwayTeam: {
      gridArea: 'awayTeam',
    },
    gridHomeSpread: {
      gridArea: 'homeSpread',
    },
    gridAwaySpread: {
      gridArea: 'awaySpread',
    },
    gridUnder: {
      gridArea: 'under',
    },
    gridOver: {
      gridArea: 'over',
    },
    gridAmount: {
      gridArea: 'amount',
    },
    gridButton: {
      gridArea: 'button',
    },
  };

  const clearData = () => {
    setTeamBet(null);
    setBetAmount('');
  };

  const placeBet = () => {
    const betObj = {
      ...teamBet,
      amount: betAmount,
      gameDate: game.date,
    };
    placeBetFunc(betObj, clearData);
  };

  return (
    <div>
      <div style={styles.containerStyles}>
        <p className="spread-header" style={styles.spreadHeader}>{awayTeamObj.displayName} <span className="at-separator">at</span> {homeTeamObj.displayName}</p>
        <div style={{ gridArea: 'label1' }} className="label" />
        <div style={{ gridArea: 'label2' }} className="label">Spread</div>
        <div style={{ gridArea: 'label3' }} className="label">O/U</div>
        <div style={{ gridArea: 'label4' }} className="label">Amount</div>

        {/* <div style={styles.gridAwayTeam} className="team bet-cell"><p>{awayTeamObj.name}</p></div> */}
        <div style={styles.gridAwayTeam} className="team bet-cell"><img height="50" width="50" src={awayTeamObj.logo} alt={awayTeamObj.name} title={awayTeamObj.name} /></div>
        <div style={styles.gridAwaySpread} className="bet-spread bet-cell">
          <input className="bet-input sr-only" type="radio" onChange={() => setTeamBet(awayTeamSpread)} value={awayTeamObj.name} name={`${game.id}-radio`} id={`${game.id}-input-${awayTeamObj.name}`} />
          <label className={`bet-label ${JSON.stringify(teamBet) === JSON.stringify(awayTeamSpread) ? 'selected' : ''}`} htmlFor={`${game.id}-input-${awayTeamObj.name}`}>
            {awayTeamSpread.points}
          </label>
        </div>
        <div style={styles.gridOverUnder} className="under bet-cell">
          <input className="bet-input sr-only" type="radio" onChange={() => setTeamBet(underObj)} value={homeTeamObj.name} name={`${game.id}-radio`} id={`${game.id}-input-under`} />
          <label className={`bet-label ${JSON.stringify(teamBet) === JSON.stringify(underObj) ? 'selected' : ''}`} htmlFor={`${game.id}-input-under`}>
            u{underObj.points}
          </label>
        </div>

        <div style={styles.gridHomeTeam} className="team bet-cell"><img height="50" width="50" src={homeTeamObj.logo} alt={homeTeamObj.name} title={homeTeamObj.name} /></div>
        {/* <div style={styles.gridHomeTeam} className="team bet-cell"><p>{homeTeamObj.name}</p></div> */}
        <div style={styles.gridHomeSpread} className="bet-spread bet-cell">
          <input className="bet-input sr-only" type="radio" onChange={() => setTeamBet(homeTeamSpread)} value={homeTeamObj.name} name={`${game.id}-radio`} id={`${game.id}-input-${homeTeamObj.name}`} />
          <label className={`bet-label ${JSON.stringify(teamBet) === JSON.stringify(homeTeamSpread) ? 'selected' : ''}`} htmlFor={`${game.id}-input-${homeTeamObj.name}`}>
            <span>{homeTeamSpread.points}</span>
          </label>
        </div>
        <div style={styles.gridOverUnder} className="under bet-cell">
          <input className="bet-input sr-only" type="radio" onChange={() => setTeamBet(overObj)} value={homeTeamObj.name} name={`${game.id}-radio`} id={`${game.id}-input-over`} />
          <label className={`bet-label ${JSON.stringify(teamBet) === JSON.stringify(overObj) ? 'selected' : ''}`} htmlFor={`${game.id}-input-over`}>
            o{overObj.points}
          </label>
        </div>
        <div style={styles.gridAmount} className="amount bet-cell">
          <CurrencyFormat
            id={`${game.id}-amount`}
            className="currency-input mb-12"
            decimalScale={0}
            thousandSeparator
            prefix="$"
            type="tel"
            value={betAmount}
            isAllowed={(value) => value.value <= maxBet}
            onValueChange={(value) => setBetAmount(value.value)}
          />
          <label htmlFor={`${game.id}-amount`} className="sr-only">Bet amount</label>
          <Button sx={{textTransform: 'none'}} variant='contained' color="primary" disabled={!teamBet || !betAmount} onClick={() => placeBet()}>Place Bet</Button>
        </div>
      </div>
    </div>
  );
};

export default GameRow;
