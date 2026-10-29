import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../compartilhado/navbar/navbar';

@Component({
  selector: 'app-principal',
  imports: [RouterOutlet, Navbar],
  templateUrl: './principal.html',
  styleUrl: './principal.scss',
})
export class Principal {}
