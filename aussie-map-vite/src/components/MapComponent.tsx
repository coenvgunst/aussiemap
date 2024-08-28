import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";

// URL to the Australian states GeoJSON file
const geoUrl =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/australia.geojson";

// Define the regions and adjacency matrix for the map
const regions = [
  "Western Australia",
  "Northern Territory",
  "South Australia",
  "Queensland",
  "New South Wales",
  "Victoria",
  "Tasmania",
  "Australian Capital Territory",
];

const adjacencyMatrix = [
  // WA, NT, SA, QLD, NSW, VIC, TAS, ACT
  [0, 1, 1, 0, 0, 0, 0, 0], // Western Australia (WA)
  [1, 0, 1, 1, 0, 0, 0, 0], // Northern Territory (NT)
  [1, 1, 0, 1, 1, 1, 0, 0], // South Australia (SA)
  [0, 1, 1, 0, 1, 0, 0, 0], // Queensland (QLD)
  [0, 0, 1, 1, 0, 1, 0, 1], // New South Wales (NSW)
  [0, 0, 1, 0, 1, 0, 1, 0], // Victoria (VIC)
  [0, 0, 0, 0, 0, 1, 0, 0], // Tasmania (TAS)
  [0, 0, 0, 0, 1, 0, 0, 0], // Australian Capital Territory (ACT)
];

const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"];

function colorMap(
  regions: string[],
  adjacencyMatrix: number[][],
  colors: string[]
): Record<string, string> {
  const regionColors: Record<string, string> = {};
  const availableColors: boolean[] = new Array(colors.length).fill(true);

  for (let i = 0; i < regions.length; i++) {
    availableColors.fill(true);

    for (let j = 0; j < regions.length; j++) {
      if (adjacencyMatrix[i][j] === 1 && regionColors[regions[j]]) {
        const colorIndex = colors.indexOf(regionColors[regions[j]]);
        availableColors[colorIndex] = false;
      }
    }

    const colorIndex = availableColors.findIndex((available) => available);
    if (colorIndex !== -1) {
      regionColors[regions[i]] = colors[colorIndex];
    } else {
      console.error(`No available color for region: ${regions[i]}`);
    }
  }

  return regionColors;
}

const coloredRegions = colorMap(regions, adjacencyMatrix, colors);

type GeographyType = {
  rsmKey: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
};

const MapComponent: React.FC = () => {
  const [tooltipContent, setTooltipContent] = useState<string>("");

  return (
    <div className="map-container">
      <ComposableMap
        projection="geoMercator"
        width={1400}
        height={1000}
        projectionConfig={{
          scale: 1100,
          center: [135, -28],
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: GeographyType[] }) =>
            geographies.map((geo: GeographyType) => {
              const stateName = geo.properties.name;
              const fillColor = coloredRegions[stateName] || "#D6D6DA";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setTooltipContent(stateName);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: { fill: fillColor, outline: "none" },
                  }}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={stateName}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <ReactTooltip id="tooltip" />
    </div>
  );
};

export default MapComponent;
