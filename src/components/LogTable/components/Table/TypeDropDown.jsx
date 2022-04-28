import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTasks } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import CustomeDropDown from "../../../../Container/DropDown";
import Style from "./TypeDropDown.module.scss";
import { getProjectByCode } from "../../../../redux/action/ProjectAction";
import { getCrashFreeUsers } from "../../../../redux/action/LogsAction";
import {
  getLogTypeCounts,
  getLogByDate,
} from "../../../../redux/action/LogsAction";
import { alarmAction } from "../../../../redux/action/AlarmAction";

const TypeDropDown = (props) => {
  const [projectCodeDropDown, setProjectCodeDropDown] = useState(false);

  // dark-mode state
  const ref = useRef();
  const getModelCodeReducer = useSelector((state) => state.getModelCodeReducer);
  const { loading, data } = getModelCodeReducer;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");
  const logTablePageURL = urlParams.get("pagename");
  console.log("logTablePageURL", logTablePageURL);

  const dispatch = useDispatch();

  const ProjectTypeFilter = () => {
    setProjectCodeDropDown(true);
    if (projectCodeDropDown) {
      setProjectCodeDropDown(false);
    }
  };

  // CLICKING OUTSIDE THE VIEWPORT
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // Close when click outside
      if (
        projectCodeDropDown &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setProjectCodeDropDown(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [projectCodeDropDown]);

  const onSubmitFun = (type) => {
    ProjectTypeFilter();
    console.log('alarm error typedrop down ', {...type} )

    localStorage.setItem("page_no", 1);
    localStorage.setItem("project_type", JSON.stringify(type));

    dispatch(
      getProjectByCode(
        props.tableDataState.code,
        props.tableDataState.date,
        props.tableDataState.logtype,
        props.tableDataState.pageNo,
        props.tableDataState.records,
        type.typeCode
      )
    );
    if ((logTablePageURL === "alarm")){
      props.setProjectCode(type.typeCode)
    }
    if ((logTablePageURL === "logtable")) {
      dispatch(
        getCrashFreeUsers({
          code,
          diffDate: props.diffDate,
          code1: type.typeCode,
        })
      );

      dispatch(
        getLogTypeCounts({
          code,
          diffDate: props.diffDate,
          code1: type.typeCode,
        })
      );

      dispatch(
        getLogByDate({ code, diffDate: props.diffDate, code1: type.typeCode })
      );
    }

    // alarm action dispatch
    dispatch(alarmAction(type.typeCode, props.diffDate));
    console.log('alarm error neeraj ki baikaiti...')
  };

  //  TODO: dispatch the code depanding the local storage

  return (
    <>
      {loading ? (
        <p className="darkModeColor">loading..</p>
      ) : (
        <section ref={ref}>
          <section onClick={ProjectTypeFilter} className={Style.OuterDiv}>
            <FontAwesomeIcon
              icon={faTasks}
              color="#2A9AA4"
              style={{ width: "22px", height: "25px" }}
            />
            <p className="m-2 darkModeColor">
              {localStorage.getItem("project_type")
                ? JSON.parse(localStorage.getItem("project_type")).typeName
                : data && data.modelList && data.modelList[0].typeName}
            </p>
            <FontAwesomeIcon
              icon={faCaretDown}
              color="#2A9AA4"
              style={{ width: "10px", height: "20px", marginBottom: "2px" }}
            />
          </section>

          <section>
            {projectCodeDropDown ? (
              <CustomeDropDown
                width="15%"
                position="absolute"
                alignItems="flex-start"
                zIndex="8"
              >
                {data &&
                  data.modelList.map((type) => {
                    return (
                      <p
                        className={`${Style.productVersion} darkModeColor`}
                        onClick={() => onSubmitFun(type)}
                      >
                        {type.typeName}
                      </p>
                    );
                  })}
              </CustomeDropDown>
            ) : null}
          </section>
        </section>
      )}
    </>
  );
};

export default TypeDropDown;
