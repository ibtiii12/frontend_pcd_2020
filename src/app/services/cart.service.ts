import { Injectable } from '@angular/core';
import { Caddy } from '../models/caddy';
import { AuthService } from './auth.service';
import { ItemProduct } from '../models/item';
import { Iproduit } from '../models/produit';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Before implemeting cart you should the see the backend and make an agreement how cart should be.
  public currentCaddyName:string="Caddy1";

  public listCaddies:Array<{num:number,name:string}>=[{num:1,name:'Caddy1'}];
  
  public caddies:Map<string,Caddy>=new Map();
  constructor(private authService:AuthService){
    if(this.authService.isAuthenticated()) {
      this.loadCaddyFromLocalStorage();
    }
    else{
      this.caddies[this.currentCaddyName]=new Caddy(this.currentCaddyName);
  }
 }

 public addProductToCaddy(id:number,name:string,price:number,quantity:number):void{
    let caddy=this.caddies[this.currentCaddyName];
    let item=caddy.items[id];
   if(item===undefined) {
     item=new ItemProduct();item.id=id;item.name=name;
     item.price=price;item.quantity=quantity;
     caddy.items[id]=item;
   }
   else{
     item.quantity+=quantity;
   }
 }
 public removeProduct(id:number):void{
   let caddy=this.caddies[this.currentCaddyName];
  delete caddy.items[id];
  this.saveCaddy();
 }
 public addProduct(product:Iproduit){
   this.addProductToCaddy(product.id,product.name,product.price,product.quantity)
   this.saveCaddy();
 }
 public loadCaddyFromLocalStorage(){
      let myCaddiesList=localStorage.getItem("ListCaddies_"+this.authService.userAuthen.username);
      this.listCaddies=myCaddiesList==undefined?[{num:1,name:'Caddy1'}]:JSON.parse(myCaddiesList);
      this.listCaddies.forEach(c=>{
        let cad=localStorage.getItem("myCaddy_"+this.authService.userAuthen.username+"_"+c.name);
        this.caddies[c.name]=cad==undefined?new Caddy(c.name):JSON.parse(cad);
      })
 }
 public getCaddy():Caddy{
   let caddy=this.caddies[this.currentCaddyName];
   return caddy;
 }

 saveCaddy() {
   let caddy=this.caddies[this.currentCaddyName];
   localStorage.setItem("myCaddy_"+this.authService.userAuthen.username+"_"+this.currentCaddyName,JSON.stringify(caddy));
 }

 getSize(){
   let caddy=this.caddies[this.currentCaddyName];
   return Object.keys(caddy.items).length;
 }

 emptyCaddy(){
   this.caddies=new Map();
   this.listCaddies=[];
 }

 getTotalCurrentCaddy() {
   let caddy=this.caddies[this.currentCaddyName];
   let total=0;
   for(let key in caddy.items ){
     total+=caddy.items[key].price*caddy.items[key].quantity;
   }
   return total;
 }

 addNewCaddy(c: { num: number; name: string }) {
   this.listCaddies.push(c);
   this.caddies[c.name]=new Caddy(c.name);
   localStorage.setItem("ListCaddies_"+this.authService.userAuthen.username,JSON.stringify(this.listCaddies));
 }

 setClient(client: Client) {
   this.getCaddy().client=client;
   this.saveCaddy();
 }
}

