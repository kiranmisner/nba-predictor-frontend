import React, { Component } from "react";
// import { ScatterBoard, Lazy } from "react-scatter-board";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

let xData1 = [];
const careerLength = [
  10, 16, 6, 15, 12, 18, 19, 9, 8, 7, 5, 2, 9, 7, 6, 7, 6, 7, 10, 11, 1, 1, 1,
  2, 5, 2, 2, 2, 5, 2, 1,
];

const offensivePlusMinus = [
  7.11, 7.2625, 1.75, -0.64, 4.783333333, 3.1, 1.257894737, 1.833333333, 3.4,
  2.414285714, -1.48, 1.2, -2.522222222, -1.828571429, -1.133333333,
  -1.328571429, -0.2, -2.614285714, 1.55, 1.636363636, -6.5, -5, -8.2, -19.55,
  -4.4, -9.7, -6.25, -6.9, -5.62, -4.35, -10.4,
];

const defensivePlusMinus = [
  0.72, 1.90625, 2.45, 2.373333333, 0.3833333333, -2.711111111, 4.031578947,
  0.9444444444, 2.4875, 2.4, 2.04, 3.1, 0.5555555556, -0.1428571429, -2.6,
  -1.628571429, 2.583333333, 0.8, -2.1, -1.090909091, -2.6, -4.7, -3.1, -1.95,
  1.12, -2.25, -4.05, 0.75, -2.3, -0.9, -3.9,
];

const names = [
  "Stephen Curry",
  "LeBron James",
  "Giannis Antetokounmpo",
  "Dwight Howard",
  "Kevin Durant",
  "Steve Nash",
  "Tim Duncan",
  "Paul George",
  "Kawhi Leonard",
  "Anthony Davis",
  "Andre Roberson",
  "Ben Simmons",
  "Evan Turner",
  "Tyler Zeller",
  "Matthew Dellavedova",
  "Austin Rivers",
  "Mason Plumlee",
  "Aron Baynes",
  "Patrick Mills",
  "Goran Dragic",
  "John Coughran",
  "Cheese Johnson",
  "Antonio Anderson",
  "Darius Johnson-Odom",
  "Hasheem Thabeet",
  "Xavier Silas",
  "Courtney Sims",
  "Solomon Alabi",
  "Byron Mullens",
  "Esteban Batista",
  "Troy Bell",
];
let xData3 = [];
let yData3 = [];
let zData3 = [];

let cluster1 = {
  x: careerLength,
  y: offensivePlusMinus,
  z: defensivePlusMinus,
  mode: "markers",
  type: "scatter3d",
  marker: {
    color: "blue",
    size: 12,
    symbol: "circle",
  },
  text: names,
  legendgrouptitle: "NBA Players",
  name: "NBA Players",
  hovertemplate:
    "%{text} <br>" +
    "<b>Career Length</b>: %{x}" +
    "<br><b>Offensive +/-</b>: %{y}<br>" +
    "<b>Defensive +/-</b>: %{z}<br>",
};

let cluster3 = {
  x: xData3,
  y: yData3,
  z: zData3,
  mode: "markers",
  type: "scatter3d",
  marker: {
    color: "red",
    size: 12,
    symbol: "circle",
    width: 0.5,
  },
  opacity: 0.8,
  /* bad players in NBA history */
  text: [
    "Kwame Brown",
    "Greg Oden",
    "Anthony Bennett",
    "Devin Harris",
    "Hasheem Thabeet",
    "LaRue Martin",
  ],
  name: "Bust",
  hovertemplate:
    "%{text} <br>" +
    "<b>Career Length</b>: %{x}" +
    "<br><b>Offensive +/-</b>: %{y}<br>" +
    "<b>Defensive +/-</b>: %{z}<br>",
};

var layout = {
  width: 550,
  height: 550,
  scene: {
    xaxis: { title: "Career Length" },
    yaxis: { title: "Offensive +/-" },
    zaxis: { title: "Defensive +/-" },
  },
  title: {
    text: "Comparison Against Other NBA Players",
    font: {
      family: "Courier New, monospace",
      size: 14,
    },
    xref: "paper",
    x: 0.05,
  },
  xaxis: {
    title: {
      text: "Career Length",
      font: {
        family: "Courier New, monospace",
        size: 18,
        color: "#7f7f7f",
      },
    },
  },
  yaxis: {
    title: {
      text: "Offensive +/-",
      font: {
        family: "Courier New, monospace",
        size: 18,
        color: "#7f7f7f",
      },
    },
  },
  zaxis: {
    title: {
      text: "Defensive +/-",
      font: {
        family: "Courier New, monospace",
        size: 18,
        color: "#7f7f7f",
      },
    },
  },
};

const Scatterplot = ({ careerLength, OBPM, DBPM }) => {
  console.log(careerLength, OBPM, DBPM);
  const cluster2 = {
    x: [careerLength],
    y: [OBPM],
    z: [DBPM],
    mode: "markers",
    type: "scatter3d",
    marker: {
      color: "gold",
      size: 12,
      symbol: "circle",
    },
    text: ["Your potential player"],
    name: "Your Potential Player",
    hovertemplate:
      "%{text} <br>" +
      "<b>Career Length</b>: %{x}" +
      "<br><b>Offensive +/-</b>: %{y}<br>" +
      "<b>Defensive +/-</b>: %{z}<br>",
  };
  return (
    <div className="App">
      {React.createElement(Plot, {
        data: [cluster1, cluster2],
        layout: layout,
        responsiveness: true,
      })}
    </div>
  );
};
export default Scatterplot;
