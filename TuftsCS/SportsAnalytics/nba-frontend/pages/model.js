import Head from "next/head";
import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Scatterplot from "../components/scatterplot";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(new Array(53));
  const [dataFetched, setDataFetched] = useState(false);
  const [data, setData] = useState({});
  const [featuredPlayer, setFeaturedPlayer] = useState({});

  const handleSubmit = () => {
    if (playerInfo.some((x) => x === undefined || x === NaN)) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      /* fetch model data */
      fetch("https://nba-predictor-backend.herokuapp.com/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerInfo: playerInfo,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          setData(data);
          setFeaturedPlayer({
            firstName: data.closest_player[0][0][1].split(" ")[0],
            lastName: data.closest_player[0][0][1].split(" ")[1],
            honorableMentions: [
              data.closest_player[1][0][1],
              data.closest_player[2][0][1],
            ],
            seasonsPlayed: data.closest_player[0][0][2],
            ws48: data.closest_player[0][0][3],
            career_obpm: data.closest_player[0][0][4],
            career_dbpm: data.closest_player[0][0][5],
            career_bpm: data.closest_player[0][0][6],
            career_vorp: data.closest_player[0][0][7],
            drafted: data.closest_player[0][0][8],
          });
          setDataFetched(true);
          setLoading(false);
        });
    }, 2000);
  };

  useEffect(() => {
    /* set intial values for playerInfo */
    let newPlayerInfo = [...playerInfo];
    /* undrafted players not allowed */
    newPlayerInfo[1] = 0;
    /* set intial values for position */
    newPlayerInfo[3] = 1;
    newPlayerInfo[4] = 0;
    newPlayerInfo[5] = 0;
    /* set initial values for position season 2 */
    newPlayerInfo[28] = 1;
    newPlayerInfo[29] = 0;
    newPlayerInfo[30] = 0;

    setPlayerInfo(newPlayerInfo);
  }, []);

  const updateInputs = (e) => {
    let newPlayerInfo = [...playerInfo];
    const playerIndex = parseInt(e.target.attributes.dataIndex.value);
    if (e.target.name === "position1" || e.target.name === "position2") {
      if (e.target.value === "guard") {
        newPlayerInfo[playerIndex] = 1;
        newPlayerInfo[playerIndex + 1] = 0;
        newPlayerInfo[playerIndex + 2] = 0;
      } else if (e.target.value === "forward") {
        newPlayerInfo[playerIndex] = 0;
        newPlayerInfo[playerIndex + 1] = 1;
        newPlayerInfo[playerIndex + 2] = 0;
      } else if (e.target.value === "center") {
        newPlayerInfo[playerIndex] = 0;
        newPlayerInfo[playerIndex + 1] = 0;
        newPlayerInfo[playerIndex + 2] = 1;
      }
    } else {
      newPlayerInfo[playerIndex] = parseFloat(e.target.value);
    }
    setPlayerInfo(newPlayerInfo);
  };

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="split left">
          <h1 className="title">Create Your Player</h1>

          <p className="description">
            The most accurate Player Prediction ML Model you can use.
          </p>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Player Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div>
                  <br />
                  <label>
                    Draft Pick (1-60):
                    <input
                      name="draftPick"
                      dataIndex={0}
                      onChange={updateInputs}
                    />
                  </label>
                  <br />
                  <label>
                    Rookie age:
                    <input
                      name="rookieAge"
                      dataIndex={2}
                      onChange={updateInputs}
                    />
                  </label>
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Season 1 Stats</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div>
                  <label>
                    Position
                    <select
                      onChange={updateInputs}
                      name="position1"
                      dataIndex={3}
                      id="position1"
                    >
                      <option value="guard">Guard</option>
                      <option value="forward">Forward</option>
                      <option value="center">Center</option>
                    </select>
                  </label>
                  <br />
                  <label>
                    Games
                    <input dataIndex={6} onChange={updateInputs} name="G1" />
                  </label>{" "}
                  <br />
                  <label>
                    Minutes Played
                    <input dataIndex={7} onChange={updateInputs} name="MP1" />
                  </label>{" "}
                  <br />
                  <label>
                    Player Efficiency Rating
                    <input dataIndex={8} onChange={updateInputs} name="PER1" />
                  </label>{" "}
                  <br />
                  <label>
                    True Shooting Percentage
                    <input dataIndex={9} onChange={updateInputs} name="TS1" />
                  </label>
                  <br />
                  <label>
                    3-Point Attempt Rate
                    <input
                      dataIndex={10}
                      onChange={updateInputs}
                      name="ThreePAr1"
                    />
                  </label>{" "}
                  <br />
                  <label>
                    Free Throw Attempt Rate
                    <input dataIndex={11} onChange={updateInputs} name="FTr1" />
                  </label>{" "}
                  <br />
                  <label>
                    Offensive Rebound Percentage
                    <input dataIndex={12} onChange={updateInputs} name="ORB1" />
                  </label>{" "}
                  <br />
                  <label>
                    Defensive Rebound Percentage
                    <input dataIndex={13} onChange={updateInputs} name="DRB1" />
                  </label>{" "}
                  <br />
                  <label>
                    Total Rebound Percentage
                    <input dataIndex={14} onChange={updateInputs} name="TRB1" />
                  </label>{" "}
                  <br />
                  <label>
                    AST%
                    <input dataIndex={15} onChange={updateInputs} name="AST1" />
                  </label>{" "}
                  <br />
                  <label>
                    STL%
                    <input dataIndex={16} onChange={updateInputs} name="STL1" />
                  </label>{" "}
                  <br />
                  <label>
                    BLK%
                    <input dataIndex={17} onChange={updateInputs} name="BLK1" />
                  </label>{" "}
                  <br />
                  <label>
                    TOV%
                    <input dataIndex={18} onChange={updateInputs} name="TOV1" />
                  </label>{" "}
                  <br />
                  <label>
                    USG%
                    <input dataIndex={19} onChange={updateInputs} name="USG1" />
                  </label>{" "}
                  <br />
                  <label>
                    OWS (Offensive Win Shares)
                    <input dataIndex={20} onChange={updateInputs} name="OWS1" />
                  </label>{" "}
                  <br />
                  <label>
                    DWS (Defensive Win Shares)
                    <input dataIndex={21} onChange={updateInputs} name="DWS1" />
                  </label>{" "}
                  <br />
                  <label>
                    WS (Win Shares)
                    <input dataIndex={22} onChange={updateInputs} name="WS1" />
                  </label>{" "}
                  <br />
                  <label>
                    WS/48 (Win Shares per 48 Minutes)
                    <input
                      dataIndex={23}
                      onChange={updateInputs}
                      name="WS481"
                    />
                  </label>
                  <br />
                  <label>
                    OBPM (Offensive Box Plus/Minus)
                    <input
                      dataIndex={24}
                      onChange={updateInputs}
                      name="OBPM1"
                    />
                  </label>{" "}
                  <br />
                  <label>
                    DBPM (Defensive Box Plus/Minus)
                    <input
                      dataIndex={25}
                      onChange={updateInputs}
                      name="DBPM1"
                    />
                  </label>{" "}
                  <br />
                  <label>
                    BPM (Box Plus/Minus)
                    <input dataIndex={26} onChange={updateInputs} name="BPM1" />
                  </label>
                  <br />
                  <label>
                    VORP (Value over Replacement Player)
                    <input
                      dataIndex={27}
                      onChange={updateInputs}
                      name="VORP1"
                    />
                  </label>
                  <br />
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Season 2 Stats</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div>
                  <label>
                    Position
                    <select
                      onChange={updateInputs}
                      name="position2"
                      id="position2"
                      dataIndex={28}
                    >
                      <option value="guard">Guard</option>
                      <option value="forward">Forward</option>
                      <option value="center">Center</option>
                    </select>
                  </label>
                  <br />
                  <label>
                    Games
                    <input dataIndex={31} onChange={updateInputs} name="G2" />
                  </label>{" "}
                  <br />
                  <label>
                    Minutes Played
                    <input dataIndex={32} onChange={updateInputs} name="MP2" />
                  </label>{" "}
                  <br />
                  <label>
                    Player Efficiency Rating
                    <input dataIndex={33} onChange={updateInputs} name="PER2" />
                  </label>{" "}
                  <br />
                  <label>
                    True Shooting Percentage
                    <input dataIndex={34} onChange={updateInputs} name="TS2" />
                  </label>
                  <br />
                  <label>
                    3-Point Attempt Rate
                    <input
                      dataIndex={35}
                      onChange={updateInputs}
                      name="ThreePAr2"
                    />
                  </label>{" "}
                  <br />
                  <label>
                    Free Throw Attempt Rate
                    <input dataIndex={36} onChange={updateInputs} name="FTr2" />
                  </label>{" "}
                  <br />
                  <label>
                    Offensive Rebound Percentage
                    <input dataIndex={37} onChange={updateInputs} name="ORB2" />
                  </label>{" "}
                  <br />
                  <label>
                    Defensive Rebound Percentage
                    <input dataIndex={38} onChange={updateInputs} name="DRB2" />
                  </label>{" "}
                  <br />
                  <label>
                    Total Rebound Percentage
                    <input dataIndex={39} onChange={updateInputs} name="TRB2" />
                  </label>{" "}
                  <br />
                  <label>
                    AST%
                    <input dataIndex={40} onChange={updateInputs} name="AST2" />
                  </label>{" "}
                  <br />
                  <label>
                    STL%
                    <input dataIndex={41} onChange={updateInputs} name="STL2" />
                  </label>{" "}
                  <br />
                  <label>
                    BLK%
                    <input dataIndex={42} onChange={updateInputs} name="BLK2" />
                  </label>{" "}
                  <br />
                  <label>
                    TOV%
                    <input dataIndex={43} onChange={updateInputs} name="TOV2" />
                  </label>{" "}
                  <br />
                  <label>
                    USG%
                    <input dataIndex={44} onChange={updateInputs} name="USG2" />
                  </label>{" "}
                  <br />
                  <label>
                    OWS (Offensive Win Shares)
                    <input dataIndex={45} onChange={updateInputs} name="OWS2" />
                  </label>{" "}
                  <br />
                  <label>
                    DWS (Defensive Win Shares)
                    <input dataIndex={46} onChange={updateInputs} name="DWS2" />
                  </label>{" "}
                  <br />
                  <label>
                    WS (Win Shares)
                    <input dataIndex={47} onChange={updateInputs} name="WS2" />
                  </label>{" "}
                  <br />
                  <label>
                    WS/48 (Win Shares per 48 Minutes)
                    <input
                      dataIndex={48}
                      onChange={updateInputs}
                      name="WS482"
                    />
                  </label>{" "}
                  <br />
                  <label>
                    OBPM (Offensive Box Plus/Minus)
                    <input
                      dataIndex={49}
                      onChange={updateInputs}
                      name="OBPM2"
                    />
                  </label>{" "}
                  <br />
                  <label>
                    DBPM (Defensive Box Plus/Minus)
                    <input
                      dataIndex={50}
                      onChange={updateInputs}
                      name="DBPM2"
                    />
                  </label>{" "}
                  <br />
                  <label>
                    BPM (Box Plus/Minus)
                    <input dataIndex={51} onChange={updateInputs} name="BPM2" />
                  </label>{" "}
                  <br />
                  <label>
                    VORP (Value over Replacement Player)
                    <input
                      dataIndex={52}
                      onChange={updateInputs}
                      name="VORP2"
                    />
                  </label>
                  <br />
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </div>

        <div className="split right">
          <h1 className="title">Our Model Says ...</h1>
          {loading && <CircularProgress />}
          {dataFetched && (
            <h2>
              Prediction: {data.classification === 0 ? "Bust" : "Not Bust"}{" "}
            </h2>
          )}
          {dataFetched && (
            <>
              <h3> Career Stats </h3>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Career Length</TableCell>
                    <TableCell align="right">Career WS/48</TableCell>
                    <TableCell align="right"> Offensive Box +/-</TableCell>
                    <TableCell align="right"> Defensive Box +/-</TableCell>
                    <TableCell align="right"> Overall Box +/- </TableCell>
                    <TableCell align="right"> VORP </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="right">
                      {data.career_length[0].toFixed(2) <= 1
                        ? `< 1 year`
                        : `${data.career_length[0].toFixed(2)} yrs`}
                    </TableCell>
                    <TableCell align="right">
                      {data.career_ws48[0].toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {data.career_obpm[0].toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {data.dbpm[0].toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {data.bpm[0].toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {data.career_vorp[0].toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {/* split into two columns of equal width and height */}
              <div className="row">
                <div className="col colleft">
                  <h3> Closest Player Comparison</h3>
                  {/* put image side by side to text about player */}
                  <div className="playercomprow">
                    <img
                      src={`https://nba-players.herokuapp.com/players/${featuredPlayer.lastName}/${featuredPlayer.firstName}`}
                      alt="DAL"
                      className="playercompimg"
                    />
                    <div className="playercompcol">
                      <div className="playercompinfo">
                        {dataFetched &&
                          featuredPlayer.firstName +
                            " " +
                            featuredPlayer.lastName}
                      </div>
                      <div className="playercompinfo">
                        Seasons Played:{" "}
                        {dataFetched && parseInt(featuredPlayer.seasonsPlayed)}
                      </div>
                      <div className="playercompinfo">
                        Career WS/48:{" "}
                        {dataFetched &&
                          parseFloat(featuredPlayer.ws48).toFixed(2)}
                      </div>
                      <div className="playercompinfo">
                        Career Offensive +/-:{" "}
                        {dataFetched &&
                          parseFloat(featuredPlayer.career_obpm).toFixed(2)}
                      </div>
                      <div className="playercompinfo">
                        Career Offensive +/-:{" "}
                        {dataFetched &&
                          parseFloat(featuredPlayer.career_dbpm).toFixed(2)}
                      </div>
                      <div className="playercompinfo">
                        Career Overall +/-:{" "}
                        {dataFetched &&
                          parseFloat(featuredPlayer.career_bpm).toFixed(2)}
                      </div>
                      <div className="playercompinfo">
                        Career VORP:{" "}
                        {dataFetched &&
                          parseFloat(featuredPlayer.career_vorp).toFixed(
                            2
                          )}{" "}
                      </div>
                      <div className="playercompinfo">
                        Draft Pick:{" "}
                        {dataFetched && parseInt(featuredPlayer.drafted)}
                      </div>
                    </div>
                  </div>
                  <div className="honorablementions">
                    <h3> Honorable Mentions</h3>
                    <div>
                      <Chip
                        color="primary"
                        clickable={false}
                        className="player-chip"
                        label={
                          dataFetched
                            ? featuredPlayer.honorableMentions[0]
                            : "Loading.."
                        }
                        variant="outlined"
                      />
                      <Chip
                        color="primary"
                        clickable={false}
                        className="player-chip"
                        label={
                          dataFetched
                            ? featuredPlayer.honorableMentions[1]
                            : "Loading.."
                        }
                        variant="outlined"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  {" "}
                  {dataFetched && (
                    <Scatterplot
                      careerLength={data.career_length[0].toFixed(2)}
                      OBPM={data.career_obpm[0].toFixed(2)}
                      DBPM={data.dbpm[0].toFixed(2)}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer>
        <a
          href="https://www.cs.tufts.edu/comp/152SAN/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/mmonro02.png" alt="mmonro" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .split {
          height: 100%;
          width: 100%;
          position: fixed;
          z-index: 1;
          top: 0;
          overflow-x: hidden;
          padding-top: 20px;
        }

        .row {
          padding-top: 35px;
          display: flex;
        }

        .col {
          flex: 50%;
        }

        .playercompcol {
          display: inline;
        }

        .playercomprow {
          height: 100px;
          width: 100%;
        }

        .colleft {
          border-right: 1px solid #eaeaea;
        }

        .left {
          width: 40%;
          left: 0;
          border-right: 1px solid #eaeaea;
          padding-right: 25px;
        }
        .secondcomprow {
          margin-top: 10px;
        }

        .playerChip {
          padding-margin: 10px;
        }

        .right {
          margin-left: 20px;
          width: 60%;
          right: 0;
        }

        .honorablementions {
          padding-top: 35px;
        }

        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .playercompimg {
          display: inline;
          width: 100px;
          height: 100%;
          object-fit: cover;
          float: left;
        }

        .playercompinfo {
          margin-left: 20px;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 25px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
