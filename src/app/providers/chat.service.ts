import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interfaces/mensaje.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];

  public usuario: any = {};

  constructor(private afs: AngularFirestore,
              public auth: AngularFireAuth ) {
    this.auth.authState.subscribe( user => {
      console.log('Estado del usuario: ', user);

      if (!user) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5) );


    this.itemsCollection.valueChanges().forEach( (mensajes: Mensaje[]) => {
      console.log(mensajes);
      // this.chats = mensajes;

      this.chats = [];

      for ( let mensaje of mensajes ) {
        this.chats.unshift( mensaje );
      }

    });

    return this.itemsCollection.valueChanges()


  }

  agregarMensaje( texto: string ) {

    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    // Insertar mensaje a firebase
    return this.itemsCollection.add( mensaje );
  }

  login(proveedor: string) {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.usuario = {};
    this.auth.signOut();
  }
}
