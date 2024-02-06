import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { PortionNameService } from './services/portionName.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dietkownik';

  constructor(private portionNameService: PortionNameService){}
  
  ngOnInit(): void {
    const interval$ = interval(60000);
    
    // Subscribe to the interval
    interval$.subscribe(() => {
      // Perform your background process here
      this.portionNameService.getPortionNamesMONGO().subscribe((data) => {
        let x = data;
        console.log("xxx")
      })
    });
  }
}
