import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import * as  Mapboxgl from 'mapbox-gl';
import { MenuClientesPage } from '../pages/menu-clientes/menu-clientes.page';
import { ModalController } from '@ionic/angular';
import { ConfiguracionRutaService } from '../services/configuracion-ruta.service';
import { DetalleClientesPage } from '../pages/detalle-clientes/detalle-clientes.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
mapSvg = '../assets/home/map.svg';
imagen = '../assets/home/isa.png';
mapa: Mapboxgl.Map;
textoBuscar = '';

array = [
  { nombre:'Cliente 1'},
  { nombre:'Cliente 2'},
  { nombre:'Cliente 3'},
  { nombre:'Cliente 4'},
  { nombre:'Cliente 5'},
  { nombre:'Cliente 6'},
  { nombre:'Cliente 7'},
  { nombre:'Cliente 8'},
  { nombre:'Cliente 9'},
  { nombre:'Cliente 10'},
  { nombre:'Cliente 11'},
  { nombre:'Cliente 12'}
];


  constructor(private modalCtrl: ModalController, private config: ConfiguracionRutaService) {}

  ngOnInit(){
this.createMap(-84.0997786,9.9774527);


  }

  createMap(lng: number, lat: number){
    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.mapa = new Mapboxgl.Map({
      
    container: 'mapa', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    //  MAPBOX  LNG , LAT AND GOOGLE MAPS IS LAT , LNG
    center: [lng,lat], // starting position
    zoom: 16 // starting zoom
    
    });

    this.mapa.on('load', () => {
      this.mapa.resize();
    });
    this.mapa.addControl(new Mapboxgl.NavigationControl());
    this.mapa.addControl(new Mapboxgl.FullscreenControl());
    this.createMarker(lng,lat);
  }

  createMarker(lng: number, lat: number){
    const marker = new Mapboxgl.Marker({
      draggable: true
      })
      .setLngLat([lng, lat])
      .addTo(this.mapa);
      marker.on('drag', () =>{
        console.log(marker.getLngLat());
     //   this.createMap(marker.getLngLat().lng,marker.getLngLat().lat);

      });
  }


 async menuCliente(){
    const modal = await this.modalCtrl.create({
      component: MenuClientesPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  ruta(event){
    this.config.nombreRuta = event.detail.value;
  }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }
  async detalleClientes(){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  addValue(e): void {
    const isChecked = !e.currentTarget.checked;
 if(isChecked=== true){
  this.config.totalClientesRuta += 1;
 }else{
  this.config.totalClientesRuta -= 1;
 }


  }
  
}
