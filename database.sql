-- 1. Users Table (Remains Same)
CREATE TABLE users (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_details (
    user_id INT NOT NULL,                          -- Assuming user_id is an integer, use appropriate data type based on your needs
    address VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,                  -- Assuming pincode is a string, can also use INT if purely numeric
    class VARCHAR(50) NOT NULL,                    -- If class refers to something like "12th grade" or "Undergraduate", adjust accordingly
    dob DATE NOT NULL,                             -- Date of birth
    selected_exam VARCHAR(100) NOT NULL,           -- Assuming this stores the name of the selected exam
    tenth_marksheet_url VARCHAR(255) NOT NULL,     -- Assuming URLs to documents
    twelfth_marksheet_url VARCHAR(255) NOT NULL,   -- Assuming URLs to documents
    graduation_url VARCHAR(255) NOT NULL,          -- Assuming URLs to documents
    prev_year_grade_card_url VARCHAR(255) NOT NULL, -- Assuming URLs to documents
    PRIMARY KEY (user_id)                         -- Assuming user_id is the primary key for this table
);


-- 2. Enhanced Enrollments Table (Supports Any Entity Type)
CREATE TABLE enrollments (
    enrollment_id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    entity_type ENUM('BATCH', 'TEST_SERIES', 'COURSE') NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Flexible Payments Table
CREATE TABLE payments (
    payment_id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    entity_type ENUM('BATCH', 'TEST_SERIES', 'COURSE', 'OTHER') NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Batches Table (Now without cost since payments are separate)
CREATE TABLE batches (
    batch_id VARCHAR(255) NOT NULL PRIMARY KEY,
    batch_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Test Series Table (Independent of batches)
CREATE TABLE test_series (
    series_id VARCHAR(255) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_tests INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Courses Table (Belongs to a batch)
CREATE TABLE courses (
    course_id VARCHAR(255) NOT NULL PRIMARY KEY,
    batch_id VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    description TEXT,
    allow_notes_download BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE
);

-- 7. Classes Table (Belongs to a course)
CREATE TABLE classes (
    class_id VARCHAR(255) NOT NULL PRIMARY KEY,
    course_id VARCHAR(255) NOT NULL,
    teacher_id VARCHAR(255) NOT NULL,
    class_title VARCHAR(255),
    class_date_time DATETIME NOT NULL,
    recording_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 8. Unified Tests Table (Now properly belongs to courses or test series)
CREATE TABLE tests (
    test_id VARCHAR(255) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    test_type ENUM('COURSE_TEST', 'SERIES_TEST', 'STANDALONE') NOT NULL,
    -- For course tests
    course_id VARCHAR(255) NULL,
    -- For series tests
    series_id VARCHAR(255) NULL,
    -- Common fields
    schedule_start DATETIME NOT NULL,
    schedule_end DATETIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    total_marks INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (series_id) REFERENCES test_series(series_id) ON DELETE CASCADE,
    CHECK (
        (test_type = 'STANDALONE' AND course_id IS NULL AND series_id IS NULL) OR
        (test_type = 'COURSE_TEST' AND course_id IS NOT NULL AND series_id IS NULL) OR
        (test_type = 'SERIES_TEST' AND series_id IS NOT NULL AND course_id IS NULL)
    )
);

-- 9. Unified Questions Table
CREATE TABLE questions (
    question_id VARCHAR(255) NOT NULL PRIMARY KEY,
    test_id VARCHAR(255) NOT NULL,
    question_type ENUM('MCQ', 'MSQ', 'NAT') NOT NULL,
    question_text TEXT NOT NULL,
    image_url VARCHAR(255),
    positive_marks INT NOT NULL,
    negative_marks INT NOT NULL,
    section VARCHAR(100),
    FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE
);

-- 10. Unified Options Table
CREATE TABLE options (
    option_id VARCHAR(255) NOT NULL PRIMARY KEY,
    question_id VARCHAR(255) NOT NULL,
    option_text TEXT,
    image_url VARCHAR(255),
    is_correct BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- 11. Unified Student Responses
CREATE TABLE student_responses (
    response_id VARCHAR(255) NOT NULL PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    test_id VARCHAR(255) NOT NULL,
    question_id VARCHAR(255) NOT NULL,
    selected_option_ids VARCHAR(255), -- For MSQ (Multiple Select Questions)
    given_answer TEXT,        -- For NAT (Numerical Answer Type)
    response_time INT,        -- Time taken in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- 12. Unified Scores Table
CREATE TABLE student_scores (
    score_id VARCHAR(255) NOT NULL PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    test_id VARCHAR(255) NOT NULL,
    raw_score DECIMAL(5,2) NOT NULL,
    normalized_score DECIMAL(5,2),
    percentile DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_test_student (test_id, student_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE
);