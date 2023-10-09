import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  Subject,
  delay,
  map,
  merge,
  share,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  first$: Observable<number> = new Observable<number>();
  second$: Observable<number> = new Observable<number>();
  third$: Observable<number> = new Observable<number>();

  update$: Subject<void> = new Subject<void>();

  constructor(private readonly _http: HttpClient) {
    const data = merge(
      this.update$.pipe(
        switchMap(() => {
          return this._getData();
        }),
        share()
      )
    );

    this.first$ = data.pipe(delay(500));
    this.second$ = data.pipe(delay(1000));
    this.third$ = data.pipe(delay(1500));
  }

  update() {
    this.update$.next();
  }

  private _getData(): Observable<number> {
    return this._http
      .get('https://api.rand.by/v1/integer?count=1')
      .pipe(map((value: any) => value.items[0]));
  }
}
