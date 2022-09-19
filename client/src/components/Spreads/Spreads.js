import { addBet } from 'actions/bets.js';
import { getSpreads } from 'actions/spreads.js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GameRow from './GameRow';

export default function SpreadsList(props) {
  const spreadsData = useSelector((state) => state.spreads);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { league, team } = props;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (league && league.currentWeek <= league.endWeek) { dispatch(getSpreads(props.league.currentWeek)); }
  }, [league?.currentWeek]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      console.log('new time set');
    }
      , 60000);
    return () => {
      console.log('interval cleared')
      clearInterval(interval);
    }
  }, [])

  const placeBet = async (betObj, cb = () => null) => {
    const { id } = spreadsData;

    // Get betObj with bet data and add our team id and id for all spreads
    const bet = {
      ...betObj,
      teamId: team._id,
      id,
    };

    setLoading(true);
    await dispatch(addBet(bet));
    cb();
    setLoading(false);
  };

  const spreadsList = () => {
   return spreadsData.spreads
    // .filter(game => {
    //   const currentTime = addMinutes(time, 5);
    //   const gameTime = new Date(game.date);
    //   // console.log(currentTime, gameTime, isBefore(currentTime, gameTime))
    //   return isBefore(currentTime, gameTime);

    // })
    .map((currentGame) => <GameRow game={currentGame} maxBet={team.balance} key={currentGame.id} placeBetFunc={placeBet} />)
  };

  return (
    <div className="container container-bg">
      <h1 className='primary-text' style={{marginBottom: 0}}>Week {league?.currentWeek} Odds</h1>
      {league && league.currentWeek <= league.endWeek ?
        spreadsList()
        : <p>Spreads are not available for leagues that have ended</p>
      }
    </div>
  );
}
