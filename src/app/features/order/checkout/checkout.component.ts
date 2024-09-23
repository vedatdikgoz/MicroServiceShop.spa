import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // 3 saniye sonra anasayfaya yönlendirme
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }
}