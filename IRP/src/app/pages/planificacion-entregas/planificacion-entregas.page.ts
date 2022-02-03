import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { ZonasService } from 'src/app/services/zonas.service';

import { FechaPage } from '../fecha/fecha.page';
import { RutasPage } from '../rutas/rutas.page';
import { ListaCapacidadCamionesPage } from '../lista-capacidad-camiones/lista-capacidad-camiones.page';
import { RutasService } from 'src/app/services/rutas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';

@Component({
  selector: 'app-planificacion-entregas',
  templateUrl: './planificacion-entregas.page.html',
  styleUrls: ['./planificacion-entregas.page.scss'],
})
export class PlanificacionEntregasPage implements OnInit {
  image = '../assets/icons/delivery-truck.svg'
 fechaEntrega:string;
 ruta: any;
 verdadero = true;
 falso = false;
rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
factura = null;
totalBultosFactura: number;
pesoTotalBultosFactura: number;

  constructor(


    public modalCtrl: ModalController, 
    public rutas:RutasService, 
    public zonas:ZonasService, 
    public rutaFacturas: RutaFacturasService , 
    public popOverCrtl: PopoverController, 
    public rutaZonas: RutaZonaService,
    public camionesService: GestionCamionesService



  ) { }

  ngOnInit() {
    console.log('test')
    this.rutaFacturas.rutaFacturasArray = [];
    
    this.camionesService.syncCamiones();


  }

  stringToBoolean(value){
    switch(value){
        case "F": 
        case "S": 
          return true;
        default: 
          return false;
    }
}

  async calendar(){
    
    const modal = await this.modalCtrl.create({
      component: FechaPage,
      cssClass: 'custom-modal',
    });
    modal.present();
  
    
  
    const { data } = await modal.onDidDismiss();
  console.log(data)
    if(data !== undefined){
    
     this.fechaEntrega = new Date(data.data).toLocaleDateString()
     this.totalBultosFactura == 0;
     this.pesoTotalBultosFactura == 0;
     this.rutaFacturas.syncRutaFacturas(this.rutaZonaData.rutaID, data.data)

 


    }
  }

  async syncRutas(){





    const popover = await this.popOverCrtl.create({
      component: FechaPage,
      cssClass: 'auto-size-modal',
      translucent: true
    });
    popover.present();
    const { data } = await popover.onDidDismiss();
    const ruta = data.ruta;


  console.log(data)
    if(data !== undefined){
       this.rutaFacturas.syncRutaFacturas( this.rutaZonaData.rutaID,  data.ruta);
      
    }
}


async listaCamiones(){
  const modal = await this.modalCtrl.create({
    component: ListaCapacidadCamionesPage,
    cssClass: 'my-custom-class'
  });
  return await modal.present();

}

  async configuracionZonaRuta(evento) {



    const popover = await this.popOverCrtl.create({
      component: RutasPage,
      cssClass: 'menu-map-popOver',
      event: evento,
      translucent: true,
      mode:'ios'
    });
  
     popover.present();
  
  
    const   {data}  = await popover.onDidDismiss();
    const ruta = data.ruta;
  
    if(data!==undefined){


      const i = this.rutaZonas.rutasZonasArray.findIndex( r => r.Ruta ===  ruta);
        

     
      if ( i >= 0 ){
        const  z = this.zonas.zonas.findIndex( z => z.ZONA === this.rutaZonas.rutasZonasArray[i].Zona);
           this.rutaZonaData.rutaID = this.rutaZonas.rutasZonasArray[i].Ruta;
           this.rutaZonaData.ruta =this.rutaZonas.rutasZonasArray[i].Descripcion;
           this.rutaZonaData.zonaId =  this.zonas.zonas[z].ZONA;
           this.rutaZonaData.zona = this.zonas.zonas[z].NOMBRE;
        
         }  

         const modal = await this.modalCtrl.create({
          component: FechaPage,
          cssClass: 'custom-modal',
        });
        modal.present();
      
        
      
        const { data } = await modal.onDidDismiss();
      console.log(data)
        if(data !== undefined){
          this.totalBultosFactura == 0;
  this.pesoTotalBultosFactura == 0;
         this.fechaEntrega = new Date(data.data).toLocaleDateString()

         this.rutaFacturas.rutaFacturasArray.forEach( factura =>{
  this.totalBultosFactura  +=Number( factura.RUBRO1);
  this.pesoTotalBultosFactura += Number(factura.TOTAL_PESO_NETO);
  console.log(this.totalBultosFactura, 'total bultos', this.pesoTotalBultosFactura, 'total peso')

         })
   

       this.rutaFacturas.syncRutaFacturas(this.rutaZonaData.rutaID, data.data)


        }else{
     
          this.rutaZonaData = {rutaID: '', ruta: '', zonaId:'', zona:''};
        
        }

    }
  
  }



}
