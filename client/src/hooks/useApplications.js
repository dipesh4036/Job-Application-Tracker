import { useReducer, useCallback } from "react";
import {
  applicationReducer,
  initialState,
} from "../reducers/applicationReducer";
import { ACTION_TYPES } from "../reducers/actionTypes";
import * as applicationService from "../services/applicationService";
import { toast } from "sonner";

export const useApplications = () => {
  const [applications, dispatch] = useReducer(applicationReducer, initialState);

  const fetchApplications = useCallback(async (params = {}) => {
    try {
      const response = await applicationService.getApplications(params);
      dispatch({
        type: ACTION_TYPES.SET_ALL,
        payload: response.data.applications,
      });
      return response.data.pagination;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch applications",
      );
    }
  }, []);

  const addApplication = useCallback(async (data) => {
    const response = await applicationService.createApplication(data);
    dispatch({ type: ACTION_TYPES.ADD, payload: response.data.application });
    toast.success("Application added successfully");
    return response.data.application;
  }, []);

  const editApplication = useCallback(async (id, data) => {
    const response = await applicationService.updateApplication(id, data);
    dispatch({ type: ACTION_TYPES.UPDATE, payload: response.data.application });
    toast.success("Application updated successfully");
    return response.data.application;
  }, []);

  const changeStatus = useCallback(async (id, status) => {
    const response = await applicationService.updateApplicationStatus(
      id,
      status,
    );
    dispatch({ type: ACTION_TYPES.UPDATE, payload: response.data.application });
    toast.success(`Status updated to ${status}`);
    return response.data.application;
  }, []);

  const removeApplication = useCallback(async (id) => {
    await applicationService.deleteApplication(id);
    dispatch({ type: ACTION_TYPES.DELETE, payload: id });
    toast.success("Application deleted successfully");
  }, []);

  return {
    applications,
    fetchApplications,
    addApplication,
    editApplication,
    changeStatus,
    removeApplication,
  };
};
