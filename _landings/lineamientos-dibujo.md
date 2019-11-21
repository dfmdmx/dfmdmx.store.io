---
layout: page
title: Archivos digitales
permalink: /lineamientos-dibujo/
---

En esta guía cubrimos los lineamientos básicos que nosotros utilizamos para enviar un archivo digital a manufactura, pero te invitamos a incluir la información en el formato que consideres apropiada, siempre y cuando sea presentada de manera profesional y legible.

Aceptamos todo tipo de archivos digitales, pero recomendamos utilizar algunos estándares comerciales fáciles de exportar como .stl, .svg, .dxf, .skp y .3dm (revisa la lista completa aquí).

Solo trabajamos con archivos en sistema métrico decimal.

Para identificar las dimensiones de tu dibujo menciona las unidades a utilizar en las notas de tu pedido o de preferencia adjunta el sufijo correspondiente en el nombre de tu archivo por ejemplo:

```
ArchivoImpresion_Mm.skp  
ArchivoImpresion_Cm.skp  
ArchivoImpresion_Ym.skp  
```
Recuerda que además del archivo a manufacturar puedes adjuntar material de apoyo como fotos y planos que nos ayuden a entender mejor tu solicitud.

No dudes en ponerte en contacto con nosotros.  
**Equipo HMX**

{% include utils/index-headers.html %}

## Corte CNC Router

### Archivo digital 2D para corte
Para dibujos en 2D necesitamos identificar qué tipo de corte se requiere para cada tipo de línea. La relación entre el tipo de corte y la línea la distinguimos a través del color asignado a cada línea; esto nos facilita poder migrar entre formatos. Cada color corresponde a un tipo de compensación de herramienta o rutina de corte.  

Para indicar la proporción de tu corte utiliza una rectángulo que corresponda a las dimensiones del material seleccionado. Trabaja con polilíneas cerradas, excepto en los grabados, que también pueden ser abiertas.

{% include utils/image-binder.html imageFile='images/EjemploCorte2D.png' caption='Ejemplo dibujo en 2D' %}

### Archivo digital 3D para corte
Por lo general estos archivos se explican por sí solos. Recuerda unicamente mandar polígonos u objetos cerrados e incluir en tu diseño los radios y dimensiones máximas de cada herramienta y máquina.  

Para indicar la proporción de tu pieza utiliza una superficie abierta que corresponda a las dimensiones del material seleccionado. Adjunta los planos en pdf o notas textuales en tu pedido para especificar algún detalle que requieras en tu corte, pues los objetos en 2D y Texto son ignorados en modo 3D.

{% include utils/image-binder.html imageFile='images/EjemploCorte3D.png' caption='Ejemplo dibujo en 3D' %}

### Corte y despiece
Si vas a realizar el despiece por tu cuenta, contempla dejar 20mm entre piezas y borde (las dimensiones del borde deben corresponden al material seleccionado).  

{% include utils/image-binder.html imageFile='images/EjemploDespiece.png' caption='Ejemplo lineamiento para despiece' %}

## Impresión 3D
### Archivo digital STL para impresión 3D
Es importante mandar polígonos u objetos cerrados e incluir en tu diseño las restricciones físicas del tipo de Impresión para evitar deformaciones o puentes de soporte excesivos.  

Si necesitas una orientación de impresión especifica coloca un superficie abierta que indique el plano XY de tu dibujo.

{% include utils/image-binder.html imageFile='images/EjemploOrientacionImpresion3D.png' caption='Ejemplo impresión 3D con plano de orientación' %}
