-- Add patient_id column to analyses table
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_analyses_patient_id ON analyses(patient_id);
