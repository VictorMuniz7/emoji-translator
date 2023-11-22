import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-translator',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './translator.component.html',
  styleUrl: './translator.component.scss'
})
export class TranslatorComponent {


  emojis: string = ''
  exists: boolean = false

  input: string = ''
  output: string = ''

  emptyError: boolean = false
  unchangedError: boolean = false

  http = inject(HttpClient)

  translate(value: string){
    if(value === ''){
      this.emptyError = true
    }
    this.input = value
    let splittedValue = value.split(/[,\s]+/)
    this.output = '';

    const observables = splittedValue
      .filter(element => element !== '')
      .map(element =>
        this.http.get(`https://emoji-api.com/emojis?search=${element}&access_key=${environment.apiKey}`)
      );

    forkJoin(observables).subscribe((data: any[]) => {
      this.output = data.map((res, index) => (res.length > 0 ? res[Math.floor(Math.random() * data[0].length)].character : splittedValue[index])).join('');
      }
    );
  }

  randomEmoji(){

  }

}
