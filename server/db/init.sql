-- Job Application Tracker — Database Schema
-- Run this file against your PostgreSQL instance to initialize the database.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    location VARCHAR(10) NOT NULL CHECK (location IN ('remote', 'onsite', 'hybrid')),
    status VARCHAR(20) NOT NULL DEFAULT 'Applied'
        CHECK (status IN ('Applied', 'Screening', 'Interview', 'Offer', 'Closed')),
    applied_date DATE NOT NULL,
    next_follow_up_date DATE,
    salary_expectation NUMERIC(12, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications(company);
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON applications(user_id, status);
