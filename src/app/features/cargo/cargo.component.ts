import { Component, OnInit } from '@angular/core';
import { CargoService } from '../../services/cargo.service';

@Component({
  selector: 'cargo',
  standalone: true,
  imports: [],
  templateUrl: './cargo.component.html',
  styleUrl: './cargo.component.css'
})
export class CargoComponent implements OnInit {

  constructor(private cargoService:CargoService){}

  ngOnInit(): void {
    
  }

  
}
