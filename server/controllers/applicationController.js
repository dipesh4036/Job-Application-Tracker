import asyncHandler from "../utils/asyncHandler.js";
import * as applicationService from "../services/applicationService.js";

export const getAll = asyncHandler(async (req, res) => {
  const result = await applicationService.getAllApplications(
    req.user,
    req.query,
  );
  res.status(200).json({ success: true, data: result });
});

export const create = asyncHandler(async (req, res) => {
  const application = await applicationService.createApplication(
    req.user,
    req.body,
  );
  res.status(201).json({ success: true, data: { application } });
});

export const update = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplication(
    req.params.id,
    req.user,
    req.body,
  );
  res.status(200).json({ success: true, data: { application } });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.user,
    req.body.status,
  );
  res.status(200).json({ success: true, data: { application } });
});

export const remove = asyncHandler(async (req, res) => {
  const result = await applicationService.deleteApplication(
    req.params.id,
    req.user,
  );
  res.status(200).json({ success: true, data: result });
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await applicationService.getStats(req.user);
  res.status(200).json({ success: true, data: { stats } });
});
