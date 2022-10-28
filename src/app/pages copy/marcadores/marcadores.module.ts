import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarcadoresPageRoutingModule } from './marcadores-routing.module';

import { MarcadoresPage } from './marcadores.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarcadoresPageRoutingModule,
    PipesModule
  ],
  declarations: [MarcadoresPage]
})
export class MarcadoresPageModule {}
