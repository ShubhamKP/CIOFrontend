
import { Component, ElementRef, AfterViewInit, ViewChild, Input } from '@angular/core';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-webinar-subscriber',
  templateUrl: './webinar-subscriber.component.html',
  styleUrls: ['./webinar-subscriber.component.css']
})

export class WebinarSubscriberComponent implements AfterViewInit {
  @ViewChild('subscriberDiv') subscriberDiv: ElementRef;
  @Input() session: OT.Session;
  @Input() stream: OT.Stream;

  constructor() { }

  ngAfterViewInit() {
    const subscriber = this.session.subscribe(this.stream, this.subscriberDiv.nativeElement, (err) => {
      if (err) {
        alert(err.message);
      }
    });
  }
}
