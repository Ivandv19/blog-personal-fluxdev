---
layout: ../../layouts/BlogPost.astro
ref_id: blog-control-de-versiones
title: "Control de Versiones"
date: "2025-12-23"
description: "Un sistema que registra los cambios realizados en archivos a lo largo del tiempo, permitiendo recuperar versiones específicas."
tags: ["git", "programacion", "desarrollo", "herramientas"]
---

Un control de versiones es un sistema que registra los cambios realizados en un archivo o conjunto de archivos a lo largo del tiempo, de modo que puedas recuperar versiones específicas más adelante. Aunque los ejemplos típicos usan código fuente, en realidad puedes versionar casi cualquier tipo de archivo: imágenes, diseños, documentos, etc.

## ¿Por qué usar control de versiones?

Estos sistemas te permiten:

* Regresar a versiones anteriores de tus archivos o del proyecto completo
* Comparar cambios a lo largo del tiempo
* Ver quién modificó por última vez algo que pueda estar causando problemas
* Ver quién introdujo un problema y cuándo
* Recuperar archivos fácilmente si los pierdes o dañas

## Tipos de Sistemas de Control de Versiones

### Control de Versiones Local (VCS Local)
**Descripción:** Es el método más simple y primitivo. Muchas personas gestionan versiones copiando archivos a otro directorio, quizás indicando la fecha y hora.

Una herramienta popular fue **RCS** (Revision Control System), que funciona guardando conjuntos de diferencias entre archivos en un formato especial en el disco, permitiendo recrear cualquier archivo en cualquier punto del tiempo.

**Problema principal:** Todo está en un solo lugar en tu computadora, así que si pierdes ese disco duro, pierdes todo el historial del proyecto.

### Control de Versiones Centralizado (CVCS)
**Descripción:** Estos sistemas fueron desarrollados para solucionar el problema de que las personas necesitan colaborar con desarrolladores en otros sistemas. Ejemplos incluyen CVS, Subversion y Perforce.

**Características:**
* Tienen un único servidor que contiene todos los archivos versionados y varios clientes que descargan los archivos desde ese lugar central
* Ha sido el estándar para el control de versiones por muchos años

**Ventajas:**
* Todas las personas saben hasta cierto punto en qué están trabajando los otros colaboradores
* Los administradores tienen control detallado sobre qué puede hacer cada usuario
* Es mucho más fácil administrar un CVCS que lidiar con bases de datos locales en cada cliente

**Desventajas críticas:**
* **Punto único de fallo:** Si el servidor cae por una hora, nadie puede colaborar durante ese tiempo
* Si el disco duro del servidor se corrompe y no hay respaldos apropiados, pierdes absolutamente todo el historial del proyecto (excepto las versiones locales que los desarrolladores tengan en sus máquinas)

### Control de Versiones Distribuido (DVCS)
**Descripción:** Aquí es donde entran Git, Mercurial, Bazaar y Darcs.

**Características principales:**
* Los clientes no solo descargan la última versión de los archivos, sino que **duplican completamente el repositorio** con todo su historial
* Cada desarrollador tiene una copia completa del proyecto
* Si un servidor falla, cualquier repositorio cliente puede restaurar el servidor completo

**Ventajas importantes:**
* Permite trabajar con múltiples repositorios remotos simultáneamente
* Puedes colaborar con diferentes grupos de personas de distintas maneras dentro del mismo proyecto
* Permite establecer varios flujos de trabajo que no son posibles en sistemas centralizados, como modelos jerárquicos
* Mayor flexibilidad en la forma de colaborar

## ¿Cuándo usar cada uno?

### LOCAL:
* Proyectos personales muy pequeños
* Cuando solo TÚ trabajas y no necesitas colaborar
* Ejemplo: Un script personal de Python para organizar tus fotos

### CENTRALIZADO:
* Equipos pequeños con flujos simples
* Empresas con control estricto
* Ejemplo: Una agencia con 5 devs que necesita supervisión del líder

### DISTRIBUIDO (Git):
* Proyectos open source
* Equipos distribuidos geográficamente
* Desarrollo moderno con múltiples features simultáneas
* Ejemplo: Cualquier startup tech, proyectos en GitHub

## Comparativa de Sistemas de Control de Versiones

| Característica | Local | Centralizado | Distribuido |
|---|---|---|---|
| Colaboración | ❌ | ✅ | ✅✅ |
| Trabajo offline | ✅ | ❌ | ✅ |
| Velocidad | ⚡⚡ | 🐌 | ⚡ |
| Backup completo | ❌ | ❌ | ✅ |
| Curva aprendizaje | ✅ | ✅ | 🤔 |

## Herramientas según el tipo

**LOCAL:**
* RCS (antiguo)
* Copias manuales con fechas

**CENTRALIZADO:**
* SVN (Subversion) 
* Perforce - Gaming industry
* CVS - Legacy systems

**DISTRIBUIDO:**
* Git 
* Mercurial
* Bazaar

## Tips para empezar

* **Si estás aprendiendo:** Empieza con Git
* **Si tu empresa usa SVN:** Aprende lo básico pero domina Git
* **Git es el estándar de la industria:** Casi todos los trabajos tech piden Git en el CV
* **Las plataformas más usadas:** GitHub, GitLab, Bitbucket usan Git
* **Practica con proyectos reales:** Crea un repositorio en GitHub y sube tus proyectos personales

**Conclusión**

 La evolución ha sido: **Local → Centralizado → Distribuido**. Cada tipo soluciona los problemas del anterior: los sistemas locales no permitían colaboración, los centralizados solucionaron eso pero crearon un punto único de fallo, y los distribuidos eliminaron ese riesgo dando a cada desarrollador una copia completa del proyecto.

---

Fuente consultada: [Pro Git Book](https://git-scm.com/book/es/v2)