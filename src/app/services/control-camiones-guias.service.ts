import { Injectable } from '@angular/core';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { ListaClientesGuiasPage } from '../pages/lista-clientes-guias/lista-clientes-guias.page';
import { ModalController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { AlertasService } from './alertas.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';
import { Rutero, RuteroMH } from '../models/Rutero';
import { GuiasService } from './guias.service';
import { RuteroService } from './rutero.service';
import { ActualizarFacturasService } from './actualizar-facturas.service';
import { GestionCamionesService } from './gestion-camiones.service';
import { Camiones } from '../models/camiones';
import { ListaGuiasPostPage } from '../pages/lista-guias-post/lista-guias-post.page';
import { DatatableService } from './datatable.service';
interface modeloCamiones {
  placa:string,
  chofer:string,
  volumen:number,
  peso:number,
  numeroGuia:string

}

//=============================================================================
// INTERFACE DE ORDEN ENTREGA CLIENTES
//=============================================================================

interface ordenEntregaCliente {
  id: string,
  idGuia:string,
  cliente: string,
  latitud: number,
  longitud:number,
  distancia: number,
  duracion:number,
  direccion:string,
  bultosTotales:number,
  orden_visita: number,
  HoraInicio:Date,
  HoraFin:Date
}

interface facturas {
//  idFactura:string,
  //cliente:string,
  factura: PlanificacionEntregas;
  idGuia:  string
  
  }

//=============================================================================
// INTERFACE DE  MODELO GUIA DE ENTREGA
//=============================================================================

interface  GuiaEntregaArray{

  idGuia: string,
  verificada:boolean,
  guiaExistente:boolean,
  zona: string,
  ruta: string,
  fecha: string,
  numClientes: number,
  totalFacturas:number
  distancia: number,
  duracion:number
  camion:{
    HoraInicio:string,
    HoraFin:string,
    chofer:string,  
    idCamion: string,
    capacidad: number,
    pesoRestante: number,
    peso: number,
    estado: string,
    HH: string,
    volumen: number,
    frio:string,
    seco:string
  }

  facturas: facturas[],
  ordenEntregaCliente:ordenEntregaCliente[]
}

@Injectable({

  providedIn: 'root'

})

export class ControlCamionesGuiasService {

//=============================================================================
// VARIABLES GLOBALES
//=============================================================================
camionLleno = false;
    rutaZona = null;
    fecha:string;
    lngLat: [number, number] = [ -84.14123589305028, 9.982628288210657 ];
    listaGuias : GuiaEntregaArray[] = [];
    orderArray = [];
    compareArray  : ordenEntregaCliente[] = [];
    complete = 0;

    // Variables proceso de ordenamiento MAURICIO HERRA

    listos: number = 1;
    total: number = 1;
    actual: number = 0;
    menor:  number = 0;
    i:      number = 0;
    p:      number = 0;
    rutero: RuteroMH[] = [];

    ruteros = []
    idGuiasArray = [];
    contadorPost = 0;

 constructor( 
    public modalCtrl: ModalController,
    public alertasService: AlertasService,
    public planificacionEntregasService: PlanificacionEntregasService,
    public guiasService: GuiasService,
    public ruteroService: RuteroService,
    public actualizarFacturasService: ActualizarFacturasService,
    public gestionCamionesService: GestionCamionesService,
    public datatableService: DatatableService

  ) {
  

 }


//=============================================================================
// LIMPIA LOS DATOS DEL SERVICIO
//=============================================================================

limpiarDatos(){
  this.camionLleno = false;
  this.rutaZona = null;
  this.fecha = null;
  this.lngLat  = [ -84.14123589305028, 9.982628288210657 ];
  this.listaGuias  = [];
  this.orderArray = [];
  this.compareArray    = [];
  this.complete = 0;

  // Variables proceso de ordenamiento MAURICIO HERRA

  this.listos  = 1;
  this.total  = 1;
  this.actual  = 0;
  this.menor  = 0;
  this.i = 0;
  this.p  = 0;
  this.rutero  = [];

  this.ruteros = []
  this.idGuiasArray = [];
  this.contadorPost = 0;

  this.guiasService.limpiarDatos();
  this.ruteroService.limpiarDatos();
  this.actualizarFacturasService.limpiarDatos();
  this.datatableService.limpiarDatos()
  this.planificacionEntregasService.limpiarDatos();


}



  //=============================================================================
  // GENERA EL ID DE LA GUIA
  //=============================================================================

  generarIDGuia(){

    let   consecutivo  = null,
    date               = new Date(this.fecha),  // FECHA HOY
    year               = date.getFullYear(),  // AÑO
    month              = (date.getMonth() + 1).toString().padStart(2, "0"), // MES ACTUAL FORMATO 2 DIGITOS EJEMPLO 01
    day                = date.getDate().toString().padStart(2, "0"), // DIA ACTUAL FORMATO FECHA
    ramdomNumber = Math.floor(1000 + Math.random() * 9000);  // DEVUELVE NUMERO ALEATORIO DE 4 DIGITOS
    consecutivo   = year+''+month+''+day+this.rutaZona.Ruta+'V'+ramdomNumber; // CONCATENAMOS LOS VALORES Y GENERAMOS CONSECUTIVO

    return consecutivo; // DEVUELVE CONSECUTIVO

  }





//=============================================================================
// OPCIONES DE  GUIAS
//=============================================================================


  generarGuia(camion:any, existente:boolean, facturas:facturas[]) {

    let indexCamion = this.gestionCamionesService.camiones.findIndex(consultaCamion => consultaCamion.idCamion == camion.idCamion)
    let informacionCamion:Camiones = null;

    if(indexCamion>=0){
      informacionCamion = this.gestionCamionesService.camiones[indexCamion]
    }

    let capacidad = informacionCamion.capacidadPeso;

    let guia = {
      idGuia: camion.numeroGuia != undefined && camion.numeroGuia != null && camion.numeroGuia != ''? camion.numeroGuia : this.generarIDGuia(),
      guiaExistente:existente ? existente : false,
      verificada: false,
      totalFacturas:0,
      distancia: 0,
      duracion:0,
      zona: this.rutaZona.Ruta,
      ruta: this.rutaZona.Zona,
      fecha: this.fecha,
      numClientes: 0,
      camion:{
        numeroGuia: null,
        chofer:camion.chofer,  
        idCamion: camion.idCamion,
        capacidad: capacidad,
        pesoRestante: 0,
        peso: existente ? camion.peso : 0,
        estado : 'INI',
        HH : 'nd',
        volumen: existente ?  camion.volumen : 0,
        frio:informacionCamion.frio,
        seco:informacionCamion.seco,
        HoraInicio:null,
        HoraFin:null
      },
      facturas: [],
      ordenEntregaCliente:[]
    }

    camion.numeroGuia = guia.idGuia;

    console.log('informacionCamion', informacionCamion)
    console.log('camion', camion)
    console.log('existente', existente)
    console.log('facturas', facturas)
    console.log('guia', guia)
    console.log('rutaZona', this.rutaZona)

    //this.modalCtrl.dismiss(null,null,'control-facturas');
    this.listaGuias.push(guia)
    if(facturas && facturas.length > 0){
      facturas.forEach(factura =>{
        if(factura.idGuia){
          this.borrarFactura(factura ).then(resp =>{
            this.agregarFacturaGuia(factura,camion , camion.numeroGuia)
          })
        }else{
          this.agregarFacturaGuia(factura,camion , camion.numeroGuia)
        }
      });
    }
  }

  generarGuiaEnRuta(camion:any,rutero:any[], facturas:facturas[]) {


  console.log(camion,rutero,facturas, 'newwwjdmdm')

  let indexCamion = this.gestionCamionesService.camiones.findIndex(consultaCamion => consultaCamion.idCamion == camion.idCamion)
  let informacionCamion:Camiones = null;
  
  if(indexCamion>=0){
   
  informacionCamion = this.gestionCamionesService.camiones[indexCamion]
  
  }
  console.log('camion generar', camion)
  
  
    let capacidad = informacionCamion.capacidadPeso;
    let guia = {
  
      idGuia: camion.numeroGuia != undefined && camion.numeroGuia != null && camion.numeroGuia != ''? camion.numeroGuia : this.generarIDGuia(),
      guiaExistente:false,
      verificada: false,
      totalFacturas:0,
      distancia: 0,
      duracion:0,
      zona: this.rutaZona.Ruta,
      ruta: this.rutaZona.Zona,
      fecha: this.fecha,
      numClientes: 0,
  
     
    camion:{
      numeroGuia: null,
     chofer:camion.chofer,  
     idCamion: camion.idCamion,
     capacidad: capacidad,
     pesoRestante: 0,
     peso:  camion.peso,
     estado : 'INI',
     HH : 'nd',
     volumen:  camion.volumen,
     frio:informacionCamion.frio,
     seco:informacionCamion.seco,
     HoraInicio:null,
     HoraFin:null
    },
      facturas:[],
      ordenEntregaCliente:[]
   
  }
  
  camion.numeroGuia = guia.idGuia;
  
  
  console.log('informacionCamion', informacionCamion)
  console.log('camion', camion)

  console.log('facturas', facturas)
  console.log('guia', guia)
  console.log('rutaZona', this.rutaZona)
  
  //this.modalCtrl.dismiss(null,null,'control-facturas');
  this.listaGuias.push(guia)
  if(facturas && facturas.length > 0){
  
  facturas.forEach(factura =>{
    if(factura.idGuia){
  
      this.borrarFactura(factura ).then(resp =>{
    
        this.agregarFacturaGuia(factura,camion , camion.numeroGuia)
      })
    
    }else{
      this.agregarFacturaGuia(factura,camion , camion.numeroGuia)
    }
   
    
  });
    
  }
  
  
  }

  agregarFacturaGuia(factura:facturas,camion:any , numeroGuia){
    console.log('numero guia factura', factura)
    this.camionLleno = false;
    let index = this.listaGuias.findIndex(guia => guia.idGuia === numeroGuia);

    console.log('this.listaGuias[index]', this.listaGuias[index],'numeroGuia')
    let indexFactura = this.listaGuias[index].facturas.findIndex(fact => fact.factura.FACTURA == factura.factura.FACTURA);
    if(indexFactura >=0){
      this.alertasService.message('IRP','La factura'+' '+factura.factura.FACTURA+' ya esxite')
      return;
    }
    this.borrarFactura(factura ).then(resp =>{

    })

      // PRE CONSULTA CAMION PESO
    let capacidad = this.listaGuias[index].camion.capacidad;
    let nuevoPeso = this.listaGuias[index].camion.peso;
    nuevoPeso += factura.factura.TOTAL_PESO_NETO;
    let nuevoPesoRestante = capacidad - nuevoPeso;

    if(nuevoPesoRestante < 0 ){
      if(this.camionLleno){
        return
      }
      this.alertasService.message('IRP', 'Sobrepasa la capacidad del camion') 
      this.camionLleno = true;
      return 
  
    }
    console.log('factura', factura)
    console.log( this.listaGuias[index].idGuia, ' this.listaGuias[index]')
    if(index >=0 && camion.numeroGuia ===  this.listaGuias[index].idGuia){
      this.listaGuias[index].camion.peso  += factura.factura.TOTAL_PESO_NETO
      this.listaGuias[index].camion.volumen  += Number(factura.factura.RUBRO1)
      this.listaGuias[index].camion.pesoRestante  = this.listaGuias[index].camion.capacidad - this.listaGuias[index].camion.peso
      factura.idGuia =  this.listaGuias[index].idGuia

      const f =  this.listaGuias[index].ordenEntregaCliente.findIndex(facturas => facturas.id == factura.factura.CLIENTE_ORIGEN );

      if(f < 0){
        let orderPush = {
          id: factura.factura.CLIENTE_ORIGEN,
          idGuia:factura.idGuia,
          cliente: factura.factura.NOMBRE_CLIENTE,
          latitud: factura.factura.LATITUD,
          longitud:factura.factura.LONGITUD,
          direccion:factura.factura.DIRECCION_FACTURA,
          bultosTotales:0,
          distancia: 0,
          duracion:0,
          orden_visita: 0,
          HoraInicio:null,
          HoraFin:null
        }
        this.listaGuias[index].ordenEntregaCliente.push(orderPush)
      } 
      this.listaGuias[index].facturas.push(factura)
      this.listaGuias[index].numClientes = this.listaGuias[index].ordenEntregaCliente.length;
      this.listaGuias[index].totalFacturas = this.listaGuias[index].facturas.length
    }
  }


async detalleGuia(guia){

  const modal = await this.modalCtrl.create({
    component: ListaClientesGuiasPage,
    cssClass: 'large-modal',
    componentProps:{
      facturas:guia.facturas,
      rutaZona:this.rutaZona,
      fecha:this.fecha,
      guia:guia
    },
    id:'detalle-guia'
  });

  modal.present();


}

borrarGuia(idGuia){

  let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == idGuia);

  if(i >=0){
    let facturas = this.listaGuias[i].facturas;

    for(let f =0; f < facturas.length; f++){
      let cliente = facturas[f]
      this.planificacionEntregasService.borrarIdGuiaFactura(idGuia);
      if(f === this.listaGuias[i].facturas.length -1){
        this.listaGuias[i].facturas[f].factura.TIPO_DOCUMENTO = 'F';
        this.listaGuias.splice(i,1);
      }
    }
  }

};


borrarTodasLasGuias(){

  this.listaGuias = [];
  this.planificacionEntregasService.borrarIdGuiaFacturas();

};





//=============================================================================
// POST GUIAS
//=============================================================================


generarPost(){
  console.log(this.listaGuias,'this.listaGuias')
for(let i = 0; i < this.listaGuias.length; i++){
let lista = this.listaGuias[i].ordenEntregaCliente
  for(let j = 0; j < lista.length; j++){
    console.log(lista[j].duracion, lista[j].distancia,'lista[j]',lista[j])
  }

}
}

/////////////////////////////////////////////////////////////////////////////////////////
//   PROCESO DE ORDENAMIENTO NUEVO MH
////////////////////////////////////////////////////////////////////////////////////////


 llenarRutero( guia: GuiaEntregaArray){
  this.alertasService.presentaLoading('Calculando ruta optima...')

  this.rutero = [];
  let item = new RuteroMH( '0', guia.idGuia,'ISLEÑA', 9.982628288210657, -84.14123589305028, 0, 0, '', 0, 0, true , null, null);
  this.rutero.push(item);


 for(let i = 0; i < guia.ordenEntregaCliente.length; i++){
  let cliente =  guia.ordenEntregaCliente[i];
  item = new RuteroMH( cliente.id,  guia.idGuia, cliente.cliente, cliente.latitud, cliente.longitud, cliente.distancia, cliente.duracion, cliente.direccion, cliente.bultosTotales, cliente.orden_visita, false, null, null);
    this.rutero.push( item );

    if(i == guia.ordenEntregaCliente.length -1){
      this.ordenaMH(0, guia)
      console.log('Rutero: ', this.rutero);
    
    }

}

 this.rutero;

}

exportRutero(rutero){

  rutero.forEach(rutero =>{
    console.log(rutero.distancia,rutero.duracion,'rut')
  })
  
}
formatoFecha(date:Date, format:string){

  const dateObj = new Date(date);
  
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  const dateValue = ('0' + dateObj.getDate()).slice(-2);
  const year = dateObj.getFullYear();
  let formatoFecha = null;


  switch(format){

         case '-':
         formatoFecha =  year + '-' + month + '-' + dateValue;
         break;

         case '/':
        formatoFecha =  year + '/' + month + '/' + dateValue;
        break;

        default :
         formatoFecha = dateObj; 

  }
         return formatoFecha;

}

async retornarHora(fecha:Date, duracion, add, guia,end? ){

let date = this.formatoFecha(fecha, '-');
let hours = fecha.getHours();
let minutes = fecha.getMinutes();
if(add){
  minutes = minutes +20 + duracion;
}else{
  minutes = minutes +20

}
let seconds = minutes * 60;
let miliseconds  = seconds  *1000;
let increaseTime = minutes / 60;
let reminder = minutes % 60;
console.log('minutes', minutes)
console.log('increase', increaseTime)
if(increaseTime > 1){

  let newHours = hours+Number(increaseTime.toFixed(0))
  hours = newHours
  minutes = reminder

 if(end != undefined || end !=null){
  if(newHours >= end){
    guia.verificada = false;
      this.alertasService.loadingDissmiss();
      this.alertasService.message('IRP', 'Sobrepasa el tiempo del recorrido permitido.')
      throw new Error("Sobrepasa el tiempo del recorrido permitido");
  }
 }

 }
return  new Date(date +' '+ String(hours)+':'+String(minutes.toFixed(0))+':00');

  
}

ordenaMH(a: number, guia){
  //this.alertasService.presentaLoading('Verificando Guia')
  let m: number;
  let o: number;
  let Fecha = this.formatoFecha(guia.fecha, '-');
  let closeTime = Number( guia.camion.HoraFin.substring(0,2))

  this.getDistancia(a)
    .then( x =>console.log(x, 'final'))
    .then( x => {
      m = this.calcularMenor();
      console.log(m);
      this.rutero[m].asignado = true;
      o = this.sumarOrdenados();
      this.rutero[m].orden_visita = o


      if ( o < this.rutero.length - 1 ){
        this.ordenaMH(m, guia);
      }
      if(o == this.rutero.length -1){

        this.rutero.sort( ( a, b ) => a.orden_visita - b.orden_visita )

         this.agregarTiempo(guia);
     

      //  this.alertasService.loadingDissmiss();  
        
      }
    },error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('IRP', 'Lo sentimos algo salio mal.')
     
    })
    
}

borrarGuiaF(guia:GuiaEntregaArray, factura){
    
  let guiaFacturas = guia.facturas;
  let guiaCamion = guia.camion;
  let guiaClientes = guia.ordenEntregaCliente;
  let numFactura = factura.factura.FACTURA;
  let indexOrdenEntrega  = guiaClientes.findIndex(facturas=> facturas.id = factura.CLIENTE_ORIGEN);

/**
 *   console.log('guiaFacturas', guiaFacturas, 'camion', guiaCamion, 'clientes', guiaClientes, 'index', indexOrdenEntrega,'numeroFactura', numFactura)

 */
  for(let f = 0; f < guiaFacturas.length; f ++){
    const totalFacturasCliente = guiaFacturas.filter((b) => { return b.factura.CLIENTE_ORIGEN ==guia.facturas[f].factura.CLIENTE_ORIGEN});
    guia.facturas.splice(f, 1);
if(totalFacturasCliente.length == 1){
    guia.numClientes  -= 1;
}
  }
/**
 *   for(let f = 0; f < guiaFacturas.length; f ++){

    if(guiaFacturas[f].factura.FACTURA == factura.FACTURA){
            
      let  conteoFacturasCliente = guiaFacturas.filter(clienteFactura =>clienteFactura.factura.FACTURA ==  factura.factura.FACTURA )

      guia.verificada = false;
      guia.distancia = 0;
      guia.duracion = 0;
      guia.totalFacturas = guiaFacturas.length
      guiaCamion.peso -= guiaFacturas[f].factura.TOTAL_PESO_NETO
      guiaCamion.pesoRestante =     guiaCamion.peso - guiaFacturas[f].factura.TOTAL_PESO
      guiaCamion.volumen -= Number(guiaFacturas[f].factura.RUBRO1)
      guiaFacturas[f].idGuia = ''
      guiaFacturas[f].factura.TIPO_DOCUMENTO = 'F';
      guiaFacturas.splice(f, 1)
  

      if(conteoFacturasCliente.length == 0){

        if(indexOrdenEntrega>=0){
          guiaClientes.splice(indexOrdenEntrega,1)
          guia.numClientes = guiaClientes.length

           }

      }

      guia.totalFacturas = guiaFacturas.length

    }
    
    
        
        }
 */
}

agregarTiempo(guia:GuiaEntregaArray){

  let date = guia.fecha;
  let start =  guia.camion.HoraInicio.substring(0,2);
  let end =  guia.camion.HoraFin.substring(0,2);

  for(let t =1; t < this.rutero.length; t++){
    let defaultStartTime = null;
    let defaultEndTime = null;
    if(t == 1){
      defaultStartTime =   new Date(date +' '+  start+':'+ this.rutero[t].duracion.toFixed(0)+':00');
      defaultEndTime =  new Date(date +' '+ defaultStartTime.getHours()+':'+String(defaultStartTime.getMinutes()+20)+':00');
      defaultEndTime.setMinutes(defaultStartTime.getMinutes()+20);
    }else{
      defaultStartTime = new Date(date +' '+  this.rutero[t-1].HoraFin.getHours().toFixed(0)+':00'  +':00');
      defaultStartTime.setMinutes(this.rutero[t-1].HoraFin.getMinutes()+this.rutero[t].duracion);
      defaultEndTime = new Date(date +' '+ String(defaultStartTime.getHours())+':00'+':00');
      defaultEndTime.setMinutes(defaultStartTime.getMinutes()+20)
    }

    console.log('time', defaultStartTime, defaultEndTime)
    if(defaultStartTime.getHours() >=  Number(end) || defaultEndTime.getHours() >=  Number(end)){
      this.alertasService.loadingDissmiss();
      //alert('finished')

      let remaining = this.rutero.slice(t);
      this.rutero.splice(t);
      console.log('remaining', remaining)
      this.gestionCamionesService.syncCamionesToPromise().then(resp =>{
        let facturas = [];
        remaining.forEach(cliente =>{
     
          let facturasCliente = guia.facturas.filter((b) => { return b.factura.CLIENTE_ORIGEN == cliente.id;});
          let index2 = guia.ordenEntregaCliente.findIndex(c => c.id == cliente.id);
          if(index2 >=0){
            guia.ordenEntregaCliente.splice(index2, 1);
            guia.numClientes -= 1;
          };

          console.log('cliente f', facturasCliente)
          facturas.push(...facturasCliente);
        })
        console.log('facturas',facturas)

        facturas.forEach((factura, index) =>{
          let Ifactura =  guia.facturas.findIndex(f => f.factura.CLIENTE_ORIGEN == factura.factura.CLIENTE_ORIGEN);
          if(Ifactura >=0){
            guia.facturas.splice(Ifactura, 1)
          }
          //   factura.idGuia = '';
          guia.totalFacturas = guia.facturas.length
          guia.camion.peso -= factura.factura.TOTAL_PESO_NETO
          guia.camion.pesoRestante =     guia.camion.peso - factura.factura.TOTAL_PESO
          guia.camion.volumen -= Number(factura.factura.RUBRO1)
          //factura.factura.idGuia = ''
          factura.factura.TIPO_DOCUMENTO = 'F';

          console.log('length', facturas.length, 'index', index, 'index-1', index-1)
          if(index == facturas.length-1){
            this.exportarRuteros()
            this.generarGuia(resp[0],false, facturas);
          }
        })
      })
    
      return
    }

    console.log('start', defaultStartTime);
    console.log('end', defaultEndTime);
    this.rutero[t].HoraInicio  = defaultStartTime;
    this.rutero[t].HoraFin = defaultEndTime;

    if(t == this.rutero.length -1){
      console.log('ready to export')
      console.log('guia', guia)
      console.log('inicio',guia.camion.HoraInicio.substring(0,2))
      console.log('duration',this.rutero[t].duracion)
      console.log('Fecha',guia.fecha)
      console.log('mls',':00')
      this.alertasService.loadingDissmiss();
      console.log('rutero', this.rutero)
      this.exportarRuteros();
    }
  }
}

async exportarRuteros(){
  let distancia = 0;
  let duracion = 0;
  console.log('exporting', this.rutero)
  for(let i =0; i <  this.rutero.length; i++){

    distancia += this.rutero[i].distancia
    duracion += this.rutero[i].duracion
    if(i ==  this.rutero.length -1){
      let index = this.listaGuias.findIndex(guia => guia.idGuia ==this.rutero[i].idGuia )
      if(index >=0){

        this.listaGuias[index].ordenEntregaCliente = [];
        this.listaGuias[index].verificada = true;
        this.listaGuias[index].distancia = distancia;
        this.listaGuias[index].duracion = duracion;
        this.listaGuias[index].ordenEntregaCliente  = this.rutero.slice(1);
        let guia = this.listaGuias[index]
      }
    }

    if(i == this.rutero.length-1 ){
      return this.rutero;
    }
  }
}

sumarOrdenados(){
  let c: number = 0;

  this.rutero.forEach( x => {
    if (x.asignado){
      c += 1;
    }
  });
  return c - 1;
}

async getDistancia( a: number ) {


  console.log('ettt', a, this.rutero[a])
  // NOS AYUDA ENCONTRAR LA DISTANCIA Y DURACION

  let start: string;
  let end:   string;
  let URL:   string;
  console.log(URL);

  for (let i = 1; i < this.rutero.length; i++) {
    if ( !this.rutero[i].asignado ){
      start = this.rutero[a].longitud +','+  this.rutero[a].latitud;
      end = this.rutero[i].longitud +','+  this.rutero[i].latitud;
      URL =  `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
      console.log('ettt2', a, this.rutero[a],URL,'URL')
      const query = await fetch(
        URL,
        { method: 'GET' }
      );
      const json = await query.json();

      if(json.routes){
        this.rutero[i].distancia = Number((json.routes[0].distance / 1000).toFixed(2));
    
        this.rutero[i].duracion = Number((json.routes[0].duration / 60).toFixed(2) );
      }
    }
    
  }
  
  return this.rutero;
}

calcularMenor(){
  let menor:  number = 100000;
  let indice: number = 0;

  for (let i = 0; i < this.rutero.length; i++) {
    if ( !this.rutero[i].asignado ){
      if ( this.rutero[i].distancia < menor ){
        menor = this.rutero[i].distancia;
        indice = i;
        console.log('menor', this.rutero[i])


      }
    }
  }
  return indice;
}

devolverRutero(i: number){
  let j: number;

  this.rutero.forEach( x => {
    j = this.listaGuias[i].ordenEntregaCliente.findIndex( y => y.id === x.id );
    if ( j >= 0 ){
      this.listaGuias[i].ordenEntregaCliente[j].duracion = x.duracion;
      this.listaGuias[i].ordenEntregaCliente[j].distancia = x.distancia;
      this.listaGuias[i].ordenEntregaCliente[j].orden_visita = x.orden_visita;
    }
  });
  console.log('return rutero',this.listaGuias[i] )
}

//////////////////////////////////////////////////////////////////////
//
//    FIN DEL PROCESO DE ORDENAMIENTO
//
/////////////////////////////////////////////////////////////////////



 
exportarGuias(){
  
  this.idGuiasArray = [];
  
let  verificarGuias = this.listaGuias.filter(guia => guia.verificada == false);
if(verificarGuias.length > 0){
 this.alertasService.message('Planificación de entregas','Ups!. Todas las guias deben de ser verificadas!. Guias pendientes : ' + verificarGuias.length)

 return
}
this.alertasService.presentaLoading('Guardando Datos..')
  for(let i = 0; i < this.listaGuias.length; i++){
  if(this.listaGuias[i].verificada){
   console.log(this.listaGuias[i],'exporting')

   let guia = this.listaGuias[i];
   let facturas = [];
   this.listaGuias[i].facturas.forEach(factura =>{
    facturas.push(factura)

   })

   let rutero = this.listaGuias[i].ordenEntregaCliente;

   this.completePost(guia,facturas,rutero);
  }

 }
 
}   

  completePost(guia: GuiaEntregaArray, facturas:facturas[], ruteros:ordenEntregaCliente[]){
    let postFacturas = [];
    let postRutero = [];

    const guiaCamion = { 
        idGuia: guia.idGuia,
        fecha: guia.fecha,
        zona: guia.zona,
        ruta: guia.ruta,
        idCamion: guia.camion.idCamion,
        numClientes: guia.numClientes,
        peso: guia.camion.peso,
        estado:  guia.camion.estado,
        HH: guia.camion.HH,
        volumen: guia.camion.volumen
    }

    this.idGuiasArray.push(guiaCamion.idGuia)

    for(let i =0; i <  facturas.length; i++){

      const actualizarFactura = {
        numFactura:   facturas[i].factura.FACTURA,
        tipoDocumento:facturas[i].factura.TIPO_DOCUMENTO,
        Fecha:        new Date(),
        despachado:   'S',
        rubro3:       guia.idGuia,
        U_LATITUD:    facturas[i].factura.LATITUD,
        U_LONGITUD:   facturas[i].factura.LONGITUD,
        Fecha_Entrega: facturas[i].factura.FECHA_ENTREGA,

      }
      postFacturas.push(actualizarFactura) 
    }

    for (let j = 0; j< ruteros.length; j++){

      console.log(ruteros[j].distancia)
        
      const rut = {
        idGuia:guia.idGuia,
        idCliente:ruteros[j].id,
        nombre: ruteros[j].cliente,
        direccion:ruteros[j].direccion,
        latitud:ruteros[j].latitud,
        longitud:ruteros[j].longitud,
        checkin: null,
        latitud_check: null,
        longitud_check: null,
        observaciones:null,
        estado: 'P',
        bultos:ruteros[j].id,
        checkout:null,
        distancia: ruteros[j].distancia,
        Duracion: ruteros[j].duracion,
        orden_Visita:ruteros[j].orden_visita
      }
      
      postRutero.push(rut)
      
      if(j === ruteros.length -1){

        console.log(postFacturas,'postFacturas',)
        let index =  this.listaGuias.findIndex(filtrar => filtrar.idGuia == guia.idGuia);
        if(index >=0){
          //   this.listaGuias.splice(index,1)

          if(this.listaGuias[index].guiaExistente){
            this.guiasService.putGuias(guiaCamion).then(resp =>{
              this.ruteroService.insertarPostRutero(postRutero).then(resp =>{
                this.actualizarFacturasService.insertarFacturas(postFacturas).then(resp =>{
                  this.complete += 1;
                  console.log('completado')

                  if(this.complete == this.listaGuias.length){
                    this.guiasPost();
                    this.limpiarDatos();
                    this.alertasService.loadingDissmiss();
                  }
                });
              })
            });
          }else{
            this.guiasService.insertarGuias(guiaCamion).then(resp =>{
              this.ruteroService.insertarPostRutero(postRutero).then(resp =>{
                this.actualizarFacturasService.insertarFacturas(postFacturas).then(resp =>{
                  this.complete += 1;
                  console.log('completado')

                  if(this.complete == this.listaGuias.length){
                    this.guiasPost();
                    this.limpiarDatos();
                    this.alertasService.loadingDissmiss();
                  
                  }
                });
              })
            })
          }
          console.log(guiaCamion, this.listaGuias[index])
          this.alertasService.loadingDissmiss();
          return
        }
          //  postFacturas = []
            //postRutero = [];

      }
    }
  }
 

  async guiasPost(){
    const modal = await this.modalCtrl.create({
      component:ListaGuiasPostPage,
      mode:'ios',
      componentProps:{
        idGuiasArray:this.idGuiasArray
      }
    });

    return modal.present();
  }

//=============================================================================
// OPCIONES DE FACTURAS
//=============================================================================

borrarFacturaGuia(){
  
}
async borrarFactura(factura:facturas){


  if(  factura.idGuia){

    let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == factura.idGuia);


  if(i >=0){

    let guia = this.listaGuias[i]
    let guiaCamion  = this.listaGuias[i].camion
    let guiaFacturas  = this.listaGuias[i].facturas
    let guiaOrdenEntrega  = this.listaGuias[i].ordenEntregaCliente

    let indexOrdenEntrega  = guiaOrdenEntrega.findIndex(facturas=> facturas.id = factura.factura.CLIENTE_ORIGEN);

    for(let f = 0; f < guiaFacturas.length; f ++){
 
      if(guiaFacturas[f].factura.FACTURA == factura.factura.FACTURA && guiaFacturas[f].factura.CLIENTE_ORIGEN ==  factura.factura.CLIENTE_ORIGEN){
              
        let  conteoFacturasCliente = guiaFacturas.filter(clienteFactura =>clienteFactura.factura.FACTURA ==  factura.factura.FACTURA )

        guia.verificada = false;
        guia.distancia = 0;
        guia.duracion = 0;
        guia.totalFacturas = guiaFacturas.length
        guiaCamion.peso -= guiaFacturas[f].factura.TOTAL_PESO_NETO
        guiaCamion.pesoRestante =     guiaCamion.peso - guiaFacturas[f].factura.TOTAL_PESO
        guiaCamion.volumen -= Number(guiaFacturas[f].factura.RUBRO1)
        guiaFacturas[f].idGuia = ''
        guiaFacturas[f].factura.TIPO_DOCUMENTO = 'F';
        guiaFacturas.splice(f, 1)
    
        this.modalCtrl.dismiss(null,null,'control-facturas');
        if(conteoFacturasCliente.length == 0){
  
          if(indexOrdenEntrega>=0){
            guiaOrdenEntrega.splice(indexOrdenEntrega,1)
            guia.numClientes = guiaOrdenEntrega.length
  
             }
  
        }
  
        this.listaGuias[i].totalFacturas = guiaFacturas.length

      }
      
      
          
          }

 if( this.listaGuias[i].facturas.length == 0){
   this.listaGuias.splice(i, 1)
   
   this.modalCtrl.dismiss();
 }
 

 

  console.log(this.listaGuias, 'listaaa')
  }

  }
return factura
  }


async borrarFactura2(factura:facturas){


  if(  factura.idGuia){

    let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == factura.idGuia);


  if(i >=0){

    let guia = this.listaGuias[i]
    let guiaCamion  = this.listaGuias[i].camion
    let guiaFacturas  = this.listaGuias[i].facturas
    let guiaOrdenEntrega  = this.listaGuias[i].ordenEntregaCliente

    let indexOrdenEntrega  = guiaOrdenEntrega.findIndex(facturas=> facturas.id = factura.factura.CLIENTE_ORIGEN);

    for(let f = 0; f < guiaFacturas.length; f ++){
 
      if(guiaFacturas[f].factura.FACTURA == factura.factura.FACTURA){
              
        let  conteoFacturasCliente = guiaFacturas.filter(clienteFactura =>clienteFactura.factura.FACTURA ==  factura.factura.FACTURA )

        guia.totalFacturas = guiaFacturas.length
        guiaCamion.peso -= guiaFacturas[f].factura.TOTAL_PESO_NETO
        guiaCamion.pesoRestante =     guiaCamion.peso - guiaFacturas[f].factura.TOTAL_PESO
        guiaCamion.volumen -= Number(guiaFacturas[f].factura.RUBRO1)
        guiaFacturas[f].idGuia = ''
        guiaFacturas[f].factura.TIPO_DOCUMENTO = 'F';
        guiaFacturas.splice(f, 1)
    

        if(conteoFacturasCliente.length == 0){
  
          if(indexOrdenEntrega>=0){
            guiaOrdenEntrega.splice(indexOrdenEntrega,1)
            guia.numClientes = guiaOrdenEntrega.length
  
             }
  
        }
  
        this.listaGuias[i].totalFacturas = guiaFacturas.length

      }
      
      
          
          }

 if( this.listaGuias[i].facturas.length == 0){
   this.listaGuias.splice(i, 1)
   
   this.modalCtrl.dismiss();
 }
 

 

  console.log(this.listaGuias, 'listaaa')
  }

  }
return factura
  }

  



















}


