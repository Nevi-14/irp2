import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionCamionesPageRoutingModule } from './gestion-camiones-routing.module';

import { GestionCamionesPage } from './gestion-camiones.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionCamionesPageRoutingModule,
    PipesModule,
    ComponentsModule
      
  ],
  declarations: [GestionCamionesPage ]
})
export class GestionCamionesPageModule {}
