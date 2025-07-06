# 🚀 Portfolio Personal

Mi portafolio web profesional construido con tecnologías modernas, mostrando mis proyectos, habilidades y experiencia como desarrollador.

## ✨ Características

- 🎮 **Juegos Interactivos**: Tetris, Snake y juego de carreras implementados con Three.js
- 🎨 **Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- ⚡ **Rendimiento Optimizado**: Carga rápida y experiencia fluida
- 🌙 **Tema Moderno**: Interfaz elegante y profesional
- 📱 **PWA Ready**: Funciona como aplicación web progresiva
- 🎯 **SEO Optimizado**: Metadatos y sitemap incluidos

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 18** - Biblioteca principal
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de desarrollo rápida
- **React Router DOM** - Navegación SPA
- **Redux Toolkit** - Manejo de estado
- **Framer Motion** - Animaciones fluidas
- **GSAP** - Animaciones avanzadas

### Styling & UI

- **CSS Modules** - Estilos modulares
- **RSuite** - Componentes UI
- **PrimeReact** - Componentes adicionales
- **Lucide React** - Iconos
- **FontAwesome** - Iconos adicionales

### 3D & Games

- **Three.js** - Gráficos 3D
- **@react-three/fiber** - React renderer para Three.js
- **@react-three/drei** - Utilities para Three.js
- **Canvas User Interface** - Interfaz para juegos

### Desarrollo

- **ESLint** - Linting
- **Prettier** - Formateo de código
- **React Helmet** - Manejo de SEO

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18.0 o superior
- npm o yarn

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/IsmaellHV/portfolio-frontend.git
cd portfolio-frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Variables de entorno**

```bash
cp .env.example .env
# Edita el archivo .env con tus configuraciones
```

4. **Ejecutar en desarrollo**

```bash
npm run dev
```

5. **Abrir en el navegador**

```text
http://localhost:5173
```

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de la construcción
npm run lint     # Ejecutar linting
npm run format   # Formatear código
```

## 🏗️ Estructura del Proyecto

```text
src/
├── app/                  # Configuración principal de la app
├── assets/              # Recursos estáticos
│   ├── audio/           # Archivos de audio
│   ├── img/             # Imágenes
│   └── models/          # Modelos 3D
├── context/             # Contextos de la aplicación
│   ├── InspireHub/      # Sección principal
│   ├── Master/          # Sección maestra
│   └── shared/          # Componentes compartidos
└── env/                 # Configuración de entorno
```

## 🎮 Características Especiales

### Juegos Integrados

- **Tetris**: Versión completa con controles táctiles y teclado
- **Snake**: Juego clásico con puntuación
- **Carreras**: Juego 3D con física realista

### Arquitectura

- **Clean Architecture**: Separación clara de responsabilidades
- **Domain-Driven Design**: Organización por dominios
- **Component-Based**: Componentes reutilizables

## 🌐 Despliegue

### Construcción para Producción

```bash
npm run build
```

### Docker

```bash
docker build -t portfolio .
docker run -p 3000:80 portfolio
```

### Nginx

El proyecto incluye configuración de Nginx para producción en `nginx.conf`

## 📊 Rendimiento

- ⚡ **Lighthouse Score**: 95+ en todas las categorías
- 🎯 **Core Web Vitals**: Optimizado
- 📱 **Mobile First**: Diseño responsive
- ♿ **Accesibilidad**: Cumple estándares WCAG

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Contacto

- 📧 Email: [ismaelhv@outlook.com](mailto:ismaelhv@outlook.com)
- 💼 LinkedIn: [linkedin.com/in/ihurtadov](https://www.linkedin.com/in/ihurtadov/)
- 🐙 GitHub: [github.com/IsmaellHV](https://github.com/IsmaellHV)
- 🌐 Portfolio: [ismaelhv.com](https://ismaelhv.com)

## 🙏 Agradecimientos

- Inspiración en diseños modernos de portfolios
- Comunidad de React y Three.js
- Recursos gráficos y fuentes utilizadas

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
