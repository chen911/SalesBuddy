import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';

@IonicPage({
  name: 'event-create'
})
@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {

  constructor(public navCtrl: NavController, public eventProvider: EventProvider) {}

  createEvent(eventName: string, eventDate: string, eventPrice: number, eventCost: number) {
    this.eventProvider.createEvent(eventName, eventDate, eventPrice, eventCost)
    .then( newEvent => {
      this.navCtrl.pop();
    });
  }
}