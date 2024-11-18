import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import { scaleLinear } from "d3-scale";
import "leaflet/dist/leaflet.css";
import { getDataByStates } from "../../../service/userPageApi"; // Ensure this path is correct
import { ManageUserMapWrap } from "./manageUserMap.styles";
const colorScale = scaleLinear()
  .domain([1, 20]) // Adjust this range based on your data
  .range(["#d4e4ff", "#FA5A7D"]);

function ManageUserMap() {
  const [stateData, setStateData] = useState([]);
  const [indiaGeoJson, setIndiaGeoJson] = useState(null);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch("/indiaStates.geojson"); // Load from the public directory
        const geoJsonData = await response.json();
        setIndiaGeoJson(geoJsonData);
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    };

    const fetchData = async () => {
      try {
        const data = await getDataByStates();
        console.log("Fetched state data:", data.usersByState); // Debugging
        setStateData(data.usersByState);
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };

    fetchGeoJson();
    fetchData();
  }, []);

  const getStateCount = (stateName) => {
    const state = stateData.find(
      (item) => item._id.toLowerCase() === stateName.toLowerCase()
    );
    console.log(`State: ${stateName}, Count: ${state ? state.count : 0}`); // Debugging
    return state ? state.count : 0;
  };

  const onEachState = (state, layer) => {
    const stateName = state.properties.NAME_1; // Updated to use NAME_1
    const count = getStateCount(stateName);
    const fillColor = colorScale(count);

    layer.setStyle({
      fillColor,
      fillOpacity: 0.7,
      color: "#2fo4ff",
      weight: 1,
    });

    // Tooltip with state name and count
    layer.bindTooltip(`<strong>${stateName}</strong><br />Users: ${count}`, {
      sticky: true,
    });

    // Log each state's style application for debugging
    console.log(`Applying style for ${stateName}: color ${fillColor}`);
  };

  return (
    <ManageUserMapWrap>
      <h3 className="title">User by States</h3>
      <MapContainer
        center={[20.5937, 78.9629]} // Center coordinates for India
        zoom={5}
        style={{ height: "600px", width: "30vw" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {indiaGeoJson && (
          <GeoJSON data={indiaGeoJson} onEachFeature={onEachState} />
        )}
      </MapContainer>
    </ManageUserMapWrap>
  );
}

export default ManageUserMap;
