# Farmacia Campus
## by: Valentina Perez Fonseca

consultar información sobre medicamentos, ventas, compras y más.

---
## Endpoints

### 1. Obtener todos los medicamentos con menos de 50 unidades en stock

- **Método:** GET
- **Ruta:** `/ejercicio1`

Este endpoint devuelve una lista de todos los medicamentos que tienen menos de 50 unidades en stock en la farmacia del campus.

### 2. Listar los proveedores con su información de contacto en medicamentos

- **Método:** GET
- **Ruta:** `/medicamentos/proveedores`

Este endpoint devuelve una lista de los proveedores de medicamentos junto con su información de contacto.

### 3. Medicamentos comprados al ‘Proveedor A’

- **Método:** GET
- **Ruta:** `/ejercicio3`

Este endpoint devuelve una lista de medicamentos que fueron comprados al proveedor con el nombre "ProveedorA".

### 4. Obtener recetas médicas emitidas después del 1 de enero de 2023

- **Método:** GET
- **Ruta:** `/ventas/recetasMedicas/despues`

Este endpoint permite obtener las recetas médicas emitidas después del 1 de enero de 2023. Puede especificar la fecha exacta en el parámetro de consulta `fecha`.

### 5. Total de ventas del medicamento ‘Paracetamol’

- **Método:** GET
- **Ruta:** `/total-ventas-paracetamol`

Este endpoint devuelve el total de ventas del medicamento "Paracetamol" en la farmacia del campus.

### 6. Medicamentos que caducan antes del 1 de enero de 2024

- **Método:** GET
- **Ruta:** `/medicamentos-caducan-antes-2024`

Este endpoint devuelve una lista de medicamentos que caducarán antes del 1 de enero de 2024.

### 7. Total de medicamentos vendidos por cada proveedor

- **Método:** GET
- **Ruta:** `/compras/totalVentasProv`

Este endpoint devuelve la cantidad total de medicamentos vendidos por cada proveedor. Proporciona información sobre las ventas realizadas por "ProveedorA", "ProveedorB" y "ProveedorC".

### 8. Cantidad total de dinero recaudado por las ventas de medicamentos

- **Método:** GET
- **Ruta:** `/ventas/reacudacion`

Este endpoint devuelve la cantidad total de dinero recaudado por las ventas de medicamentos en la farmacia del campus.

### 9. Medicamentos que no han sido vendidos

- **Método:** GET
- **Ruta:** `/ventas/medicamentosSinVender`

Este endpoint devuelve una lista de medicamentos que aún no han sido vendidos en la farmacia del campus. Mostrará el nombre del medicamento y la cantidad disponible en stock.

### 10. Obtener el medicamento más caro

- **Método:** GET
- **Ruta:** `/medicamentos/maxCost`

Este endpoint devuelve el medicamento más caro en términos de precio en la farmacia del campus.

### 11. Número de medicamentos por proveedor

- **Método:** GET
- **Ruta:** `/compras/vendidosPorProveedor`

Este endpoint devuelve el número de medicamentos vendidos por cada proveedor. Proporciona información sobre las compras realizadas a "ProveedorA", "ProveedorB" y "ProveedorC".

### 12. Pacientes que han comprado Paracetamol

- **Método:** GET
- **Ruta:** `/ventas/pacientes`

Este endpoint devuelve información sobre los pacientes que han comprado el medicamento "Paracetamol". Puede especificar el medicamento exacto en el parámetro de consulta `buy`.

### 13. Proveedores que no han vendido medicamentos en el último año

- **Método:** GET
- **Ruta:** `/proveedores-sin-ventas-ultimo-ano`

Este endpoint devuelve una lista de proveedores que no han realizado ventas de medicamentos en el último año.

### 14. Obtener el total de medicamentos vendidos en marzo de 2023

- **Método:** GET
- **Ruta:** `/total-medicamentos-marzo-2023`

Este endpoint devuelve el total de medicamentos vendidos en el mes de marzo de 2023.

### 15. Obtener el medicamento menos vendido en 2023

- **Método:** GET
- **Ruta:** `/medicamento-menos-vendido-2023`

Este endpoint devuelve el medicamento menos vendido en el año 2023.

### 16. Ganancia total por proveedor en 2023 (asumiendo un campo precioCompra en Compras)

- **Método:** GET
- **Ruta:** `/ganancia-total-por-proveedor-2023`

Este endpoint devuelve la ganancia total por proveedor en el año 2023, considerando el precio de compra en las compras realizadas.

### 17. Promedio de medicamentos comprados por venta

- **Método:** GET
- **Ruta:** `/promedio-medicamentos-comprados-por-venta`

Este endpoint calcula el promedio de medicamentos comprados por venta en la farmacia del campus.

### 18. Cantidad de ventas realizadas por cada empleado en 2023

- **Método:** GET
- **Ruta:** `/ventas-por-empleado-2023`

Este endpoint devuelve la cantidad de ventas realizadas por cada empleado en el año 2023.

### 19. Obtener todos los medicamentos que expiren en 2024

- **Método:** GET
- **Ruta:** `/medicamentos-que-expiran-en-2024`

Este endpoint devuelve una lista de medicamentos que caducarán en el año 2024.

### 20. Empleados que hayan hecho más de 5 ventas en total

- **Método:** GET
- **Ruta:** `/empleados-mas-de-5-ventas`

Este endpoint devuelve una lista de empleados que han realizado más de 5 ventas en total.

### 21. Medicamentos que no han sido vendidos nunca

- **Método:** GET
- **Ruta:** `/medicamentos-no-vendidos`

Este endpoint devuelve una lista de medicamentos que nunca han sido vendidos en la farmacia del campus.

### 22. Paciente que ha gastado más dinero en 2023

- **Método:** GET
- **Ruta:** `/paciente-mayor-gasto-2023`

Este endpoint devuelve al paciente que ha gastado más dinero en compras de medicamentos en el año 2023


## 23. Empleados que no han realizado ninguna venta en 2023

Este endpoint devuelve una lista de empleados que no han realizado ninguna venta en el año 2023. Utiliza la colección de ventas y empleados de la base de datos "farmaciaCampus" para determinar los empleados que no tienen ventas registradas en ese período.

- **URL**: `/empleados-sin-ventas-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de nombres de empleados que no han realizado ventas en 2023.
- **Respuesta de Error**:
  - Código: 404 Not Found
  - Cuerpo: "Error al buscar empleados sin ventas en 2023" en caso de cualquier error.

## 24. Proveedor que ha suministrado más medicamentos en 2023

Este endpoint devuelve el proveedor que ha suministrado la mayor cantidad de medicamentos en el año 2023. Utiliza la colección de compras y medicamentos de la base de datos "farmaciaCampus" para calcular el suministro total de medicamentos por proveedor.

- **URL**: `/proveedor-mayor-suministro-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Proveedor que ha suministrado la mayor cantidad de medicamentos en 2023 y la cantidad total suministrada.
- **Respuesta de Error**:
  - Código: 404 Not Found
  - Cuerpo: "No se encontraron proveedores en 2023" en caso de que no haya proveedores registrados en ese período.

## 25. Pacientes que compraron el medicamento "Paracetamol" en 2023

Este endpoint devuelve una lista de pacientes que compraron el medicamento "Paracetamol" en el año 2023. Utiliza la colección de ventas de la base de datos "farmaciaCampus" para buscar las ventas que incluyan el medicamento "Paracetamol".

- **URL**: `/pacientes-compraron-paracetamol-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de nombres de pacientes que compraron "Paracetamol" en 2023.
- **Respuesta de Error**:
  - Código: 404 Not Found
  - Cuerpo: "No se encontraron pacientes que compraron Paracetamol en 2023" si no se encontraron ventas con este medicamento.

## 26. Total de medicamentos vendidos en 2023

Este endpoint devuelve el total de medicamentos vendidos en el año 2023. Utiliza la colección de ventas de la base de datos "farmaciaCampus" para calcular la cantidad total de medicamentos vendidos en ese período.

- **URL**: `/26`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Cantidad total de medicamentos vendidos en 2023.
- **Respuesta de Error**:
  - Código: 500 Internal Server Error
  - Cuerpo: "Error al calcular el total de medicamentos vendidos en 2023" en caso de cualquier error.

## 27. Empleados con menos de 5 ventas en 2023

Este endpoint devuelve una lista de empleados que han realizado menos de 5 ventas en el año 2023. Utiliza la colección de ventas de la base de datos "farmaciaCampus" para contar las ventas por empleado y filtrar aquellos que tienen menos de 5 ventas.

- **URL**: `/Empleados-con-menos-de-5-ventas`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de nombres de empleados que han realizado menos de 5 ventas en 2023.
- **Respuesta de Error**:
  - Código: 500 Internal Server Error
  - Cuerpo: "Error al obtener los empleados con menos de 5 ventas en 2023" en caso de cualquier error.

## 28. Número total de proveedores que suministraron medicamentos en 2023

Este endpoint devuelve el número total de proveedores que suministraron medicamentos en el año 2023. Utiliza la colección de compras de la base de datos "farmaciaCampus" para contar los proveedores únicos que realizaron compras en ese período.

- **URL**: `/proveedores-que-suministraron-medicamentos-en-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Número total de proveedores que suministraron medicamentos en 2023.
- **Respuesta de Error**:
  - Código: 500 Internal Server Error
  - Cuerpo: "Error al obtener el número total de proveedores" en caso de cualquier error.

## 29. Proveedores de medicamentos con menos de 50 unidades en stock

Este endpoint devuelve una lista de proveedores de medicamentos que tienen menos de 50 unidades en stock. Utiliza la colección de medicamentos de la base de datos "farmaciaCampus" para buscar los medicamentos con bajo stock y luego identificar sus proveedores.

- **URL**: `/menos-de-50-unidades-en-stock`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de nombres de proveedores cuyos medicamentos tienen menos de 50 unidades en stock y una lista de nombres de los medicamentos afectados.
- **Respuesta de Error**:
  - Código: 500 Internal Server Error
  - Cuerpo: "Error al obtener proveedores con stock bajo" en caso de cualquier error.

## 30. Pacientes que no han comprado ningún medicamento en 2023

Este endpoint devuelve una lista de pacientes que no han realizado ninguna compra de medicamentos en el año 2023. Utiliza la colección de ventas de la base de datos "farmaciaCampus" para contar las compras por paciente y filtrar aquellos que no han realizado ninguna compra.

- **URL**: `/pacientes-sin-compras-en-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de nombres de pacientes que no han realizado compras de medicamentos en 2023.
- **Respuesta de Error**:
  - Código: 404 Not Found
  - Cuerpo: "No se encontraron pacientes sin compras en 2023" si no se encontraron pacientes sin compras.

## 33. Empleado con la mayor venta de medicamentos distintos en 2023

Este endpoint devuelve al empleado que ha vendido la mayor cantidad de medicamentos distintos en el año 2023. Utiliza la colección de ventas para calcular los medicamentos distintos vendidos por cada empleado y selecciona al que tenga la mayor cantidad.

- **URL**: `/paciente-mayor-gasto-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Información del paciente con el mayor gasto en medicamentos en 2023, incluyendo su nombre y gasto total.
- **Respuesta de Error**:
  - Código: 404 Not Found
  - Cuerpo: "No se encontraron pacientes en 2023" si no se encuentran pacientes con ventas en ese período.

## 34. Medicamentos que no han sido vendidos en 2023

Este endpoint devuelve una lista de medicamentos que no han sido vendidos en el año 2023. Utiliza la colección de medicamentos y ventas para identificar los medicamentos que no han sido registrados en ventas.

- **URL**: `/no-han-ido-vendidos-en-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de medicamentos que no han sido vendidos en 2023 y una lista de nombres de medicamentos faltantes en las ventas.
- **Respuesta de Error**:
  - Código: 500 Internal Server Error
  - Cuerpo: "Error al obtener el stock" en caso de cualquier error al acceder a la base de datos.

## 35. Proveedores que han suministrado al menos 5 medicamentos diferentes en 2023

Este endpoint devuelve una lista de proveedores que han suministrado al menos 5 medicamentos diferentes en el año 2023. Utiliza la colección de medicamentos y la fecha de expiración para identificar los proveedores que cumplen con este criterio.

- **URL**: `/proveedores-con-5-o-mas-medicamentos-en-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de proveedores que han suministrado al menos 5 medicamentos diferentes en 2023, incluyendo el nombre del proveedor y la lista de medicamentos diferentes suministrados.
- **Respuesta de Error**:
  - Código: 404 Not Found
  - Cuerpo: "No se encontraron proveedores con al menos 5 medicamentos diferentes en 2023" si no se cumplen los criterios.

## 36. Total de medicamentos vendidos en el primer trimestre de 2023

Este endpoint devuelve el total de medicamentos vendidos en el primer trimestre de 2023. Utiliza la colección de ventas y las fechas correspondientes para calcular la cantidad total de medicamentos vendidos en ese período.

- **URL**: `/total-medicamentos-vendidos-primer-trimestre-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Cantidad total de medicamentos vendidos en el primer trimestre de 2023.
- **Respuesta de Error**:
  - Código: 404 Not Found
  - Cuerpo: "No se encontraron ventas en el primer trimestre de 2023" si no hay ventas registradas en ese período.

## 37. Empleados que no realizaron ventas en abril de 2023

Este endpoint devuelve una lista de empleados que no realizaron ventas en el mes de abril de 2023. Utiliza la colección de ventas y las fechas correspondientes para identificar los empleados que no tienen ventas registradas en ese mes.

- **URL**: `/empleados-sin-ventas-abril-2023`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de nombres de empleados que no realizaron ventas en abril de 2023.
- **Respuesta de Error**:
  - Código: 500 Internal Server Error
  - Cuerpo: "Error al buscar empleados" en caso de cualquier error al acceder a la base de datos.

## 38. Medicamentos con un precio mayor a 50 y un stock menor a 100

Este endpoint devuelve una lista de medicamentos con un precio mayor a 50 y un stock menor a 100. Utiliza la colección de medicamentos y los criterios de filtro para identificar los medicamentos que cumplen con estas condiciones.

- **URL**: `/medicamentos-precio-mayor-50-stock-menor-100`
- **Método**: GET
- **Respuesta Exitosa**:
  - Código: 200 OK
  - Cuerpo: Lista de medicamentos que cumplen con los criterios de precio y stock.
- **Respuesta de Error**:
  - Código: 404 Not Found
  - Cuerpo: "No se encontraron medicamentos con precio mayor a 50 y stock menor a 100" si no se cumplen los criterios.
  - Cuerpo: "Error al buscar medicamentos" en caso de cualquier error al acceder a la base de datos.
