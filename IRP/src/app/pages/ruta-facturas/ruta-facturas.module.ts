import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaFacturasPageRoutingModule } from './ruta-facturas-routing.module';

import { RutaFacturasPage } from './ruta-facturas.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaFacturasPageRoutingModule


    
  ],
  declarations: [RutaFacturasPage]
})
export class RutaFacturasPageModule {}
