import axios from "axios";
import {
  ALARM_FAIL,
  ALARM_REQUEST,
  ALARM_SUCSESS,
} from "../types/AlarmConstants";

export const alarmAction =
  (projectType = null, diffdate = null, page = 1, record = 25) =>
  async (dispatch) => {
    try {
      // console.log("qqq", projectType, diffdate);
      console.log('alarm error alarm action ', projectType, diffdate)
      let date = new Date();
      let endDate = date.toLocaleDateString();
      endDate =
        endDate.split("/")[2] +
        "/" +
        endDate.split("/")[1] +
        "/" +
        endDate.split("/")[0];

      let startDate = new Date(
        new Date().setDate(new Date().getDate() - diffdate)
      )
        .toLocaleString()
        .split(",")[0];
      startDate =
        startDate.split("/")[2] +
        "/" +
        startDate.split("/")[1] +
        "/" +
        startDate.split("/")[0];

      console.log("date", startDate, endDate, diffdate, projectType);
      dispatch({
        type: ALARM_REQUEST,
      });
      const token = localStorage.getItem("ddAdminToken");
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      let response;

      response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/logger/logs/alerts/SBXMH?projectType=${projectType}&startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${record}`, //
        config
      );

      dispatch({
        type: ALARM_SUCSESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: ALARM_FAIL,
        payload: error,
      });
    }
  };
