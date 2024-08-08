import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ClientFooterComponent } from '../client-footer/client-footer.component';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,CommonModule,ClientFooterComponent],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css'
})
export class ClientHomeComponent {

}
