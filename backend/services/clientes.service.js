const connection = require("../db/connectionDb");

const obtenerClientePorRUC = async (ruc) => {
  const clientes = await connection.query(
    `
        SELECT * FROM clientes
        WHERE ruc = $1
    `,
    [ruc]
  );

  return clientes.rows[0];
};

const insertarCliente = async (ruc, ruc_tipo, nombre, apellido, estado) => {
  const nuevoCliente = await connection.query(
    `
    INSERT INTO public.clientes(
        ruc, ruc_tipo, nombre, apellido, estado)
        VALUES ($1, $2, $3, $4, $5);
    `,
    [ruc, ruc_tipo, nombre, apellido, estado]
  );

  return await obtenerClientePorRUC(ruc);
};  

const buscarCliente = async (buscar) => {
  try{
    if (/\d+/.test(buscar)) {
      const cliente = await obtenerClientePorRUC(buscar);
      if (cliente) {
        return [cliente];
      } else {
        return []
      }
    } else {
      const query = `
      SELECT * FROM clientes
      WHERE lower(nombre) = lower($1) OR
          lower(apellido) = lower($1)
    `;
      const values = [buscar];
      const result = await connection.query(query, values);
      return result.rows;
    }
  }catch(error){
    console.error("Error al buscar el RUC");
  }
}

// const buscarCliente = async (ruc, nombre, apellido) => {
//   try {
//     const newRuc = ruc;
//     const newNombre = nombre;
//     const newApellido = apellido;
//     const query = `
// SELECT 
// cl.nombre as nombre_cliente,
// cl.apellido as apellido_cliente,
// e.nombre as nombre_empleado,
// e.apellido as apellido_empleado,
// cl.ruc,
// c.estado,
// tp.texto as producto,
// c.valor,
// c.fecha_vencimiento

// FROM public.clientes as cl

// LEFT JOIN public.compras as c
// ON cl.id = c.cliente_id
// LEFT JOIN public.tipo_producto as tp
// ON c.tipo = tp.id
// LEFT JOIN public.empleados as e
// ON c.empleado_id = e.id

// WHERE 
//         cl.ruc = $1 OR
//         lower(cl.nombre) = lower($2) OR
//         lower(cl.apellido) = lower($3)
//   `;
//     const values = [newRuc, newNombre, newApellido];
//     const result = await connection.query(query, values);
//     return result.rows;
//   } catch (error) {
//     console.error("Error al buscar el RUC");
//   }
// };

module.exports = {
  obtenerClientePorRUC,
  insertarCliente,
  buscarCliente,
};
