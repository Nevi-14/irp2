import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { InicioPage } from './inicio.page';

import { InicioPageRoutingModule } from './inicio-routing.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AppHeaderModule } from '../../components/app-header.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    PipesModule,
    AppHeaderModule
  ],
  declarations: [InicioPage],

})
export class InicioPageModule {




}

