# Propiedades AR – Next.js

Este proyecto es una reescritura moderna del gestor inmobiliario, utilizando **Next.js 14**, **React Server Components** y **Tailwind CSS**. Se apoya en **Supabase** para autenticación, almacenamiento de datos y subida de imágenes. El objetivo es ofrecer una experiencia tipo fintech para propietarios que desean controlar su patrimonio inmobiliario.

## Configuración inicial

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env` y completa las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con tu proyecto de Supabase.

3. Ejecuta en modo desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación quedará disponible en `http://localhost:3000`.

## Estructura del proyecto

```
propiedades-app/
├── app/                    # Rutas y componentes de Next.js (App Router)
│   ├── layout.js           # Layout raíz y estilos globales
│   ├── page.js             # Página de inicio
│   ├── login/page.js       # Login y registro de usuarios
│   ├── dashboard/page.js   # Dashboard con resumen y listado de propiedades
│   └── properties/         # Rutas para alta y detalle de propiedades
│       ├── new/page.js     # Formulario de creación de propiedad
│       └── [id]/page.js    # Detalle y edición de una propiedad
├── lib/
│   └── supabaseClient.js   # Cliente de Supabase compartido
├── styles/
│   └── globals.css         # Estilos globales y Tailwind
├── tailwind.config.js      # Configuración de Tailwind
├── postcss.config.js       # Configuración de PostCSS
├── next.config.js          # Configuración de Next.js
├── package.json            # Dependencias y scripts
└── .env.example            # Variables de entorno
```

## Notas

* Este proyecto es un punto de partida; tendrás que crear las tablas `properties` y `payments` en Supabase y ajustar las consultas. La lógica de análisis de mercado se ejecutará mediante Edge Functions o APIs externas en un sprint posterior.
* Para más información sobre Supabase, consulta https://supabase.com/docs.
* No constituye asesoría legal; confirmá con tu contador el cumplimiento de la Ley de Alquileres y la emisión de facturas electrónicas (AFIP).