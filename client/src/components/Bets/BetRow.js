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

