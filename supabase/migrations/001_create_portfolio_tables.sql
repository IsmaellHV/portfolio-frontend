-- Crear tabla para mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para proyectos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Políticas para contact_messages
-- Permitir insertar mensajes a usuarios anónimos
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Solo usuarios autenticados pueden leer mensajes
CREATE POLICY "Authenticated users can read contact messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden actualizar mensajes
CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para projects
-- Todos pueden leer proyectos
CREATE POLICY "Anyone can read projects" ON projects
  FOR SELECT USING (true);

-- Solo usuarios autenticados pueden insertar proyectos
CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden actualizar proyectos
CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden eliminar proyectos
CREATE POLICY "Authenticated users can delete projects" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insertar algunos proyectos de ejemplo
INSERT INTO projects (title, description, technologies, github_url, demo_url, featured) VALUES
(
  'Portfolio Personal',
  'Mi portfolio personal desarrollado con React, TypeScript y Vite. Incluye secciones para mostrar proyectos, habilidades y información de contacto.',
  ARRAY['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase'],
  'https://github.com/ismaelhv/portfolio',
  'https://ismaelhv.com',
  true
),
(
  'Sistema de Gestión',
  'Aplicación web para gestión empresarial con autenticación, dashboard y reportes.',
  ARRAY['Vue.js', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
  'https://github.com/ismaelhv/management-system',
  null,
  true
),
(
  'API REST',
  'API RESTful para e-commerce con documentación completa y pruebas automatizadas.',
  ARRAY['Node.js', 'Express', 'MongoDB', 'Jest', 'Swagger'],
  'https://github.com/ismaelhv/ecommerce-api',
  null,
  false
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);