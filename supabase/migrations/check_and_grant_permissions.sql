-- Verificar permisos actuales
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND grantee IN ('anon', 'authenticated') 
  AND table_name IN ('contact_messages', 'projects') 
ORDER BY table_name, grantee;

-- Otorgar permisos a la tabla contact_messages
GRANT SELECT, INSERT ON contact_messages TO anon;
GRANT ALL PRIVILEGES ON contact_messages TO authenticated;

-- Otorgar permisos a la tabla projects
GRANT SELECT ON projects TO anon;
GRANT ALL PRIVILEGES ON projects TO authenticated;

-- Verificar permisos después de otorgarlos
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND grantee IN ('anon', 'authenticated') 
  AND table_name IN ('contact_messages', 'projects') 
ORDER BY table_name, grantee;