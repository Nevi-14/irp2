import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camiones } from '../models/camiones';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class GestionCamionesService {
  camiones: Camiones[]=[];



  constructor(
    private http: HttpClient,
    public alertasService: AlertasService
    
    ) { }

  getIRPURL( api: string,id: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +  environment.postURL + api + id;
console.log(URL);
    return URL;
  }
  private getCamiones( ){
    const URL = this.getIRPURL( environment.camionesURL,'');
    return this.http.get<Camiones[]>( URL );
  }

  syncCamiones(){
   this.camiones = [];
    this.alertasService.presentaLoading('Cargando Lista de camiones')
    this.getCamiones().subscribe(
      resp =>{
        this.camiones = resp.slice(0);

this.alertasService.loadingDissmiss();
        console.log(this.camiones, 'camiones')

      }, error  => {
        this.alertasService.loadingDissmiss();
        let errorObject = {
          titulo: 'Lista de camiones',
          metodo:'GET',
          url:error.url,
          message:error.message,
          rutaError:'app/services/gestion-camiones.ts',
          json:JSON.stringify(this.camiones)
        }
        this.alertasService.elementos.push(errorObject)
        
      }

    );
  }
}
