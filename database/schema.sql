CREATE DATABASE IF NOT EXISTS cnr_design_studio;
USE cnr_design_studio;

CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(40) NOT NULL,
    location VARCHAR(120) NOT NULL,
    cover_image VARCHAR(60) NOT NULL,
    description TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL
);


CREATE TABLE IF NOT EXISTS project_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    file_name VARCHAR(60) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    sort_order INT NOT NULL,
    CONSTRAINT fk_project_images_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(160) NOT NULL,
    project_address VARCHAR(200),
    city VARCHAR(80),
    postal_code VARCHAR(20),
    enquiry_type VARCHAR(60),
    role VARCHAR(60),
    budget VARCHAR(60),
    needed_by DATE,
    comments TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    meeting_type VARCHAR(30) NOT NULL,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(160) NOT NULL,
    note TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
    created_at DATETIME NOT NULL,
    CONSTRAINT uk_appointment_slot UNIQUE (appointment_date, appointment_time)
);

CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(160) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    admin_id BIGINT NOT NULL,
    expires_at DATETIME NOT NULL,
    CONSTRAINT fk_admin_sessions_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blocked_days (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blocked_date DATE NOT NULL UNIQUE,
    reason VARCHAR(120)
);

ALTER TABLE appointments
    ADD COLUMN IF NOT EXISTS enquiry_id BIGINT NULL,
    ADD CONSTRAINT fk_appointments_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries (id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS enquiry_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enquiry_id BIGINT NOT NULL,
    admin_id BIGINT NOT NULL,
    note TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_enq_notes_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries (id) ON DELETE CASCADE,
    CONSTRAINT fk_enq_notes_admin FOREIGN KEY (admin_id) REFERENCES admins (id)
);

CREATE TABLE IF NOT EXISTS testimonials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NULL,
    client_name VARCHAR(120) NOT NULL,
    quote TEXT NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_testimonials_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);
