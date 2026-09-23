-- Build My Vision - MySQL Database Schema
-- Design Collaboration Platform

CREATE DATABASE IF NOT EXISTS build_my_vision;
USE build_my_vision;

-- 1. Users Table (Customers and Designers)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'designer', 'admin') NOT NULL DEFAULT 'customer',
  avatar TEXT,
  phone VARCHAR(30),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Designer Profiles
CREATE TABLE IF NOT EXISTS designer_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL DEFAULT 'Architectural Designer',
  specializations JSON,
  experience_years INT DEFAULT 3,
  location VARCHAR(120) DEFAULT 'Remote / Global',
  rating DECIMAL(3,2) DEFAULT 4.90,
  reviews_count INT DEFAULT 0,
  completed_projects INT DEFAULT 0,
  bio TEXT,
  education_credentials VARCHAR(255),
  software_tools VARCHAR(255) DEFAULT 'AutoCAD, Revit, SketchUp, Blender, Rhino',
  featured BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Portfolios (Showcase of completed architectural & structural work)
CREATE TABLE IF NOT EXISTS portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  designer_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  category ENUM('residential', 'commercial', 'educational', 'renovation', 'landscape', 'interior') NOT NULL DEFAULT 'residential',
  description TEXT,
  image_url TEXT NOT NULL,
  blueprint_url TEXT,
  style VARCHAR(100) DEFAULT 'Contemporary',
  area_sqft INT,
  location VARCHAR(120),
  year_completed INT,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (designer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Projects (The core "Vision" lifecycle: submission -> matched -> drafting -> review -> final delivery)
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  designer_id INT DEFAULT NULL,
  title VARCHAR(200) NOT NULL,
  building_type ENUM('residential_home', 'school_educational', 'commercial_building', 'retail_cafe', 'tiny_house', 'renovation') NOT NULL,
  plot_dimensions VARCHAR(100),
  num_floors INT DEFAULT 1,
  rooms_needed VARCHAR(255),
  style_preference VARCHAR(120) NOT NULL,
  budget_range VARCHAR(100) DEFAULT 'Mid-range ($50k - $150k)',
  timeline_preference VARCHAR(100) DEFAULT '2 - 4 months',
  description TEXT NOT NULL,
  special_requirements TEXT,
  inspiration_urls JSON,
  technical_summary JSON,
  selected_staircase VARCHAR(100) DEFAULT NULL,
  selected_roof VARCHAR(100) DEFAULT NULL,
  selected_layout VARCHAR(100) DEFAULT NULL,
  status ENUM('submitted', 'designer_assigned', 'concept_drafting', 'client_review', 'final_delivered') NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (designer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Design Proposals / Style Options (Designer sends options e.g. staircase, roof, layout; Customer chooses)
CREATE TABLE IF NOT EXISTS proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  designer_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) DEFAULT 'staircase',
  description TEXT,
  options JSON NOT NULL,
  selected_option_id VARCHAR(50) DEFAULT NULL,
  customer_note TEXT DEFAULT NULL,
  status ENUM('pending', 'decided') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (designer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Project Deliverables (Schematic concepts, 2D floorplans, 3D renderings, blueprints)
CREATE TABLE IF NOT EXISTS deliverables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  designer_id INT NOT NULL,
  stage ENUM('concept_draft', 'schematic_drawings', 'final_delivery') NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) DEFAULT 'image',
  version INT DEFAULT 1,
  status ENUM('pending_review', 'revision_requested', 'approved') NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (designer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Project Revisions & Annotations (Customer pinpoint feedback directly on deliverables)
CREATE TABLE IF NOT EXISTS revisions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  deliverable_id INT NOT NULL,
  project_id INT NOT NULL,
  customer_id INT NOT NULL,
  feedback_text TEXT NOT NULL,
  pin_x DECIMAL(5,2) DEFAULT NULL,
  pin_y DECIMAL(5,2) DEFAULT NULL,
  status ENUM('open', 'addressed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deliverable_id) REFERENCES deliverables(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Real-Time Messages (Direct collaboration between customer and designer)
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message_text TEXT NOT NULL,
  attachment_url TEXT DEFAULT NULL,
  proposal_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Client Reviews & Feedback
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  customer_id INT NOT NULL,
  designer_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (designer_id) REFERENCES users(id) ON DELETE CASCADE
);
