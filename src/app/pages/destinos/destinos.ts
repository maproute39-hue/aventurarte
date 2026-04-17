import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Destination } from '../../models/destination.model';
import { RealtimeDestinationsService } from '../../services/destinations-realtime.service';

@Component({
  selector: 'app-destinos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destinos.html',
  styleUrl: './destinos.css',
})
export class Destinos implements OnInit, OnDestroy {
  destinations: Destination[] = [];
  isLoading = false;

  private subscriptions = new Subscription();

  constructor(
    public destinationsService: RealtimeDestinationsService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('[Destinos] ngOnInit iniciado');

    this.subscriptions.add(
      this.destinationsService.isLoading$.subscribe(loading => {
        console.log('[Destinos] loading:', loading);
        this.isLoading = loading;
      })
    );

    this.subscriptions.add(
      this.destinationsService.destinations$.subscribe(destinations => {
        console.log('[Destinos] destinos recibidos:', destinations);
        this.destinations = destinations || [];
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.destinationsService.errors$.subscribe(error => {
        console.error('[Destinos] error recibido desde servicio:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error cargando destinos',
          text: error?.message || 'No se pudieron cargar los destinos'
        });
      })
    );

    try {
      await this.destinationsService.loadDestinations('-created');
      await this.destinationsService.subscribeRealtime();
      console.log('[Destinos] carga inicial completada');
    } catch (error) {
      console.error('[Destinos] error en ngOnInit:', error);
    }
  }
getLocationText(destination: Destination): string {
  const parts = [destination.city, destination.region, destination.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Ubicación por confirmar';
}

getAnimationDelay(index: number): string {
  const delays = ['0.2', '0.4', '0.6'];
  return delays[index % delays.length];
}
trackByDestination(index: number, destination: Destination): string {
  return destination.id;
}
trackByDestinationId(index: number, destination: Destination): string {
  return destination.id;
}
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.destinationsService.unsubscribeAll();
  }
getMainImageUrl(destination: Destination): string {
  if (destination.mainImage) {
    return this.destinationsService.pb.files.getUrl(
      destination as any,
      destination.mainImage
    );
  }

  return 'assets/images/placeholder-destination.jpg';
}

  getDestinationImage(destination: any): string {
    if (destination?.mainImage) {
      return this.destinationsService.pb.files.getURL(destination, destination.mainImage);
    }

    if (destination?.gallery?.length) {
      return this.destinationsService.pb.files.getURL(destination, destination.gallery[0]);
    }

    return 'assets/img/default-destination.jpg';
  }
}