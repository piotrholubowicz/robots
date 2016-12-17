import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App }  from './app';
import { Board }  from './board';
import { Tile }  from './tile';
import { Piece }  from './piece';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ App, Board, Tile ],
  bootstrap:    [ App ]
})
export class AppModule { }
