import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { MapService } from 'src/app/services/map.service';
import { RutasService } from 'src/app/services/rutas.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutaZonaService } from '../../services/ruta-zona.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit {
  zona = {
    ZONA: '', 
    NOMBRE: ''
  }
  ruta= {
    RUTA: '', 
  DESCRIPCION: ''
}
textoBuscar = '';
textoBuscarZona = '';


  constructor(private rutas: RutasService, private zonas: ZonasService, private modalCtrl: ModalController, private clienteEspejo: ClienteEspejoService,private alertCtrl: AlertController, private rutaZona: RutaZonaService, private mapa: MapService, private clientes: ClientesService) { }

  ngOnInit() {

  }
  rutaRadioButtuon(ev: any){
    const ruta = ev.target.value;
    console.log(ruta)
    const i = this.rutaZona.rutasZonasArray.findIndex( r => r.Ruta === ruta.Ruta );
    if ( i >= 0 ){
  
      this.ruta.RUTA = this.rutaZona.rutasZonasArray[i].Ruta;
      this.ruta.DESCRIPCION = ruta.Ruta;
      this.zona.ZONA = this.rutaZona.rutasZonasArray[i].Zona;
      this.zona.NOMBRE = this.rutaZona.rutasZonasArray[i].Descripcion;
    } else {
    console.log('no se pudo encontrar la ruta')
    }


    console.log(  'ruta',this.ruta)
  }

  salvarConfiguracion(){
if(this.zona.ZONA === '' || this.rutas.ruta.RUTA === ''){
  this.message('IRP','Verificar Ruta y Zona');
}else{
  console.log(this.zona.ZONA,'zona')
  console.log(this.rutas.ruta.RUTA,'rutas')
  this.rutas.ruta = this.ruta;
  this.zonas.zona = this.zona;
  this.modalCtrl.dismiss();
  this.clienteEspejo.syncRutas(this.ruta.RUTA);

  this.clienteEspejo.rutas = [];
  this.clientes.clientesRutas = [];

}
  }
  
  onSearchChange(event){
    console.log(event.detail.value);
    this.textoBuscar = event.detail.value;
  }

    
  onSearchChangeZona(event){
    console.log(event.detail.value);
    this.textoBuscarZona = event.detail.value;
  }


  async  message(subtitle ,messageAlert){
    
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'ISLEÑA IRP',
      subHeader: subtitle,
      message: messageAlert,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

}
cerrarModal(){
  this.modalCtrl.dismiss();
}
  
}