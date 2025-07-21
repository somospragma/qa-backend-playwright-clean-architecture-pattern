
## ✅ Estructura del Proyecto

```plaintext
├── .env                                      # Variables de entorno del proyecto (URLs, tokens, etc.)
├── .gitignore                                # Archivos y carpetas que Git debe ignorar
├── .npmrc                                    # Configuración personalizada para el uso de npm (registro, caché, etc.)
├── package.json                              # Definición del proyecto, dependencias, scripts y metadatos
├── playwright.config.ts                      # Configuración general de Playwright para pruebas E2E/API
├── README.md                                 # Documento principal con la descripción general del proyecto
├── tsconfig.json                             # Configuración del compilador TypeScript
```

### 📁 src/

```plaintext
src/
├── common/                                   # Código reutilizable y transversal a toda la aplicación
│   ├── application/                          # Casos de uso que no dependen de un dominio específico
│   │   └── uses-cases/                       # Lógica de negocio reutilizable
│   │       └── index.ts                      # Exportaciones centralizadas
│   ├── domain/                               # Lógica de dominio independiente (reglas de negocio puras)
│   │   ├── entities/                         # Entidades genéricas y reutilizables
│   │   │   └── index.ts                      # Exportaciones de entidades
│   │   └── helpers/                          # Funciones auxiliares y utilitarias globales (logger, validador, etc.)
│   │       └── index.ts                      # Exportaciones de helpers
│   └── ports/                                # Definición de contratos e interfaces de entrada/salida
│       ├── interfaces/                       # Interfaces compartidas (helpers, casos de uso, etc.)
│       │   ├── helpers/                      # Interfaces específicas para helpers
│       │   ├── uses-cases/                   # Interfaces para casos de uso comunes
│       │   └── nombre-interfaz.interface.ts  # Contrato específico para algún helper o lógica
│       └── index.ts                          # Exportación centralizada de puertos
```

### 📁 services/

```plaintext
services/
└── servicio1/                                 # Dominio funcional o feature (ej: posts, auth, users, etc.)
    ├── application/                           # Casos de uso específicos del dominio
    │   └── uses-cases/                        # Implementación de la lógica del negocio
    │       └── index.ts                       # Exportaciones centralizadas
    ├── domain/                                # Lógica pura del dominio específico
    │   ├── entities/                          # Entidades específicas del dominio
    │   │   └── index.ts                       # Exportaciones de entidades
    │   └── helpers/                           # Funciones auxiliares solo para este dominio
    │       └── index.ts                       # Exportaciones de helpers
    └── ports/                                 # Interfaces para conectar con infraestructura o adaptadores externos
        ├── interfaces/                        # Contratos de entrada/salida para el dominio
        │   ├── helpers/                       # Interfaces para helpers del dominio
        │   ├── uses-cases/                    # Interfaces para los casos de uso del dominio
        │   └── nombre-interfaz.interface.ts   # Contrato para componente específico
        └── index.ts                           # Exportación centralizada
```

### 📁 tests/

```plaintext
tests/
├── servicio1/                                 # Carpeta para las pruebas del dominio correspondiente
│   └── features/                              # Escenarios definidos como pruebas (BDD o estructuradas)
│       └── test1/                             # Subcategorías o conjuntos de pruebas por caso
├── json/                                      # Archivos de datos para pruebas (cuerpos de peticiones, mocks, etc.)
```

### 📁 docs/

```plaintext
docs/
├── index.md                                   # Introducción general al proyecto y cómo navegar la documentación
├── topicos.md                                 # Explicación detallada de cada componente del sistema
├── tecnologias.md                             # Tecnologías y herramientas utilizadas en el proyecto
├── consideraciones.md                         # Buenas prácticas, convenciones y decisiones técnicas
├── instalacion.md                             # Guía paso a paso para instalar y configurar el entorno
├── descarga.md                                # Cómo clonar, instalar dependencias y levantar el proyecto
└── tests.md                                   # Guía para ejecutar pruebas y generar reportes
```
