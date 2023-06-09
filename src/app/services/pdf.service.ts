import { Injectable } from '@angular/core';
import {PdfMakeWrapper} from 'pdfmake-wrapper';
// npm i pdfmake-wrapper && npm i pdfmake --save-dev
import { HttpClient } from '@angular/common/http';
import { GuiaEntrega } from '../models/guiaEntrega';
import { GestionCamionesService } from './gestion-camiones.service';
import { Manifiesto } from '../models/manieifiesto';
import { format } from 'date-fns';
import { RutasZonasService } from './rutas-zonas.service';
import { environment } from 'src/environments/environment';
import { ConfiguracionesService } from './configuraciones.service';
import { FacturasService } from './facturas.service';
import { facturasGuia } from '../models/facturas';
interface Respuesta  {
  error: string,
  idToken: string
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(
public http: HttpClient,
public camionesService:GestionCamionesService,
public rutasZonasService:RutasZonasService,
public configuracionesService: ConfiguracionesService,
public facturasService: FacturasService

  ) { }


  getAPI(api: string) {
    let test: string = ''

    if (!environment.prdMode) test = environment.TestURL;
    let URL = this.configuracionesService.company.preURL + test + this.configuracionesService.company.postURL + api;
    this.configuracionesService.api = URL;

    return URL;

  }

  private getToken (){
    // POST
    // API https://apiirp.di-apps.co.cr/api/impresiones
    const URL = this.configuracionesService.company.printing;
    const options = {
      headers : {
        'UserAgent': 'SDERP/1.0.3',
        'Content-Type': 'application/json',
        'Accept': '/',
    }
    };
 
    console.log('getToken', URL);
    console.log('printingUser',JSON.stringify(this.configuracionesService.company.printingUser));


    return this.http.post<Respuesta>( URL, '{"email": "mherra@sde.cr","password": "0r#H8lVR*!f9uV4&2y"}', options );

  }
  
  totalBultos(array: facturasGuia[]) {
    let sum = 0;

    for (let i = 0; i < array.length; i += 1) {
      sum +=  array[i].RUBRO1 ?  Number(array[i].RUBRO1) : 0;
    }

    return sum;
  }

async syncPostGetTokenToPromise(){

  return this.getToken().toPromise();
}
  async rellenarpdf(titulo:string,image:any,guia:GuiaEntrega,facturas:Manifiesto[]){
    const totalFacturas = await this.facturasService.syncGetFacturasGuiasToPromise(guia.idGuia);
  await this.camionesService.syncCamionesToPromise().then(resp => {this.camionesService .camiones = resp});
  await this.rutasZonasService.syncRutasToPromise().then(resp => {this.rutasZonasService.rutas = resp});
    let i =  this.camionesService.camiones.findIndex(camion => camion.idCamion == guia.idCamion);
    let r =  this.rutasZonasService.rutas.findIndex(ruta => ruta.RUTA == guia.ruta);
    let choferCamion = '';
    let nombreRuta = '';
if(i >=0){
  choferCamion =  this.camionesService.camiones[i].chofer
}
if(r >=0){
  nombreRuta = this.rutasZonasService.rutas[r].DESCRIPCION
}

    const pdf = new PdfMakeWrapper();
    pdf.pageMargins(20);

    pdf.info({
      title:'Manifiesto '+ guia.idGuia,
      author: 'usuario',
      subject: titulo +' de compra',
  });

    let header = {
      layout: 'noBorders', // optional
      table: {
      headerRows: 1,
      widths: [ '*', '*' ],
      body: [
        [ { image: image,width: 120}, [
          { text: 'REPORTE DE FACTURAS',bold: true},
          { text: 'RUTA / RESPONSABLE',bold: true},
        ]]
      ]
    }
    }

    let encabezado = {
      layout: 'Borders', // optional
      table: {
      headerRows: 1,
      widths: [ '*', 'auto', '*' ],
      body: [
        [  { text: 'Consecutivo',bold: true}, [
          {text: 'Fecha',bold: true}
        ],[
         {text: 'RUTA',bold: true},
        ] ],
        [  guia.idGuia, format( new Date( guia.fecha),'yyy-MM-dd') ,nombreRuta + `(${guia.ruta})` ]
      ]
    }
    }
 
    let chofer = {
      layout: 'Borders', // optional
      table: {
      headerRows: 1,
      widths: [ '*', '*' ],
      body: [
        [  { text: 'Chofer',bold: true}, [

          {text: 'Placa',bold: true}
        ] ],
        [ choferCamion, guia.idCamion, ],
        [  { text: 'Clientes',bold: true}, [

          {text: 'Facturas',bold: true}
        ] ],
        [ guia.numClientes, totalFacturas.length ],
        [  { text: 'Bultos',bold: true}, [

          {text: 'Peso',bold: true}
        ] ],
        [ this.totalBultos(totalFacturas).toFixed(2), guia.peso.toFixed(2), ]
      ],
      
    }
    }

    let body = {
      layout: 'lightHorizontalLines', // optional
      table: {
      headerRows: 1,
      widths: [140, 120,40,140, 30 ],
      body: [
        ['FACTURAS','Condicion de Pago', 'Cliente', 'Nombre Del Cliente', 'N/D']
      ]
    }
    }
 
    for(let a =0; a < facturas.length ; a++){

      body.table.body.push(
        
        [       
          facturas[a].FACTURA,facturas[a].CONDICION_PAGO + ' D', facturas[a].idCliente ,facturas[a].nombre,''],       
        )
      if( a == facturas.length -1){
        pdf.add(
          [
          header,
          [{ text: '', margin: [ 10, 10, 10, 10 ]}],
          encabezado,
          [{ text: '', margin: [ 10, 10, 10, 10 ]}],
          chofer,
          [{ text: '', margin: [ 10, 10, 10, 10 ]}],
          body       
        ]
      
        );
// margin: [left, top, right, bottom]
        pdf.footer(function(currentPage, pageCount) { 
          return [{text: 'Página ' +' ' +currentPage.toString() + ' de ' + pageCount  +' ' + 'total facturas ' + facturas.length, alignment: 'center', margin:[ 100, 0]}];  }           
          );
     
       return  pdf; 

      }
    }


  }


}