import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faMobile,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import Style from "./EventDataWithDate.module.scss";
import { useSelector } from "react-redux";

export default function EventDataWithDate() {
  const getAllLogByCodeReducer = useSelector(
    (state) => state.getAllLogByCodeReducer
  );

  const {
    data: {
      data: { logs },
    },
  } = getAllLogByCodeReducer;

  // GETTGIN DATA FROM URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // GETTIN ROW DATA
  const rowdevice_types = urlParams.get("rowdevice_types");
  const rowdid = urlParams.get("rowdid");
  let rowlogGeneratedDate = urlParams.get("rowlogGeneratedDate");
  const version = urlParams.get("version");
  const osArchitecture = urlParams.get("osArchitecture");
  const modelName = urlParams.get("modelName");

  // LOG DATE INVERT
  rowlogGeneratedDate = rowlogGeneratedDate.split("T")[0];
  let day = rowlogGeneratedDate.split("-")[2];
  let month = rowlogGeneratedDate.split("-")[1];
  let year = rowlogGeneratedDate.split("-")[0];
  rowlogGeneratedDate = `${day}-${month}-${year}`;

  return (
    <>
      <Row
        className="pt-4"
        style={{ borderBottom: "1px solid rgba(90, 90, 90, 0.234)" }}
      >
        <Col className={`${Style.MainDiv} m-2`}>
          <section className={`${Style.outerSec} p-2`}>
            <p>Event Summary</p>

            <section className="px-4">
              <p>
                <span>
                  <FontAwesomeIcon icon={faClock} />
                </span>
                {rowlogGeneratedDate}
              </p>
            </section>
            
            {version !== "null" ? (
              <section className="px-4">
                <p>
                  <span>
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </span>
                  {version}
                </p>
              </section>
            ) : null}

            {osArchitecture !== "null" ? (
              <section className="px-4">
                <p>
                  <span>
                    <FontAwesomeIcon icon={faAndroid} />
                  </span>
                  {osArchitecture}
                </p>
              </section>
            ) : null}

            {modelName !== "null" ? (
              <section className="px-4">
                <p>
                  <span>
                    <FontAwesomeIcon icon={faMobile} />
                  </span>
                  {modelName}
                </p>
              </section>
            ) : null}

          </section>
        </Col>
      </Row>
    </>
  );
}
