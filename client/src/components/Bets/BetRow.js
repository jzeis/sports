// import React, { useState } from 'react';
// import CurrencyFormat from 'react-currency-format';

// const GameRow = (props) => {
//   const { game, placeBetFunc, maxBet } = props;
//   const homeTeamObj = game.spreads.find((team) => team.name === game.home_team);
//   const awayTeamObj = game.spreads.find((team) => team.name === game.away_team);

//   const underObj = {
//     team: `${game.home_team}/${game.away_team}`,
//     points: `${game.overUnder}`,
//     type: 'under',
//   };

//   const overObj = {
//     team: `${game.home_team}/${game.away_team}`,
//     points: `${game.overUnder}`,
//     type: 'over',
//   };

//   const [teamBet, setTeamBet] = useState(null);
//   const [betAmount, setBetAmount] = useState(null);

//   const styles = {
//     containerStyles: {
//       border: '0 solid yellow',
//       borderWidth: '1px 0 0 0',
//       padding: '20px 8px',
//       display: 'grid',
//       textAlign: 'center',
//       gridTemplateColumns: '1fr 1fr 1fr 1fr',
//       gridTemplateRows: 'auto auto 1fr 1fr',
//       gridGap: '10px',
//       gridTemplateAreas:
//        `'spreadHeader spreadHeader spreadHeader spreadHeader'
//        'label1 label2 label3 label4'
//        'awayTeam awaySpread under amount'
//        'homeTeam homeSpread over amount'`,
//     },
//     spreadHeader: {
//       gridArea: 'spreadHeader',
//     },
//     gridLabel: {
//       gridArea: 'label',
//     },
//     gridHomeTeam: {
//       gridArea: 'homeTeam',
//     },
//     gridAwayTeam: {
//       gridArea: 'awayTeam',
//     },
//     gridHomeSpread: {
//       gridArea: 'homeSpread',
//     },
//     gridAwaySpread: {
//       gridArea: 'awaySpread',
//     },
//     gridUnder: {
//       gridArea: 'under',
//     },
//     gridOver: {
//       gridArea: 'over',
//     },
//     gridAmount: {
//       gridArea: 'amount',
//     },
//     gridButton: {
//       gridArea: 'button',
//     },
//   };

//   return (
//     <div>
//       <div style={styles.containerStyles}>
//         <p className="spread-header" style={styles.spreadHeader}>{awayTeamObj.name} <span className="at-separator">at</span> {homeTeamObj.name}</p>
//         <div style={{ gridArea: 'label1' }} className="label" />
//         <div style={{ gridArea: 'label2' }} className="label">Spread</div>
//         <div style={{ gridArea: 'label3' }} className="label">Over/Under</div>
//         <div style={{ gridArea: 'label4' }} className="label">Amount</div>

//         <div style={styles.gridAwayTeam} className="team bet-cell"><p>{awayTeamObj.name.split(' ').pop()}</p></div>
//         <div style={styles.gridAwaySpread} className="bet-spread bet-cell">
//           <input className="bet-input sr-only" type="radio" onChange={() => setTeamBet(awayTeamObj)} value={homeTeamObj.name} name={`${game.id}-radio`} id={`${game.id}-input-${awayTeamObj.name}`} />
//           <label className={`bet-label ${teamBet === awayTeamObj ? 'selected' : ''}`} htmlFor={`${game.id}-input-${awayTeamObj.name}`}>
//             {awayTeamObj.points}
//           </label>
//         </div>
//         <div style={styles.gridOverUnder} className="under bet-cell">
//           <input className="bet-input sr-only" type="radio" onChange={() => setTeamBet(underObj)} value={homeTeamObj.name} name={`${game.id}-radio`} id={`${game.id}-input-under`} />
//           <label className={`bet-label ${teamBet === underObj ? 'selected' : ''}`} htmlFor={`${game.id}-input-under`}>
//             {awayTeamObj.points}
//           </label>
//         </div>

//         <div style={styles.gridHomeTeam} className="team bet-cell"><p>{homeTeamObj.name.split(' ').pop()}</p></div>
//         <div style={styles.gridHomeSpread} className="bet-spread bet-cell">
//           <input className="bet-input sr-only" type="radio" onChange={() => setTeamBet(homeTeamObj)} value={homeTeamObj.name} name={`${game.id}-radio`} id={`${game.id}-input-${homeTeamObj.name}`} />
//           <label className={`bet-label ${teamBet === homeTeamObj ? 'selected' : ''}`} htmlFor={`${game.id}-input-${homeTeamObj.name}`}>
//             <span>{homeTeamObj.points}</span>
//           </label>
//         </div>
//         <div style={styles.gridOverUnder} className="under bet-cell">
//           <input className="bet-input sr-only" type="radio" onChange={() => setTeamBet(overObj)} value={homeTeamObj.name} name={`${game.id}-radio`} id={`${game.id}-input-over`} />
//           <label className={`bet-label ${teamBet === overObj ? 'selected' : ''}`} htmlFor={`${game.id}-input-over`}>
//             {awayTeamObj.points}
//           </label>
//         </div>
//         <div style={styles.gridAmount} className="amount bet-cell">
//           <CurrencyFormat
//             id={`${game.id}-amount`}
//             className="currency-input mb-12"
//             decimalScale={0}
//             thousandSeparator
//             prefix="$"
//             isAllowed={(value) => value.value <= maxBet}
//             onValueChange={(value) => setBetAmount(value.value)}
//           />
//           <label htmlFor={`${game.id}-amount`} className="sr-only">Bet amount</label>
//           <button className="button" type="button" disabled={!teamBet || !betAmount} onClick={() => placeBetFunc(teamBet, betAmount, game.id, game.commence_time)}>Place bet</button>
//         </div>
//       </div>
//       <pre>
//         {underObj.toString()}
//       </pre>
//     </div>
//   );
// };

// export default GameRow;
import { TableCell, TableRow } from '@mui/material';
import React from 'react';
import { formatBetType, formatGameTime } from 'utilities/betOperations';


export default function BetRow(props) {
  const { bet } = props;

  const styles = {
    spreadHeader: {
      gridArea: 'spreadHeader',
    },
    gridLabel: {
      gridArea: 'label',
    },
    gridTeam: {
      gridArea: 'team',
    },
    gridSpread: {
      gridArea: 'spread',
    },
    gridAmount: {
      gridArea: 'amount',
    },
    gridDate: {
      gridArea: 'date',
    },
    gridResult: {
      gridArea: 'result',
    },
  };

  return (
    <TableRow
      key={bet._id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell align="center">{bet.team}</TableCell>
      <TableCell align="center">{formatBetType(bet)}</TableCell>
      <TableCell align="center">${bet.amount}</TableCell>
      <TableCell align="center">{formatGameTime(bet.gameDate)}</TableCell>
      <TableCell align="center">{bet.result}</TableCell>
      {bet.teamName && <TableCell align="center">{bet.teamName}</TableCell>}
    </TableRow>
  );
};

