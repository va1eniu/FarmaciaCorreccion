import { Router } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const bases = process.env.MONGO_URI;
const nombreBase = "farmaciaCampus";
const router = Router();

//1. Obtener todos los medicamentos con menos de 50 unidades en stock

router.get("/ejercicio1", async (req, res) => {
  try {
    const client = new MongoClient(bases, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db("farmaciaCampus");
    const collection = db.collection("Medicamentos");
    const result = await collection.find({ stock: { $lt: 50 } }).toArray();
    client.close();
    res.json(result);
  } catch (error) {
    res.status(404).json("No se encontro el dato");
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

router.get("/ejercicio3", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const collection = db.collection("Medicamentos");
    const result = await collection
      .find({ "proveedor.nombre": "ProveedorA" })
      .toArray();
    client.close();
    res.json(result);
  } catch (error) {
    res.status(404).json("No se encontro el ejercicio3");
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

router.get("/total-ventas-paracetamol", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const nombreMedicamento = "Paracetamol";
    const ventasParacetamol = await ventasCollection
      .find({
        "medicamentosVendidos.nombreMedicamento": nombreMedicamento,
      })
      .toArray();

    let totalVentasParacetamol = 0;
    ventasParacetamol.forEach((venta) => {
      venta.medicamentosVendidos.forEach((medicamento) => {
        if (medicamento.nombreMedicamento === nombreMedicamento) {
          totalVentasParacetamol += medicamento.cantidadVendida;
        }
      });
    });

    client.close();

    res.json({ totalVentasParacetamol });
  } catch (error) {
    res.status(404).json("No se encontraron ventas de Paracetamol");
  }
});

//6. Medicamentos que caducan antes del 1 de enero de 2024.

router.get("/medicamentos-caducan-antes-2024", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const medicamentosCollection = db.collection("Medicamentos");

    const fechaLimite = new Date("2024-01-01T00:00:00.000+00:00");

    const medicamentosCaducados = await medicamentosCollection
      .find({
        fechaExpiracion: { $lt: fechaLimite },
      })
      .toArray();

    client.close();

    res.json(medicamentosCaducados);
  } catch (error) {
    res
      .status(404)
      .json("No se encontraron medicamentos caducados antes de 2024");
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
      .sort({ precio: -1 })
      .limit(1)
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
    const { buy } = req.query;
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

//13.Proveedores que no han vendido medicamentos en el último año.

router.get("/proveedores-sin-ventas-ultimo-ano", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const fechaUnAnoAtras = new Date();
    fechaUnAnoAtras.setFullYear(fechaUnAnoAtras.getFullYear() - 1);

    const proveedoresConVentas = await ventasCollection.distinct(
      "empleado.proveedor.nombre",
      {
        fechaVenta: {
          $gte: fechaUnAnoAtras,
          $lte: new Date(),
        },
      }
    );

    const proveedoresCollection = db.collection("Proveedores");
    const todosLosProveedores = await proveedoresCollection.distinct("nombre");

    const proveedoresSinVentas = todosLosProveedores.filter(
      (proveedor) => !proveedoresConVentas.includes(proveedor)
    );

    client.close();

    res.json(proveedoresSinVentas);
  } catch (error) {
    res
      .status(404)
      .json("Error al buscar proveedores sin ventas en el último año");
  }
});

//14. Obtener el total de medicamentos vendidos en marzo de 2023.

router.get("/total-medicamentos-marzo-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const collection = db.collection("Ventas");

    const fechaInicioMarzo = new Date("2023-03-01T00:00:00.000+00:00");
    const fechaFinMarzo = new Date("2023-03-31T23:59:59.999+00:00");

    const result = await collection
      .find({
        fechaVenta: {
          $gte: fechaInicioMarzo,
          $lte: fechaFinMarzo,
        },
      })
      .toArray();

    let totalMedicamentosVendidos = 0;
    for (const venta of result) {
      for (const medicamento of venta.medicamentosVendidos) {
        totalMedicamentosVendidos += medicamento.cantidadVendida;
      }
    }

    client.close();

    res.json({ totalMedicamentosVendidos });
  } catch (error) {
    res.status(404).json("No se encontraron ventas en marzo de 2023");
  }
});

//15. Obtener el medicamento menos vendido en 2023.

router.get("/medicamento-menos-vendido-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const collection = db.collection("Ventas");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const result = await collection
      .find({
        fechaVenta: {
          $gte: fechaInicio2023,
          $lte: fechaFin2023,
        },
      })
      .toArray();

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

    const medicamentoMenosVendido = Object.keys(medicamentosVendidos).reduce(
      (min, medicamento) => {
        return medicamentosVendidos[medicamento] < medicamentosVendidos[min]
          ? medicamento
          : min;
      },
      Object.keys(medicamentosVendidos)[0]
    );

    client.close();

    res.json({ medicamentoMenosVendido });
  } catch (error) {
    res.status(404).json("No se encontraron ventas en 2023");
  }
});

//16. Ganancia total por proveedor en 2023 (asumiendo un campo precioCompra en Compras).

router.get("/ganancia-total-por-proveedor-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const comprasCollection = db.collection("Compras");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const pipeline = [
      {
        $match: {
          fechaCompra: {
            $gte: fechaInicio2023,
            $lte: fechaFin2023,
          },
        },
      },
      {
        $unwind: "$medicamentosComprados",
      },
      {
        $group: {
          _id: "$proveedor.nombre",
          gananciaTotal: {
            $sum: {
              $multiply: [
                "$medicamentosComprados.cantidadComprada",
                "$medicamentosComprados.precioCompra",
              ],
            },
          },
        },
      },
    ];

    const result = await comprasCollection.aggregate(pipeline).toArray();

    client.close();

    res.json(result);
  } catch (error) {
    res.status(404).json("No se encontraron registros de compras en 2023");
  }
});

// 17. Promedio de medicamentos comprados por venta.

router.get("/promedio-medicamentos-comprados-por-venta", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const collection = db.collection("Compras");

    const result = await collection.find({}).toArray();

    let totalMedicamentos = 0;
    let totalVentas = result.length;

    for (const compra of result) {
      totalMedicamentos += compra.medicamentosComprados.length;
    }

    const promedio = totalVentas > 0 ? totalMedicamentos / totalVentas : 0;

    client.close();

    res.json({ promedio });
  } catch (error) {
    res.status(404).json("No se encontraron compras");
  }
});

//18: Cantidad de ventas realizadas por cada empleado en 2023.

router.get("/ventas-por-empleado-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const collection = db.collection("Ventas");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const result = await collection
      .find({
        fechaVenta: {
          $gte: fechaInicio2023,
          $lte: fechaFin2023,
        },
      })
      .toArray();

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
    res.status(404).json("No se encontraron ventas en 2023");
  }
});

//19. Obtener todos los medicamentos que expiren en 2024.

router.get("/medicamentos-que-expiran-en-2024", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const collection = db.collection("Medicamentos");

    const fechaInicio2024 = new Date("2024-01-01T00:00:00.000+00:00");
    const fechaFin2024 = new Date("2024-12-31T23:59:59.999+00:00");

    const result = await collection
      .find({
        fechaExpiracion: {
          $gte: fechaInicio2024,
          $lte: fechaFin2024,
        },
      })
      .toArray();

    client.close();

    res.json(result);
  } catch (error) {
    res.status(404).json("No se encontraron medicamentos que expiren en 2024");
  }
});

//20. Empleados que hayan hecho más de 5 ventas en total.
router.get("/empleados-mas-de-5-ventas", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const pipeline = [
      {
        $unwind: "$medicamentosVendidos",
      },
      {
        $group: {
          _id: "$empleado.nombre",
          ventasRealizadas: { $sum: 1 },
        },
      },
      {
        $match: {
          ventasRealizadas: { $gt: 5 },
        },
      },
    ];

    const result = await ventasCollection.aggregate(pipeline).toArray();

    client.close();

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json("No se encontraron empleados con más de 5 ventas");
    }
  } catch (error) {
    res.status(404).json("Error al buscar empleados");
  }
});

//21 Medicamentos que no han sido vendidos nunca.

router.get("/medicamentos-no-vendidos", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const medicamentosVendidos = await ventasCollection.distinct(
      "medicamentosVendidos.nombreMedicamento"
    );

    const todosLosMedicamentos = await ventasCollection.distinct(
      "medicamentosVendidos.nombreMedicamento"
    );

    const medicamentosNoVendidos = todosLosMedicamentos.filter(
      (medicamento) => !medicamentosVendidos.includes(medicamento)
    );

    client.close();

    res.json(medicamentosNoVendidos);
  } catch (error) {
    res.status(404).json("Error al buscar medicamentos no vendidos");
  }
});

//22. Paciente que ha gastado más dinero en 2023.

router.get("/paciente-mayor-gasto-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const pipeline = [
      {
        $match: {
          fechaVenta: {
            $gte: fechaInicio2023,
            $lte: fechaFin2023,
          },
        },
      },
      {
        $unwind: "$medicamentosVendidos",
      },
      {
        $group: {
          _id: "$paciente.nombre",
          gastoTotal: {
            $sum: {
              $multiply: [
                "$medicamentosVendidos.cantidadVendida",
                "$medicamentosVendidos.precio",
              ],
            },
          },
        },
      },
      {
        $sort: {
          gastoTotal: -1,
        },
      },
      {
        $limit: 1,
      },
    ];

    const result = await ventasCollection.aggregate(pipeline).toArray();

    client.close();

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json("No se encontraron pacientes en 2023");
    }
  } catch (error) {
    res.status(404).json("No se encontraron pacientes en 2023");
  }
});

//23. Empleados que no han realizado ninguna venta en 2023

router.get("/empleados-sin-ventas-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const empleadosConVentas = await ventasCollection.distinct(
      "empleado.nombre",
      {
        fechaVenta: {
          $gte: fechaInicio2023,
          $lte: fechaFin2023,
        },
      }
    );

    const empleadosCollection = db.collection("Empleados");
    const todosLosEmpleados = await empleadosCollection.distinct("nombre");

    const empleadosSinVentas = todosLosEmpleados.filter(
      (empleado) => !empleadosConVentas.includes(empleado)
    );

    client.close();

    res.json(empleadosSinVentas);
  } catch (error) {
    res.status(404).json("Error al buscar empleados sin ventas en 2023");
  }
});

//24. Proveedor que ha suministrado más medicamentos en 2023.

router.get("/proveedor-mayor-suministro-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const comprasCollection = db.collection("Compras");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const pipeline = [
      {
        $match: {
          fechaCompra: {
            $gte: fechaInicio2023,
            $lte: fechaFin2023,
          },
        },
      },
      {
        $unwind: "$medicamentosComprados",
      },
      {
        $group: {
          _id: "$proveedor.nombre",
          suministroTotal: { $sum: "$medicamentosComprados.cantidadComprada" },
        },
      },
      {
        $sort: {
          suministroTotal: -1,
        },
      },
      {
        $limit: 1,
      },
    ];

    const result = await comprasCollection.aggregate(pipeline).toArray();

    client.close();

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json("No se encontraron proveedores en 2023");
    }
  } catch (error) {
    res.status(404).json("No se encontraron proveedores en 2023");
  }
});

//25. Pacientes que compraron el medicamento “Paracetamol” en 2023.

router.get("/pacientes-compraron-paracetamol-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const result = await ventasCollection
      .find({
        fechaVenta: {
          $gte: fechaInicio2023,
          $lte: fechaFin2023,
        },
        "medicamentosVendidos.nombreMedicamento": "Paracetamol",
      })
      .toArray();

    client.close();

    if (result.length > 0) {
      const pacientes = result.map((venta) => venta.paciente);
      res.json(pacientes);
    } else {
      res
        .status(404)
        .json("No se encontraron pacientes que compraron Paracetamol en 2023");
    }
  } catch (error) {
    res
      .status(404)
      .json("No se encontraron pacientes que compraron Paracetamol en 2023");
  }
});

//26. Total de medicamentos vendidos por mes en 2023.

//27.Empleados con menos de 5 ventas en 2023.

//28. Número total de proveedores que suministraron medicamentos en 2023.

//29. Proveedores de los medicamentos con menos de 50 unidades en stock.

// 30. Pacientes que no han comprado ningún medicamento en 2023.

router.get("/pacientes-sin-compras-en-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const pipeline = [
      {
        $match: {
          fechaVenta: {
            $gte: fechaInicio2023,
            $lte: fechaFin2023,
          },
        },
      },
      {
        $group: {
          _id: "$paciente.nombre",
          comprasRealizadas: { $sum: 1 },
        },
      },
      {
        $match: {
          comprasRealizadas: { $eq: 0 },
        },
      },
    ];

    const result = await ventasCollection.aggregate(pipeline).toArray();

    client.close();

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json("No se encontraron pacientes sin compras en 2023");
    }
  } catch (error) {
    res.status(404).json("Error al buscar pacientes");
  }
});

//31. Medicamentos que han sido vendidos cada mes del año 2023.

//32. Empleado que ha vendido la mayor cantidad de medicamentos distintos en 2023.

router.get(
  "/empleado-mayor-venta-medicamentos-distintos-2023",
  async (req, res) => {
    try {
      const client = new MongoClient(bases);
      await client.connect();
      const db = client.db("farmaciaCampus");
      const ventasCollection = db.collection("Ventas");
      const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
      const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

      const pipeline = [
        {
          $match: {
            fechaVenta: {
              $gte: fechaInicio2023,
              $lte: fechaFin2023,
            },
          },
        },
        {
          $unwind: "$medicamentosVendidos",
        },
        {
          $group: {
            _id: "$empleado.nombre",
            medicamentosDistintos: {
              $addToSet: "$medicamentosVendidos.nombreMedicamento",
            },
          },
        },
        {
          $sort: {
            totalMedicamentosDistintos: -1,
          },
        },
        {
          $limit: 1,
        },
      ];

      const result = await ventasCollection.aggregate(pipeline).toArray();

      client.close();

      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json("No se encontraron empleados en 2023");
      }
    } catch (error) {
      res.status(404).json("No se encontraron empleados en 2023");
    }
  }
);

//33. empleado-mayor-venta-medicamentos-distintos-2023

router.get("/paciente-mayor-gasto-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");

    const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
    const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

    const pipeline = [
      {
        $match: {
          fechaVenta: {
            $gte: fechaInicio2023,
            $lte: fechaFin2023,
          },
        },
      },
      {
        $unwind: "$medicamentosVendidos",
      },
      {
        $group: {
          _id: "$paciente.nombre",
          gastoTotal: {
            $sum: {
              $multiply: [
                "$medicamentosVendidos.cantidadVendida",
                "$medicamentosVendidos.precio",
              ],
            },
          },
        },
      },
      {
        $sort: {
          gastoTotal: -1,
        },
      },
      {
        $limit: 1,
      },
    ];

    const result = await ventasCollection.aggregate(pipeline).toArray();

    client.close();

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json("No se encontraron pacientes en 2023");
    }
  } catch (error) {
    res.status(404).json("No se encontraron pacientes en 2023");
  }
});

//34. Medicamentos que no han sido vendidos en 2023.

// 35. Proveedores que han suministrado al menos 5 medicamentos diferentes en 2023.

router.get(
  "/proveedores-con-5-o-mas-medicamentos-en-2023",
  async (req, res) => {
    try {
      const client = new MongoClient(bases);
      await client.connect();
      const db = client.db("farmaciaCampus");
      const medicamentosCollection = db.collection("Medicamentos");
      const fechaInicio2023 = new Date("2023-01-01T00:00:00.000+00:00");
      const fechaFin2023 = new Date("2023-12-31T23:59:59.999+00:00");

      const pipeline = [
        {
          $match: {
            fechaExpiracion: {
              $gte: fechaInicio2023,
              $lte: fechaFin2023,
            },
          },
        },
        {
          $group: {
            _id: "$proveedor.nombre",
            medicamentosDiferentes: { $addToSet: "$nombre" },
          },
        },
        {
          $match: {
            medicamentosDiferentes: { $size: { $gte: 5 } },
          },
        },
      ];

      const result = await medicamentosCollection.aggregate(pipeline).toArray();

      client.close();

      if (result.length > 0) {
        res.json(result);
      } else {
        res
          .status(404)
          .json(
            "No se encontraron proveedores con al menos 5 medicamentos diferentes en 2023"
          );
      }
    } catch (error) {
      res.status(404).json("no hay");
    }
  }
);

//36. Total de medicamentos vendidos en el primer trimestre de 2023.

router.get(
  "/total-medicamentos-vendidos-primer-trimestre-2023",
  async (req, res) => {
    try {
      const client = new MongoClient(bases);
      await client.connect();
      const db = client.db("farmaciaCampus");
      const ventasCollection = db.collection("Ventas");

      const fechaInicioPrimerTrimestre = new Date(
        "2023-01-01T00:00:00.000+00:00"
      );
      const fechaFinPrimerTrimestre = new Date("2023-03-31T23:59:59.999+00:00");

      const result = await ventasCollection
        .aggregate([
          {
            $match: {
              fechaVenta: {
                $gte: fechaInicioPrimerTrimestre,
                $lte: fechaFinPrimerTrimestre,
              },
            },
          },
          {
            $unwind: "$medicamentosVendidos",
          },
          {
            $group: {
              _id: null,
              totalMedicamentosVendidos: {
                $sum: "$medicamentosVendidos.cantidadVendida",
              },
            },
          },
        ])
        .toArray();

      client.close();

      if (result.length > 0) {
        res.json(result[0].totalMedicamentosVendidos);
      } else {
        res
          .status(404)
          .json("No se encontraron ventas en el primer trimestre de 2023");
      }
    } catch (error) {
      res
        .status(404)
        .json("No se encontraron ventas en el primer trimestre de 2023");
    }
  }
);

//37. Empleados que no realizaron ventas en abril de 2023.

router.get("/empleados-sin-ventas-abril-2023", async (req, res) => {
  try {
    const client = new MongoClient(bases);
    await client.connect();
    const db = client.db("farmaciaCampus");
    const ventasCollection = db.collection("Ventas");
    const fechaInicioAbril2023 = new Date("2023-04-01T00:00:00.000+00:00");
    const fechaFinAbril2023 = new Date("2023-04-30T23:59:59.999+00:00");

    const ventasAbril2023 = await ventasCollection
      .find({
        fechaVenta: {
          $gte: fechaInicioAbril2023,
          $lte: fechaFinAbril2023,
        },
      })
      .toArray();

    const empleadosConVentasAbril2023 = new Set(
      ventasAbril2023.map((venta) => venta.empleado.nombre)
    );

    const empleadosCollection = db.collection("Empleados");
    const todosLosEmpleados = await empleadosCollection.find({}).toArray();

    const empleadosSinVentasAbril2023 = todosLosEmpleados.filter(
      (empleado) => !empleadosConVentasAbril2023.has(empleado.nombre)
    );

    client.close();

    if (empleadosSinVentasAbril2023.length > 0) {
      res.json(empleadosSinVentasAbril2023);
    } else {
      res.json("Todos los empleados realizaron ventas en abril de 2023.");
    }
  } catch (error) {
    res.status(500).json("Error al buscar empleados.");
  }
});

//38. Medicamentos con un precio mayor a 50 y un stock menor a 100.

router.get(
  "/medicamentos-precio-mayor-50-stock-menor-100",
  async (req, res) => {
    try {
      const client = new MongoClient(bases);
      await client.connect();
      const db = client.db("farmaciaCampus");
      const medicamentosCollection = db.collection("Medicamentos");
      const filtro = {
        precio: { $gt: 50 },
        stock: { $lt: 100 },
      };

      const medicamentos = await medicamentosCollection.find(filtro).toArray();

      client.close();

      if (medicamentos.length > 0) {
        res.json(medicamentos);
      } else {
        res
          .status(404)
          .json(
            "No se encontraron medicamentos con precio mayor a 50 y stock menor a 100."
          );
      }
    } catch (error) {
      res.status(500).json("Error al buscar medicamentos.");
    }
  }
);



export default router;
