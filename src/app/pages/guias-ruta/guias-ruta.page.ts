import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesRutasPage } from '../clientes-rutas/clientes-rutas.page';
import { RuteroService } from 'src/app/services/rutero.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { GuiaEntrega } from '../../models/guiaEntrega';
import { AlertasService } from '../../services/alertas.service';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-guias-ruta',
  templateUrl: './guias-ruta.page.html',
  styleUrls: ['./guias-ruta.page.scss'],
})
export class GuiasRutaPage implements OnInit {
  textoBuscar = '';
  textoBuscarClientes = '';
  busquedaClientes = false;
  idGuia = null;
  @Input() ruta:string
    @Input() switch:boolean
    guiasRutas:GuiaEntrega[] =[]
  constructor(

  public modalCtrl: ModalController,
  public clientesService:ClientesService,
  public ruteroService: RuteroService,
  public planificacionEntregasService: PlanificacionEntregasService,
  public alertasService: AlertasService


  ) { }

  ngOnInit() {

 this.alertasService.presentaLoading('Cargando datos...');
    this.planificacionEntregasService.getGuiaEstadoToPromise(this.ruta).then(resp =>{
      this.alertasService.loadingDissmiss();
      this.guiasRutas = resp;

      console.log('resp', resp)
    }, error =>{
      this.alertasService.loadingDissmiss();
    })
    
    this.clientesService.consultaGuias = [];

  
  }
  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     if(this.busquedaClientes){
      this.textoBuscarClientes = event.detail.value;

     }else{
      this.textoBuscar = event.detail.value;
     }
    
   }
   submit(idGuia){
    this.idGuia = idGuia;
    this.clientesService.syncConsultarClientes(idGuia);
    return
 
  }
  toggleEvent($event){

  let value = $event.detail.checked;
if(value){
  this.busquedaClientes = value
  this.clientesService.syncConsultarClientes('');

    console.log($event, 'event')
}

  }
  async detalleClientes(cliente){
    this.ruteroService.syncRutero(this.idGuia).then(resp =>{

      
    })
    let color = null;
    let image = null;
    if(cliente.estado === 'I'){
  image = 'url(assets/icons/shipped.svg)';
    }else{
      image = null
    }

    const modal = await this.modalCtrl.create({
      component: ClientesRutasPage,
      cssClass: 'extra-large-modal',
      componentProps:{
        cliente: cliente,
        color:color,
        imagen: image
      }
    });
    return await modal.present();
  }

retornarModal(guia){

 this.modalCtrl.dismiss({
  guia:guia
 });
}
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
