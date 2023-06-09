import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniMapaComponent } from './mini-mapa/mini-mapa.component';
import { MapaComponent } from './mapa/mapa.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { RutaMapaComponent } from './ruta-mapa/ruta-mapa.component';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { PiePaginaComponent } from './pie-pagina/pie-pagina.component';




@NgModule({
  declarations: [MiniMapaComponent,MapaComponent, RutaMapaComponent,EncabezadoComponent,PiePaginaComponent],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  exports: [
  MiniMapaComponent,MapaComponent,RutaMapaComponent,EncabezadoComponent,PiePaginaComponent

  ]
})
export class ComponentsModule { }
