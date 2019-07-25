import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';
import {concatMap, debounceTime, distinctUntilChanged, map, mergeMap, pluck} from 'rxjs/operators';

const emailRegExp = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/;
const errors = {
  email: 'Wrong mail format',
  password: 'Too short password',
  confirm: 'Password do not match'
};

@Component({
  selector: 'app-rx-js-form',
  templateUrl: './rx-js-form.component.html',
  styleUrls: ['./rx-js-form.component.css']
})
export class RxJsFormComponent implements AfterViewInit {

  @ViewChild('email', {static: false}) email: ElementRef;
  @ViewChild('password', {static: false}) password: ElementRef;
  @ViewChild('confirmPas', {static: false}) confirmPas: ElementRef;
  @ViewChild('btn', {static: false}) submitBtn: ElementRef;
  @ViewChild('error', {static: false}) errorBlock: ElementRef;

  isDisabled = true;

  constructor() {}

  ngAfterViewInit(): void {
    fromEvent(this.email.nativeElement, 'blur')
      .pipe(
        pluck('target', 'value'),
        map((email: string) => {
          return this.checkEmail(email);
        }),
        mergeMap((email: string) => {
          return fromEvent(this.password.nativeElement, 'blur')
            .pipe(
              pluck('target', 'value'),
              map((password: string) => {
                return this.checkPassword(password);
              }),
              mergeMap((password: string) => {
                return fromEvent(this.confirmPas.nativeElement, 'blur')
                  .pipe(
                    pluck('target', 'value'),
                    map((confirmPas: string) => {
                      return this.matchPassword(password, confirmPas);
                    }),
                    mergeMap((confirmPas: string) => {
                      return fromEvent(this.submitBtn.nativeElement, 'click')
                        .pipe(
                          map(() => this.formattingMessage(email, password, confirmPas))
                        );
                    })
                  );
              })
            );
        })
      ).subscribe(
      result => alert(result),
      error => this.errorBlock.nativeElement.innerHTML = error
    );
  }

  private formattingMessage(email: string, password: string, confirmPas: string): string {
    return `
    email: ${email}
    password: ${password}
    confirm password: ${confirmPas}
    `;
  }

  private checkEmail(email: string) {
    if (email && emailRegExp.test(email)) {
      return email;
    } else {
      throw new Error (errors.email);
    }
  }

  private checkPassword(password: string): string | void {
    if (password && password.length > 4) {
      this.errorBlock.nativeElement.innerHTML = '';
      return password;
    } else {
      throw new Error (errors.password);
    }
  }

  private matchPassword(password: string, confirmPas: string): string | void {
    if (password === confirmPas) {
      this.errorBlock.nativeElement.innerHTML = '';
      this.isDisabled = false;
      return confirmPas;
    } else {
      throw new Error (errors.confirm);
    }
  }

}
