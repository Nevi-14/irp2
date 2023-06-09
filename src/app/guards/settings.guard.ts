import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsGuard implements CanLoad {

  constructor(
public router: Router,
public configuracionesService: ConfiguracionesService,
public usuariosService: UsuariosService

  ){}

  canLoad(){
  
    if(this.configuracionesService.company ||  this.usuariosService.usuario){
     
      return true
    }else{
   
      const navigation = this.router.getCurrentNavigation();

      let url = null;

      if(navigation){
        url = navigation.extractedUrl.toString();
      }
 
      console.log('ur',url)
 
this.router.navigate(['/log-in'],{ queryParams: { returnto: url } });
 
      return false;
    }
    
  }


}
