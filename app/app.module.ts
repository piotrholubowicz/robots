import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Game }  from './game';
import { Board }  from './board';
import { Tile }  from './tile';
import { Piece }  from './piece';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ Game, Board, Tile ],
  bootstrap:    [ Game ]
})
export class AppModule { }
