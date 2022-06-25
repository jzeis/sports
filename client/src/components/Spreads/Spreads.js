import { addBet } from 'actions/bets.js';
import { getSpreads } from 'actions/spreads.js';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GameRow from './GameRow';

export default function SpreadsList(props) {
  const spreadsData = useSelector((state) => state.spreads);
  const dispatch = useDispatch();
  const { league, team } = props;

  useEffect(() => {
    if (league) { dispatch(getSpreads(props.league.currentWeek)); }
  }, [league?.currentWeek]);

  const placeBet = (betObj) => {
    const { id } = spreadsData;

    // Get betObj with bet data and add our team id and id for all spreads
    const bet = {
      ...betObj,
      teamId: team._id,
      id,
    };

    dispatch(addBet(bet));

    // API.post('/bet/add', bet)
    //   .then(({ data: addedBet }) => {
    //     // const { bets, team } = this.state;
    //     this.setState({ bets: bets.push(bet), team: { ...team, balance: team.balance - addedBet.amount } });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const spreadsList = () => spreadsData.spreads.map((currentGame) => <GameRow game={currentGame} maxBet={team.balance} key={currentGame.id} placeBetFunc={placeBet} />);

  return (
    <div className="container container-bg">
      <h2>Week {league?.currentWeek} Odds</h2>
      <p>Account Balance: {team.balance}</p>
      {spreadsList()}
    </div>
  );
}
