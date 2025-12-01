-- Physicians table
CREATE TABLE physicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  specialization VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  physician_id UUID REFERENCES physicians(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  contact VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Remedies table (Materia Medica)
CREATE TABLE remedies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  common_name VARCHAR(255),
  source VARCHAR(255),
  description TEXT,
  characteristics TEXT,
  modalities JSONB,
  mental_symptoms TEXT,
  physical_symptoms TEXT,
  relationships TEXT,
  dosage_info TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Repertory sections
CREATE TABLE repertory_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES repertory_sections(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Repertory symptoms
CREATE TABLE repertory_symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES repertory_sections(id) ON DELETE CASCADE,
  symptom TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Remedy-Symptom relationship (for repertorization)
CREATE TABLE remedy_symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remedy_id UUID REFERENCES remedies(id) ON DELETE CASCADE,
  symptom_id UUID REFERENCES repertory_symptoms(id) ON DELETE CASCADE,
  symptom VARCHAR(500),
  grade INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high intensity
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(remedy_id, symptom_id)
);

-- Consultations
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  physician_id UUID REFERENCES physicians(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  chief_complaint TEXT,
  present_illness TEXT,
  past_history TEXT,
  family_history TEXT,
  physical_examination TEXT,
  mental_symptoms TEXT,
  modalities JSONB,
  selected_symptoms JSONB,
  diagnosis TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  physician_id UUID REFERENCES physicians(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
  remedy_id UUID REFERENCES remedies(id),
  potency VARCHAR(50),
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  duration VARCHAR(100),
  instructions TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Follow-ups
CREATE TABLE followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  physician_id UUID REFERENCES physicians(id) ON DELETE CASCADE,
  improvement TEXT,
  new_symptoms TEXT,
  remedy_response TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_patients_physician ON patients(physician_id);
CREATE INDEX idx_consultations_patient ON consultations(patient_id);
CREATE INDEX idx_consultations_physician ON consultations(physician_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_physician ON prescriptions(physician_id);
CREATE INDEX idx_remedy_symptoms_remedy ON remedy_symptoms(remedy_id);
CREATE INDEX idx_remedy_symptoms_symptom ON remedy_symptoms(symptom_id);
CREATE INDEX idx_repertory_symptoms_section ON repertory_symptoms(section_id);
