CREATE DATABASE IF NOT EXISTS insurance_db;
USE insurance_db;

-- =========================
-- TABLE: agent_availability
-- =========================
CREATE TABLE agent_availability (
    id BIGINT NOT NULL AUTO_INCREMENT,
    available_date DATE DEFAULT NULL,
    end_time TIME(6) DEFAULT NULL,
    is_booked BIT(1) NOT NULL,
    start_time TIME(6) DEFAULT NULL,
    agent_id BIGINT NOT NULL,
    booked_by_customer_id BIGINT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY agent_id (agent_id),
    KEY booked_by_customer_id (booked_by_customer_id)
);

-- =========================
-- TABLE: agent_profile
-- =========================
CREATE TABLE agent_profile (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    license_number VARCHAR(255) DEFAULT NULL,
    specialization VARCHAR(255) DEFAULT NULL,
    experience_years INT DEFAULT NULL,
    rating DOUBLE DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    bio VARCHAR(255) DEFAULT NULL,
    contact_number VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY user_id (user_id)
);

-- =========================
-- TABLE: appointments
-- =========================
CREATE TABLE appointments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    agent_id BIGINT NOT NULL,
    availability_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    status VARCHAR(255) DEFAULT NULL,
    issue_description VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY customer_id (customer_id),
    KEY agent_id (agent_id),
    KEY availability_id (availability_id)
);

-- =========================
-- TABLE: payments
-- =========================
CREATE TABLE payments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    appointment_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    payment_method VARCHAR(50) DEFAULT NULL,
    payment_date DATE NOT NULL,
    transaction_id VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY appointment_id (appointment_id)
);

-- =========================
-- TABLE: verification_token
-- =========================
CREATE TABLE verification_token (
    id BIGINT NOT NULL AUTO_INCREMENT,
    expiry_date DATETIME(6) DEFAULT NULL,
    token VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY token (token),
    UNIQUE KEY user_id (user_id)
);