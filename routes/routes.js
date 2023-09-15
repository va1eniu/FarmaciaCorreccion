import { Router } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const bases = process.env.MONGO_URI;
const nombreBase = "farmaciaCampus";
const router = Router();

//1. Obtener todos los medicamentos con menos de 50 unidades en stock

router.get("/medicamentos/min", async (req, res) => {
  try {
    const { count } = req.query;
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Medicamentos");

    const result = await colection
      .find({ stock: { $lt: Number(count) } })
      .toArray();
    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

// 2. Listar los proveedores con su información de contacto en medicamentos

router.get("/medicamentos/proveedores", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Medicamentos");

    const result = await colection.distinct("proveedor");
    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//3. Medicamentos comprados al ‘Proveedor A’.

router.get("/medicamentos/compras", async (req, res) => {
  try {
    const { prov } = req.query;
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Medicamentos");

    const proveedorArray = await colection.distinct("proveedor");
    const proveedorFind = proveedorArray.filter(
      (element) => element.nombre == prov
    );
    const result = await colection
      .find({ proveedor: proveedorFind[0] })
      .toArray();
    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//4. Obtener recetas médicas emitidas después del 1 de enero de 2023.

router.get("/ventas/recetasMedicas/despues", async (req, res) => {
  try {
    const { fecha } = req.query;
    const fechaCompare = new Date(fecha);
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Ventas");

    const result = await colection
      .find({ fechaVenta: { $gte: fechaCompare } })
      .toArray();
    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//5. Total de ventas del medicamento ‘Paracetamol’.

router.get("/ventas/medicamento", async (req, res) => {
  try {
    const { med } = req.query;
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Ventas");

    const result = await colection
      .find({
        medicamentosVendidos: {
          $elemMatch: { nombreMedicamento: med },
        },
      })
      .toArray();

    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//6. Medicamentos que caducan antes del 1 de enero de 2024.

router.get("/medicamentos/caducidad/antes", async (req, res) => {
  try {
    const { fecha } = req.query;
    const fechaCompare = new Date(fecha);
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Medicamentos");

    const result = await colection
      .find({ fechaExpiracion: { $lte: fechaCompare } })
      .toArray();
    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//7. Total de medicamentos vendidos por cada proveedor.

router.get("/compras/totalVentasProv", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Compras");

    const projection = { "medicamentosComprados.cantidadComprada": 1 };

    const resultA = await colection
      .find({ "proveedor.nombre": "ProveedorA" })
      .project(projection)
      .toArray();
    const resultB = await colection
      .find({ "proveedor.nombre": "ProveedorB" })
      .project(projection)
      .toArray();
    const resultC = await colection
      .find({ "proveedor.nombre": "ProveedorC" })
      .project(projection)
      .toArray();

      const sumatoria = (element) => {
        return element.reduce((total, medicamento) => {
          return total + medicamento.medicamentosComprados[0].cantidadComprada;
        }, 0);
      };

    res.json({
      ProveedorA: sumatoria(resultA),
      ProveedorB: sumatoria(resultB),
      ProveedorC: sumatoria(resultC),
    });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//8. Cantidad total de dinero recaudado por las ventas de medicamentos.

router.get("/ventas/reacudacion", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Ventas");

    const projection = { medicamentosVendidos: 1 };

    const conectionCol = await colection.find({}).project(projection).toArray();

    let conteo = 0;
    const result = conectionCol.forEach((element) => {
      element.medicamentosVendidos.forEach((el) => {
        conteo = conteo + el.precio;
      });
    });
    res.json({ DineroRecaudado: conteo });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//9. Medicamentos que no han sido vendidos.

router.get("/ventas/medicamentosSinVender", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Medicamentos");
    const colection2 = db.collection("Ventas");

    const medicamentosVendidos = await colection2
      .aggregate([
        {
          $unwind: "$medicamentosVendidos",
        },
        {
          $group: {
            _id: "$medicamentosVendidos.nombreMedicamento",
            totalCantidadVendida: {
              $sum: "$medicamentosVendidos.cantidadVendida",
            },
          },
        },
        {
          $project: {
            _id: 0,
            nombreMedicamento: "$_id",
            totalCantidadVendida: 1,
          },
        },
      ])
      .toArray();

    const medsInStock = await colection
      .find({})
      .project({ nombre: 1, stock: 1 })
      .toArray();

    const result = medsInStock.map((element) => {
      const medicamentoVendido = medicamentosVendidos.find(
        (med) => med.nombreMedicamento === element.nombre
      );
      if (medicamentoVendido) {
        element.stock -= medicamentoVendido.totalCantidadVendida;
      }
      return element;
    });

    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//10. Obtener el medicamento más caro.

router.get("/medicamentos/maxCost", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Medicamentos");


    const result = await colection
      .find({})
      .sort({precio:-1}).limit(1)
      .toArray();
    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//11. Número de medicamentos por proveedor.

router.get("/compras/vendidosPorProveedor", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Compras");

    const projection = { medicamentosComprados: 1 };

    const resultA = await colection
      .find({ "proveedor.nombre": "ProveedorA" })
      .project(projection)
      .toArray();
    const resultB = await colection
      .find({ "proveedor.nombre": "ProveedorB" })
      .project(projection)
      .toArray();
    const resultC = await colection
      .find({ "proveedor.nombre": "ProveedorC" })
      .project(projection)
      .toArray();

    res.json({
      ProveedorA: resultA,
      ProveedorB: resultB,
      ProveedorC: resultC,
    });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//12. Pacientes que han comprado Paracetamol.

router.get("/ventas/pacientes", async (req, res) => {
  try {
    const {buy} = req.query
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Compras");

    const projection = { medicamentosComprados: 1 };

    const resultA = await colection
      .find({ "proveedor.nombre": "ProveedorA" })
      .project(projection)
      .toArray();
    const resultB = await colection
      .find({ "proveedor.nombre": "ProveedorB" })
      .project(projection)
      .toArray();
    const resultC = await colection
      .find({ "proveedor.nombre": "ProveedorC" })
      .project(projection)
      .toArray();

    res.json({
      ProveedorA: resultA,
      ProveedorB: resultB,
      ProveedorC: resultC,
    });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});

//38. Medicamentos con un precio mayor a 50 y un stock menor a 100.

router.get("/medicamentos/filter", async (req, res) => {
  try {
    const { maxPrice, stock } = req.query;
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db(nombreBase);
    const colection = db.collection("Medicamentos");

    const filterStock = await colection
      .find({ stock: { $lte: Number(stock) } })
      .toArray();

    const result = filterStock.filter(
      (element) => element.stock >= Number(maxPrice)
    );
    res.json(result);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(404).json("No se reconoce el dato");
  }
});


//Pacientes que han comprado Paracetamol.

router.get('/pacientes/paracetamol', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'
    
    const result = await collection.find({'medicamentosVendidos.nombreMedicamento': 'Paracetamol'})
      .project({ 'paciente.nombre': 1, 'paciente.direccion': 1 })
      .toArray();

    client.close();
    
    if (result.length > 0) {
      res.json(result.map(venta => venta.paciente));
    } else {
      res.json([]); // Si no se encontraron pacientes que compraron Paracetamol
    }
  } catch (error) {
    res.status(404).json('No se encontraron pacientes que compraron Paracetamol');
  }
});

//Proveedores que no han vendido medicamentos en el último año.



router.get('/proveedores/no-vendieron-ultimo-ano', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'
    
    // Obtener la fecha límite de un año atrás
    const fechaLimite = new Date();
    fechaLimite.setFullYear(fechaLimite.getFullYear() - 1);

    // Buscar las ventas que ocurrieron después de la fecha límite
    const result = await collection.find({ 'fechaVenta': { $gt: fechaLimite } })
      .project({ 'empleado.nombre': 1 })
      .toArray();

    // Extraer los nombres de los proveedores de las ventas
    const proveedoresVendieron = result.map(venta => venta.empleado.nombre);

    // Obtener la lista completa de proveedores
    const proveedoresCollection = db.collection('Proveedores'); // Cambia el nombre de la colección a 'Proveedores'
    const todosLosProveedores = await proveedoresCollection.distinct('nombre');

    // Encontrar los proveedores que no vendieron en el último año
    const proveedoresNoVendieron = todosLosProveedores.filter(proveedor => !proveedoresVendieron.includes(proveedor));

    client.close();

    res.json(proveedoresNoVendieron);
  } catch (error) {
    res.status(404).json('No se encontraron proveedores que no hayan vendido en el último año');
  }
});

//14. Obtener el total de medicamentos vendidos en marzo de 2023.

router.get('/total-medicamentos-marzo-2023', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'
    
    // Definir las fechas de inicio y fin de marzo de 2023
    const fechaInicioMarzo = new Date('2023-03-01T00:00:00.000+00:00');
    const fechaFinMarzo = new Date('2023-03-31T23:59:59.999+00:00');

    // Buscar las ventas que ocurrieron en marzo de 2023
    const result = await collection.find({
      'fechaVenta': {
        $gte: fechaInicioMarzo,
        $lte: fechaFinMarzo
      }
    }).toArray();

    // Calcular el total de medicamentos vendidos en marzo de 2023
    let totalMedicamentosVendidos = 0;
    for (const venta of result) {
      for (const medicamento of venta.medicamentosVendidos) {
        totalMedicamentosVendidos += medicamento.cantidadVendida;
      }
    }

    client.close();

    res.json({ totalMedicamentosVendidos });
  } catch (error) {
    res.status(404).json('No se encontraron ventas en marzo de 2023');
  }
});

//15. Obtener el medicamento menos vendido en 2023.

router.get('/medicamento-menos-vendido-2023', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'
    
    // Definir las fechas de inicio y fin de 2023
    const fechaInicio2023 = new Date('2023-01-01T00:00:00.000+00:00');
    const fechaFin2023 = new Date('2023-12-31T23:59:59.999+00:00');

    // Buscar las ventas que ocurrieron en 2023
    const result = await collection.find({
      'fechaVenta': {
        $gte: fechaInicio2023,
        $lte: fechaFin2023
      }
    }).toArray();

    // Calcular el medicamento menos vendido en 2023
    const medicamentosVendidos = {};

    for (const venta of result) {
      for (const medicamento of venta.medicamentosVendidos) {
        const nombreMedicamento = medicamento.nombreMedicamento;
        const cantidadVendida = medicamento.cantidadVendida;

        if (!medicamentosVendidos[nombreMedicamento]) {
          medicamentosVendidos[nombreMedicamento] = 0;
        }

        medicamentosVendidos[nombreMedicamento] += cantidadVendida;
      }
    }

    const medicamentoMenosVendido = Object.keys(medicamentosVendidos).reduce((min, medicamento) => {
      return medicamentosVendidos[medicamento] < medicamentosVendidos[min] ? medicamento : min;
    }, Object.keys(medicamentosVendidos)[0]);

    client.close();

    res.json({ medicamentoMenosVendido });
  } catch (error) {
    res.status(404).json('No se encontraron ventas en 2023');
  }
});

//16. Ganancia total por proveedor en 2023 (asumiendo un campo precioCompra en Compras).

router.get('/ganancia-total-por-proveedor-2023', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'
    
    // Definir las fechas de inicio y fin de 2023
    const fechaInicio2023 = new Date('2023-01-01T00:00:00.000+00:00');
    const fechaFin2023 = new Date('2023-12-31T23:59:59.999+00:00');

    // Buscar las ventas que ocurrieron en 2023
    const result = await collection.find({
      'fechaVenta': {
        $gte: fechaInicio2023,
        $lte: fechaFin2023
      }
    }).toArray();

    // Calcular la ganancia total por proveedor
    const gananciaPorProveedor = {};

    for (const venta of result) {
      const proveedor = venta.empleado.nombre;
      for (const medicamento of venta.medicamentosVendidos) {
        const nombreMedicamento = medicamento.nombreMedicamento;
        const cantidadVendida = medicamento.cantidadVendida;
        const precioVenta = medicamento.precio;

        // Supongamos que tienes un campo 'precioCompra' en las compras
        // Debes reemplazar 'precioCompra' con el nombre correcto en tu base de datos

        const ganancia = (precioVenta - precioCompra) * cantidadVendida;

        if (!gananciaPorProveedor[proveedor]) {
          gananciaPorProveedor[proveedor] = 0;
        }

        gananciaPorProveedor[proveedor] += ganancia;
      }
    }

    client.close();

    res.json(gananciaPorProveedor);
  } catch (error) {
    res.status(404).json('No se encontraron ventas en 2023');
  }
});

// Promedio de medicamentos comprados por venta.

router.get('/promedio-medicamentos-comprados-por-venta', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Compras'); // Cambia el nombre de la colección a 'Compras'
    
    // Buscar todas las compras
    const result = await collection.find({}).toArray();

    // Calcular el promedio de medicamentos comprados por venta
    let totalMedicamentos = 0;
    let totalVentas = result.length;

    for (const compra of result) {
      totalMedicamentos += compra.medicamentosComprados.length;
    }

    const promedio = totalVentas > 0 ? totalMedicamentos / totalVentas : 0;

    client.close();

    res.json({ promedio });
  } catch (error) {
    res.status(404).json('No se encontraron compras');
  }
});

//18: Cantidad de ventas realizadas por cada empleado en 2023.

router.get('/ventas-por-empleado-2023', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'
    
    // Definir las fechas de inicio y fin de 2023
    const fechaInicio2023 = new Date('2023-01-01T00:00:00.000+00:00');
    const fechaFin2023 = new Date('2023-12-31T23:59:59.999+00:00');

    // Buscar las ventas que ocurrieron en 2023
    const result = await collection.find({
      'fechaVenta': {
        $gte: fechaInicio2023,
        $lte: fechaFin2023
      }
    }).toArray();

    // Contar las ventas por empleado
    const ventasPorEmpleado = {};

    for (const venta of result) {
      const empleado = venta.empleado.nombre;

      if (!ventasPorEmpleado[empleado]) {
        ventasPorEmpleado[empleado] = 0;
      }

      ventasPorEmpleado[empleado]++;
    }

    client.close();

    res.json(ventasPorEmpleado);
  } catch (error) {
    res.status(404).json('No se encontraron ventas en 2023');
  }
});

//19. Obtener todos los medicamentos que expiren en 2024.

router.get('/medicamentos-que-expiran-en-2024', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Medicamentos'); // Cambia el nombre de la colección a 'Medicamentos'
    
    // Definir las fechas de inicio y fin de 2024
    const fechaInicio2024 = new Date('2024-01-01T00:00:00.000+00:00');
    const fechaFin2024 = new Date('2024-12-31T23:59:59.999+00:00');

    // Buscar los medicamentos que expiren en 2024
    const result = await collection.find({
      'fechaExpiracion': {
        $gte: fechaInicio2024,
        $lte: fechaFin2024
      }
    }).toArray();

    client.close();

    res.json(result);
  } catch (error) {
    res.status(404).json('No se encontraron medicamentos que expiren en 2024');
  }
});

//20. Empleados que hayan hecho más de 5 ventas en total.❌

router.get('/empleados-con-mas-de-5-ventas', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const collection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'

    // Agregar un campo 'empleado.nombre' como clave y contar las ventas por empleado
    const pipeline = [
      {
        $group: {
          _id: '$empleado.nombre',
          ventas: { $sum: 1 }
        }
      },
      {
        $match: {
          ventas: { $gt: 5 } // Filtrar empleados con más de 5 ventas
        }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();

    client.close();

    res.json(result);
  } catch (error) {
    res.status(404).json('No se encontraron empleados con más de 5 ventas');
  }
});

//21 Medicamentos que no han sido vendidos nunca.❌

router.get('/medicamentos-no-vendidos', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const medicamentosCollection = db.collection('Medicamentos'); // Cambia el nombre de la colección a 'Medicamentos'
    const ventasCollection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'

    // Obtener todos los medicamentos
    const medicamentos = await medicamentosCollection.find({}).toArray();

    // Obtener los nombres de medicamentos vendidos
    const nombresMedicamentosVendidos = await ventasCollection.distinct('medicamentosVendidos.nombreMedicamento');

    // Filtrar los medicamentos que no han sido vendidos
    const medicamentosNoVendidos = medicamentos.filter(medicamento => !nombresMedicamentosVendidos.includes(medicamento.nombre));

    client.close();

    res.json(medicamentosNoVendidos);
  } catch (error) {
    res.status(404).json('No se encontraron medicamentos no vendidos');
  }
});


//22. Paciente que ha gastado más dinero en 2023.


router.get('/paciente-mayor-gasto-2023', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const ventasCollection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'

    // Definir las fechas de inicio y fin de 2023
    const fechaInicio2023 = new Date('2023-01-01T00:00:00.000+00:00');
    const fechaFin2023 = new Date('2023-12-31T23:59:59.999+00:00');

    // Agregar un campo 'paciente.nombre' como clave y sumar el gasto total por paciente
    const pipeline = [
      {
        $match: {
          fechaVenta: {
            $gte: fechaInicio2023,
            $lte: fechaFin2023
          }
        }
      },
      {
        $unwind: '$medicamentosVendidos'
      },
      {
        $group: {
          _id: '$paciente.nombre',
          gastoTotal: { $sum: { $multiply: ['$medicamentosVendidos.cantidadVendida', '$medicamentosVendidos.precio'] } }
        }
      },
      {
        $sort: {
          gastoTotal: -1 // Ordenar en orden descendente por gasto total
        }
      },
      {
        $limit: 1 // Obtener solo el paciente con el gasto más alto
      }
    ];

    const result = await ventasCollection.aggregate(pipeline).toArray();

    client.close();

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json('No se encontraron pacientes en 2023');
    }
  } catch (error) {
    res.status(404).json('No se encontraron pacientes en 2023');
  }
});

//23. Empleados que no han realizado ninguna venta en 2023❌

router.get('/empleados-sin-ventas-2023', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const ventasCollection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'

    // Definir las fechas de inicio y fin de 2023
    const fechaInicio2023 = new Date('2023-01-01T00:00:00.000+00:00');
    const fechaFin2023 = new Date('2023-12-31T23:59:59.999+00:00');

    // Agregar un campo 'empleado.nombre' como clave y contar el número de ventas por empleado
    const pipeline = [
      {
        $match: {
          fechaVenta: {
            $gte: fechaInicio2023,
            $lte: fechaFin2023
          }
        }
      },
      {
        $group: {
          _id: '$empleado.nombre',
          ventas: { $sum: 1 }
        }
      },
      {
        $match: {
          ventas: 0 // Filtrar empleados sin ventas (ventas igual a cero)
        }
      }
    ];

    const result = await ventasCollection.aggregate(pipeline).toArray();

    client.close();

    res.json(result);
  } catch (error) {
    res.status(404).json('No se encontraron empleados sin ventas en 2023');
  }
});

//24. Proveedor que ha suministrado más medicamentos en 2023.


router.get('/proveedor-mayor-suministro-2023', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const comprasCollection = db.collection('Compras'); // Cambia el nombre de la colección a 'Compras'

    // Definir las fechas de inicio y fin de 2023
    const fechaInicio2023 = new Date('2023-01-01T00:00:00.000+00:00');
    const fechaFin2023 = new Date('2023-12-31T23:59:59.999+00:00');

    // Agregar un campo 'proveedor.nombre' como clave y sumar la cantidad total de medicamentos suministrados por proveedor
    const pipeline = [
      {
        $match: {
          fechaCompra: {
            $gte: fechaInicio2023,
            $lte: fechaFin2023
          }
        }
      },
      {
        $unwind: '$medicamentosComprados'
      },
      {
        $group: {
          _id: '$proveedor.nombre',
          suministroTotal: { $sum: '$medicamentosComprados.cantidadComprada' }
        }
      },
      {
        $sort: {
          suministroTotal: -1 // Ordenar en orden descendente por suministro total
        }
      },
      {
        $limit: 1 // Obtener solo el proveedor con el mayor suministro
      }
    ];

    const result = await comprasCollection.aggregate(pipeline).toArray();

    client.close();

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json('No se encontraron proveedores en 2023');
    }
  } catch (error) {
    res.status(404).json('No se encontraron proveedores en 2023');
  }
});

//25. Pacientes que compraron el medicamento “Paracetamol” en 2023.

router.get('/pacientes-compraron-paracetamol-2023', async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db('farmaciaCampus');
    const ventasCollection = db.collection('Ventas'); // Cambia el nombre de la colección a 'Ventas'

    // Definir las fechas de inicio y fin de 2023
    const fechaInicio2023 = new Date('2023-01-01T00:00:00.000+00:00');
    const fechaFin2023 = new Date('2023-12-31T23:59:59.999+00:00');

    // Realizar la consulta para buscar las ventas de Paracetamol en 2023
    const result = await ventasCollection.find({
      fechaVenta: {
        $gte: fechaInicio2023,
        $lte: fechaFin2023
      },
      'medicamentosVendidos.nombreMedicamento': 'Paracetamol'
    }).toArray();

    client.close();

    if (result.length > 0) {
      const pacientes = result.map(venta => venta.paciente);
      res.json(pacientes);
    } else {
      res.status(404).json('No se encontraron pacientes que compraron Paracetamol en 2023');
    }
  } catch (error) {
    res.status(404).json('No se encontraron pacientes que compraron Paracetamol en 2023');
  }
});











export default router;
