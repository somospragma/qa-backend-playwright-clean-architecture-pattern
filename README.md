<h1 align="center">
  <br>
  <a href="http://www.amitmerchant.com/electron-markdownify"><img src="https://f.hubspotusercontent20.net/hubfs/2829524/Copia%20de%20LOGOTIPO_original-2.png"></a>
  <br>
  Suite de Pruebas Automatizadas con Playwright
  <br>
</h1>

<h4 align="center">Proyecto base para la validación de APIs backend, desarrollado con <a href="https://playwright.dev/" target="_blank">Playwright</a> y TypeScript.</h4>

<p align="center">
  <a href="https://www.oracle.com/java/technologies/javase-jdk11-downloads.html">
    <img src="https://img.shields.io/badge/TypeScript-4+-blue.svg" alt="TypeScript">
  </a>
  <a href="https://playwright.dev/">
    <img src="https://img.shields.io/badge/Playwright-API_Testing-brightgreen.svg" alt="Playwright">
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-16+-green.svg" alt="Node.js">
  </a>
</p>

## Descripción

Este proyecto es una suite de pruebas automatizadas diseñada para validar el comportamiento de diversas APIs backend. Está desarrollado con **Playwright** y organizado bajo una arquitectura modular que permite una fácil escalabilidad y mantenimiento. 

El uso de **TypeScript** asegura un **tipado estricto**, reduciendo errores durante el desarrollo y facilitando la integración entre los módulos del proyecto. Además, incorpora componentes reutilizables, como helpers y contratos, para mantener la consistencia y minimizar la duplicación de código.

<p align="center">
  <a href="#topicos">Tópicos</a> •
  <a href="#tecnologias">Tecnologías</a> •
  <a href="#estructura-del-proyecto">Estructura del Proyecto</a> •
  <a href="#instalacion-y-ejecucion">Instalación y Ejecución</a> •
  <a href="#consideraciones">Consideraciones</a> •
  <a href="#autores">Autores</a> •
  <a href="#roadmap">Roadmap</a>
</p>

## Tópicos

- TypeScript
- Playwright
- Arquitectura modular
- Pruebas automatizadas
- APIs backend

## Tecnologías

### Este proyecto requiere:

- **Node.js** versión 16 o superior.
- **TypeScript** versión 4 o superior.
- **Playwright** última versión.

## Estructura del Proyecto

A continuación, se detalla la estructura del proyecto con una breve descripción de cada carpeta:

```plaintext
├── .env                             # Variables de entorno para configurar el entorno de ejecución
├── .gitignore                       # Lista de archivos y carpetas a ignorar en Git
├── .npmrc                           # Configuración específica para npm
├── package.json                     # Definición del proyecto y dependencias
├── package-lock.json                # Información detallada sobre las dependencias
├── playwright.config.ts             # Configuración principal de Playwright
├── src/                             # Carpeta principal con código fuente
│   ├── common/                      # Componentes comunes reutilizables
│       ├── aplication/              # Lógica de aplicación y casos de uso generales
│           └── uses_cases/          # Implementación de los casos de uso del sistema
│       ├── domain/                  # Lógica de negocio y modelos del dominio
│           ├── entities/            # Entidades centrales del negocio
│           └── helpers/             # Funciones auxiliares o utilidades compartidas
│       └── ports/                   # Interfaces para la comunicación externa (puertos)
│           └── interfaces/          # Definición de interfaces en TypeScript
|               ├── uses_cases/      # Definición de interfaces en TypeScript
|               ├── entities/        # Definición de interfaces en TypeScript
│               └── helpers/         # Definición de interfaces en TypeScript
│   ├── services/                    # Lógica de negocio específica de cada servicio
│       ├── service1/                # Implementación del servicio 1
│           ├── aplication/          # Lógica de aplicación específica del servicio 1
│               └── uses_cases/      # Casos de uso del servicio 1
│           ├── domain/              # Lógica de negocio del servicio 1
│               ├── entities/        # Entidades del dominio del servicio 1
│               └── helpers/         # Utilidades específicas del servicio 1
│           └── ports/               # Puertos e interfaces del servicio 1
│               └── interfaces/      # Definición de interfaces para el servicio 1
|                   ├── uses_cases/  # Definición de interfaces para el servicio 1
|                   ├── entities/    # Definición de interfaces para el servicio 1
│                   └── helpers/     # Definición de interfaces para el servicio 1
│       ├── service2/                # Implementación del servicio 2
│           ├── aplication/          # Lógica de aplicación específica del servicio 2
│               └── uses_cases/      # Casos de uso del servicio 2
│           ├── domain/              # Lógica de negocio del servicio 2
│               ├── entities/        # Entidades del dominio del servicio 2
│               └── helpers/         # Utilidades específicas del servicio 2
│           └── ports/               # Puertos e interfaces del servicio 2
│               └── interfaces/      # Definición de interfaces para el servicio 2
|                   ├── uses_cases/  # Definición de interfaces para el servicio 2
|                   ├── entities/    # Definición de interfaces para el servicio 2
│                   └── helpers/     # Definición de interfaces para el servicio 2
├── tests/                           # Carpeta de pruebas automatizadas con Playwright
│   ├── data/                        # Carpeta con datos de prueba
│   ├── service1/                    # Pruebas del servicio 1
│   ├── service2/                    # Pruebas del servicio 2
```
## Instalación y Ejecución

### Instalación

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/usuario/nombre-proyecto
   cd nombre-proyecto
1. **Instala las dependencias**:
   ```bash
   npm install
### Ejecución de Pruebas
- **Ejecutar todas las pruebas con Playwright**:
   ```bash
   npm run test
- **Ejecutar pruebas específicas**:
   ```bash
   npm run test:service1
### Reportes
- **Ejecutar el reporte de Playwright**:
   ```bash
   npx playwright show-report
   npm run report
## Consideraciones
- **Tipado estricto con TypeScript**:
  Todas las entidades, casos de uso e interfaces están tipadas para asegurar consistencia en todo el proyecto.
- **Reutilización de código**:
  Los componentes en common/ están diseñados para ser reutilizados en múltiples servicios, reduciendo la duplicación de código.
- **Escalabilidad**:
  La arquitectura modular permite agregar nuevos servicios y funcionalidades sin afectar la estructura existente.

## Autores

| [<img src="https://secure.gravatar.com/avatar/23b2db02403d79ebd356e8e8356758ec?s=128" width=115><br><sub>Cristhian David Montaño</sub>](https://github.com/davidMontanoPragma) |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------:|

## Roadmap

1. **Agregar más servicios**:  
   Continuar expandiendo la suite de pruebas para nuevos módulos.

2. **Integración continua**:  
   Configurar CI/CD para automatizar la ejecución de pruebas.

3. **Mejorar la documentación**:  
   Crear guías detalladas para nuevos desarrolladores.
