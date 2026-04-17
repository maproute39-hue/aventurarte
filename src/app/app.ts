import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { CommonModule } from '@angular/common';
import { Footer } from './components/footer/footer';
import { Home } from './pages/home/home';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, Header,CommonModule, Footer,Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('aventurarte');
}
