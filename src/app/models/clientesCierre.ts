export class ClientesCierre{
    constructor(
       public idGuia: string,
        public idCliente: number,
        public nombre: string,
        public direccion: string,
        public fecha: string,
        public zona: string,
        public ruta: string,
        public idCamion: string,
        public chofer: string,
        public numClientes: number,
        public peso: number,
        public HH: string,
        public volumen: number,
        public checkin: any,
        public checkout: any,
        public estado: string,
        public orden_Visita: number,
        public latitud:number,
        public longitud: number,
        public latitud_check: number,
        public longitud_Check: number,
        public observaciones: string,
        public bultos: number,
        public Duracion: number,
        public distancia: number,
        public estado_guia: string


    ){}
}
