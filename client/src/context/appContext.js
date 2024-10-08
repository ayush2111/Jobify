import React, { useReducer, useContext, useEffect } from "react";
import axios from "axios";
import reducer from "./reducer";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
} from "./actions";

const token = localStorage.getItem("token");
const userLocation = localStorage.getItem("location");
const user = localStorage.getItem("user");

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  jobLocation: userLocation || "",
  showSidebar: false,
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobTypeOptions: ["Full-time", "Part-time", "Remote", "Intership"],
  jobType: "Full-time",
  statusOptions: ["Pending", "Interview", "Declined"],
  status: "Pending",
  jobs: [],
  totalJobs: 0,
  numofPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
  findDisplay: false,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: "/",
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });
  const displayAlert = () => {
    clearAlert();
    dispatch({ type: DISPLAY_ALERT });
  };

  const clearAlert = () => {
    dispatch({ type: CLEAR_ALERT });
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };
  // ...

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("location");
  };

  const addUserToLocalStorage = ({ user, token, location }) => {
    removeUserFromLocalStorage();
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };
  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post(`/auth/register`, currentUser);
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
      displayAlert();
    }
    setTimeout(() => {
      clearAlert();
    }, 4000);
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post(`/auth/login`, currentUser);
      const { user, token, location } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
      displayAlert(); // Display the alert for login error
    }
    setTimeout(() => {
      clearAlert();
    }, 4000);
  };
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);
      const { user, location, token } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      });
      addUserToLocalStorage({ user, location, token });
    } catch (error) {
      dispatch({
        type: UPDATE_USER_ERROR,
        payload: { msg: error },
      });
      removeUserFromLocalStorage();
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({
      type: "HANDLE_CHANGE",
      payload: { name, value },
    });
  };
  const clearValue = () => {
    dispatch({ type: CLEAR_VALUES });
  };
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post("/jobs/addJob", {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: CREATE_JOB_ERROR, payload: { msg: error } });
    }
  };
  const getJobs = async () => {
    const { search, searchStatus, searchType, sort } = state;
    let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      console.log(jobs);
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };
  useEffect(() => {
    getJobs();
    // eslint-disable-next-line
  }, []);

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      logoutUser();
    }
  };
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({
        type: EDIT_JOB_SUCCESS,
      });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error },
      });
    }
    clearAlert();
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch("/jobs/stats");
      console.log(data);
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }

    clearAlert();
  };
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        clearAlert,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValue,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
