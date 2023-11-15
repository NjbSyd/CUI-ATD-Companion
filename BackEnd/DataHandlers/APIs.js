import axios from "axios";

export const RailwayAPI = axios.create({
  baseURL: "https://cui-atd-companion-scrapper-production.up.railway.app/",
});
export const RenderAPI = axios.create({
  baseURL: "https://timetable-scrapper.onrender.com/",
});
export const DigitalOceanAPI = axios.create({
  baseURL: "https://www.server.m-nawa-z-khan.rocks/",
});
