import { NodeCompatibleEventEmitter } from "rxjs/internal/observable/fromEvent";

export class RutaFacturas{

    constructor(
 public TIPO_DOCUMENTO:string,
 public FACTURA: string,
 public ESTA_DESPACHADO: string,
 public MONEDA_FACTURA: string,
 public COMENTARIO_CXC: string,
 public CLASE_DOCUMENTO: string,
 public FECHA_RECIBIDO: Date,
 public PEDIDO: string,
 public TOTAL_VOLUMEN: number,
 public TOTAL_PESO: number,
 public TOTAL_IMPUESTO1: number,
 public FECHA: Date,
 public FECHA_ENTREGA: Date,
 public TOTAL_FACTURA: number,
 public FECHA_PEDIDO: Date,
 public TOTAL_MERCADERIA: number,
 public ORDEN_COMPRA: string,
 public TOTAL_UNIDADES: number,
 public TIPO_CAMBIO: number,
 public EMBARCAR_A: string,
public DIRECCION_FACTURA:string,
public MULTIPLICADOR_EV: string,
public OBSERVACIONES:string,
public RUBRO1: number,
public RUBRO2: string,
public RUBRO3: string,
public RUBRO4: string,
public NIVEL_PRECIO: string,
public COBRADOR: string,
public RUTA: string,
public CONDICION_PAGO: string,
public ZONA: string,
public VENDEDOR: string,
public CLIENTE_DIRECCION: string,
public CLIENTE_CORPORAC: string,
public CLIENTE_ORIGEN: string,
public CLIENTE: string,
public PAIS: string,
public TOTAL_PESO_NETO: number,
public LONGITUD: number,
public LATITUD: number,
public FECHA_RIGE: Date,
public BASE_IMPUESTO1: number,
public BASE_IMPUESTO2: number,
public NOMBRE_CLIENTE: string




    ){}
}