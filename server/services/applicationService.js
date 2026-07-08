import pool from "../db/pool.js";
import ApiError from "../utils/ApiError.js";

// Helper functions
const buildQueryFilters = (user, { status, search }) => {
  const conditions = [`user_id = $1`];
  const params = [user.id];
  let paramIndex = 2;

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (search) {
    conditions.push(
      `(company ILIKE $${paramIndex} OR role ILIKE $${paramIndex})`,
    );
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;
  return { whereClause, params };
};

const findAndAuthorize = async (applicationId, user) => {
  const { rows } = await pool.query(
    "SELECT * FROM applications WHERE id = $1",
    [applicationId],
  );

  if (rows.length === 0) {
    throw ApiError.notFound("Application not found");
  }

  const application = rows[0];

  if (application.user_id !== user.id) {
    throw ApiError.forbidden(
      "You do not have permission to modify this application",
    );
  }

  return application;
};

const validateStatusTransition = (currentStatus, targetStatus) => {
  if (currentStatus === targetStatus) return;
  if (currentStatus === "Closed") {
    throw ApiError.badRequest("Cannot move status out of Closed stage");
  }
  if (targetStatus === "Closed") return;

  const PIPELINE = ["Applied", "Screening", "Interview", "Offer", "Closed"];
  const currentIndex = PIPELINE.indexOf(currentStatus);
  const targetIndex = PIPELINE.indexOf(targetStatus);

  if (targetIndex !== currentIndex + 1) {
    throw ApiError.badRequest(
      `Invalid status progression from ${currentStatus} to ${targetStatus}`,
    );
  }
};

// GET All Application
export const getAllApplications = async (user, query = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sort = "applied_date",
    order = "desc",
  } = query;

  const allowedSorts = ["applied_date", "created_at", "company", "status"];
  const sortColumn = allowedSorts.includes(sort) ? sort : "applied_date";
  const sortOrder = order === "asc" ? "ASC" : "DESC";

  const { whereClause, params } = buildQueryFilters(user, { status, search });

  // 1. Get total count
  const countSql = `
    SELECT COUNT(*) as total
    FROM applications
    ${whereClause}
  `;
  const countResult = await pool.query(countSql, params);
  const total = parseInt(countResult.rows[0].total, 10);

  // 2. Paginated results
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  const paginatedParams = [...params];
  const paramIndex = paginatedParams.length + 1;
  paginatedParams.push(limitNum, offset);

  const sql = `
    SELECT a.*
    FROM applications a
    ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const { rows } = await pool.query(sql, paginatedParams);
  const pages = Math.ceil(total / limitNum);

  return {
    applications: rows,
    pagination: {
      total,
      pages,
      current: pageNum,
    },
  };
};

// Create Application
export const createApplication = async (user, data) => {
  const { rows } = await pool.query(
    `INSERT INTO applications (user_id, company, role, location, status, applied_date, next_follow_up_date, salary_expectation, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      user.id,
      data.company,
      data.role,
      data.location,
      data.status || "Applied",
      data.appliedDate,
      data.nextFollowUpDate || null,
      data.salaryExpectation || null,
      data.notes || null,
    ],
  );

  return rows[0];
};

// Update Application
export const updateApplication = async (applicationId, user, data) => {
  const application = await findAndAuthorize(applicationId, user);

  if (data.status) {
    validateStatusTransition(application.status, data.status);
  }

  const fields = [];
  const values = [];
  let paramIndex = 1;

  const fieldMap = {
    company: "company",
    role: "role",
    location: "location",
    status: "status",
    appliedDate: "applied_date",
    nextFollowUpDate: "next_follow_up_date",
    salaryExpectation: "salary_expectation",
    notes: "notes",
  };

  for (const [jsKey, dbColumn] of Object.entries(fieldMap)) {
    if (data[jsKey] !== undefined) {
      let value = data[jsKey];
      if (
        (jsKey === "nextFollowUpDate" || jsKey === "salaryExpectation") &&
        value === ""
      ) {
        value = null;
      }
      fields.push(`${dbColumn} = $${paramIndex++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    throw ApiError.badRequest("No fields to update");
  }

  fields.push(`updated_at = NOW()`);
  values.push(applicationId);

  values.push(user.id);

  const sql = `
    UPDATE applications
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
    RETURNING *
  `;

  const { rows } = await pool.query(sql, values);
  return rows[0];
};

// Update Application Status
export const updateApplicationStatus = async (applicationId, user, status) => {
  const application = await findAndAuthorize(applicationId, user);
  validateStatusTransition(application.status, status);

  const { rows } = await pool.query(
    `UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *`,
    [status, applicationId, user.id],
  );

  return rows[0];
};

// Delete Application
export const deleteApplication = async (applicationId, user) => {
  await findAndAuthorize(applicationId, user);

  await pool.query("DELETE FROM applications WHERE id = $1 AND user_id = $2", [
    applicationId,
    user.id,
  ]);
  return { message: "Application deleted successfully" };
};

// GET stats
export const getStats = async (user) => {
  const sql = `
    SELECT status, COUNT(*)::int as count
    FROM applications
    WHERE user_id = $1
    GROUP BY status
  `;

  const { rows } = await pool.query(sql, [user.id]);

  const stats = {
    total: 0,
    Applied: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Closed: 0,
    responseRate: 0,
  };

  rows.forEach(({ status, count }) => {
    stats[status] = count;
    stats.total += count;
  });

  if (stats.total > 0) {
    const responded = stats.total - stats.Applied;
    stats.responseRate = Math.round((responded / stats.total) * 1000) / 10;
  }

  return stats;
};
