import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { MapBoxGLService } from 'src/app/services/mapbox-gl.service';

@Component({
  selector: 'app-busqueda-mapa',
  templateUrl: './busqueda-mapa.page.html',
  styleUrls: ['./busqueda-mapa.page.scss'],
})
export class BusquedaMapaPage implements OnInit {
@Input() data;
funcion = 'planificacion-rutas';
filtroToggle = true;
toggleValue = 'id';
longLat = '';
textoBuscar = '';

  constructor(public clientesService: ClientesService, public modalCtrl: ModalController,
    public planificacionRutasService: PlanificacionRutasService,
    public mapboxService: MapBoxGLService
    
    
    
    ) { }

  ngOnInit() {
    console.log(this.data)
this.longLat = '[ ' + this.data.geometry.coordinates + ' ]'
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  seleccionarTodos(){
console.log('todos')
    this.mapboxService.clientes.forEach(marcador =>{
    console.log(marcador)
      marcador.seleccionado = !marcador.seleccionado;
    })
  }
  actualizarCordenadas(){

    const marcadoresActualizados = [];
    
 this.mapboxService.clientes.forEach((marcador, index) =>{

  if(marcador.seleccionado){
  marcador.modificado = true;
  marcador.LONGITUD = this.data.geometry.coordinates[0];
  marcador.LATITUD = this.data.geometry.coordinates[1];
  }

  if(index == this.mapboxService.clientes.length -1){
    this.modalCtrl.dismiss(true);
  }

 })

  }



     
async detalleClientes(cliente){

  const modal = await this.modalCtrl.create({
    component: DetalleClientesPage,
    cssClass: 'UI-modal',
    componentProps:{
      detalleCliente: cliente
    }
  });
  await modal.present();



}
  cambio(){
    console.log(this.toggleValue,' toggle value')
    if(this.toggleValue === 'id' ){
      this.toggleValue = 'nombre'
      this.filtroToggle = false;
    }else{
      this.toggleValue = 'id'
      this.filtroToggle = true;
    }
 
  }

  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
   }
}
