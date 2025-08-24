-- Hacer el campo 'subject' opcional en la tabla contact_messages
ALTER TABLE contact_messages ALTER COLUMN subject DROP NOT NULL;

-- Agregar un valor por defecto para subject
ALTER TABLE contact_messages ALTER COLUMN subject SET DEFAULT 'Mensaje de contacto';