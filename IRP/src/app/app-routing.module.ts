import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';
import { InicioPageModule } from './pages/inicio/inicio.module';


const routes: Routes = [
  {
    path: 'log-in',
    loadChildren: () => import('./pages/log-in/log-in.module').then( m => m.LogInPageModule)
  },
  {
    path: '',
    redirectTo: '/log-in',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'menu-clientes',
    loadChildren: () => import('./pages/menu-clientes/menu-clientes.module').then( m => m.MenuClientesPageModule)
  },
  {
    path: 'detalle-clientes',
    loadChildren: () => import('./pages/detalle-clientes/detalle-clientes.module').then( m => m.DetalleClientesPageModule)
  },
  {
    path: 'log-in',
    loadChildren: () => import('./pages/log-in/log-in.module').then( m => m.LogInPageModule)
  },
  {
    path: 'rutas',
    loadChildren: () => import('./pages/rutas/rutas.module').then( m => m.RutasPageModule)
  },
  {
    path: 'planificacion-rutas',
    loadChildren: () => import('./pages/planificacion-rutas/planificacion-rutas.module').then( m => m.PlanificacionRutasPageModule)
  },
  {
    path:'**',
    redirectTo: 'mapas'
  },
  {
    path: 'mantenimiento-rutas',
    loadChildren: () => import('./pages/mantenimiento-rutas/mantenimiento-rutas.module').then( m => m.MantenimientoRutasPageModule)
  },
  {
    path: 'ruta-facturas',
    loadChildren: () => import('./pages/ruta-facturas/ruta-facturas.module').then( m => m.RutaFacturasPageModule)
  },
  {
    path: 'cliente-factura',
    loadChildren: () => import('./pages/cliente-factura/cliente-factura.module').then( m => m.ClienteFacturaPageModule)
  },
  
  {
    path: 'marcadores',
    loadChildren: () => import('./pages/marcadores/marcadores.module').then( m => m.MarcadoresPageModule)
  },
  {
    path: 'fecha',
    loadChildren: () => import('./pages/fecha/fecha.module').then( m => m.FechaPageModule)
  },
  {
    path: 'busqueda-mapa',
    loadChildren: () => import('./pages/busqueda-mapa/busqueda-mapa.module').then( m => m.BusquedaMapaPageModule)
  },
  {
    path: 'lista-clientes-ruta-facturas',
    loadChildren: () => import('./pages/lista-clientes-ruta-facturas/lista-clientes-ruta-facturas.module').then( m => m.ListaClientesRutaFacturasPageModule)
  },
  {
    path: 'planificacion-entregas',
    loadChildren: () => import('./pages/planificacion-entregas/planificacion-entregas.module').then( m => m.PlanificacionEntregasPageModule)
  },
  {
    path: 'gestion-camiones',
    loadChildren: () => import('./pages/gestion-camiones/gestion-camiones.module').then( m => m.GestionCamionesPageModule)
  },
  {
    path: 'lista-capacidad-camiones',
    loadChildren: () => import('./pages/lista-capacidad-camiones/lista-capacidad-camiones.module').then( m => m.ListaCapacidadCamionesPageModule)
  },
  {
    path: 'guia-detalles',
    loadChildren: () => import('./pages/guia-detalles/guia-detalles.module').then( m => m.GuiaDetallesPageModule)
  },
  {
    path: 'lista-guias',
    loadChildren: () => import('./pages/lista-guias/lista-guias.module').then( m => m.ListaGuiasPageModule)
  },
  {
    path: 'lista-clientes-guias',
    loadChildren: () => import('./pages/lista-clientes-guias/lista-clientes-guias.module').then( m => m.ListaClientesGuiasPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
