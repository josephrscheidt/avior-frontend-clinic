import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hep',
  templateUrl: './hep.component.html',
  styleUrls: ['./hep.component.css']
})
export class HepComponent implements OnInit {

  constructor(private elem: ElementRef) { }

  ngOnInit() {
    // Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
  }

}
