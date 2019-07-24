import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, mergeMap, pluck} from 'rxjs/operators';

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

  ngAfterViewInit() {
    fromEvent(this.email.nativeElement, 'blur')
      .pipe(
        pluck('target', 'value'),
        map((email: string) => this.checkEmail(email)),
        mergeMap((email: string) => {
          return fromEvent(this.password.nativeElement, 'blur')
            .pipe(
              pluck('target', 'value'),
              map((password: string) => this.checkPassword(password)),
              mergeMap((password: string) => {
                return fromEvent(this.confirmPas.nativeElement, 'keyup')
                  .pipe(
                    pluck('target', 'value'),
                    debounceTime(1000),
                    distinctUntilChanged(),
                    map((confirmPas: string) => this.matchPassword(password, confirmPas)),
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
      ).subscribe(res => {
      if (!res.includes('undefined')) {
        alert(res);
      }
    });
  }

  private checkEmail(email: string): string | void {
    if (email && emailRegExp.test(email)) {
      this.errorBlock.nativeElement.innerHTML = '';
      return email;
    } else {
      this.showMessage(errors.email);
    }
  }

  private checkPassword(password: string): string | void {
    if (password && password.length > 4) {
      this.errorBlock.nativeElement.innerHTML = '';
      return password;
    } else {
      this.showMessage(errors.password);
    }
  }

  private matchPassword(password: string, confirmPas: string): string | void {
    if (password === confirmPas) {
      this.errorBlock.nativeElement.innerHTML = '';
      this.isDisabled = false;
      return confirmPas;
    }
    if (password) this.showMessage(errors.confirm);
  }

  private formattingMessage(email: string, password: string, confirmPas: string): string {
    return `
    email: ${email}
    password: ${password}
    confirm password: ${confirmPas}
    `;
  }

  private showMessage(message: string): void {
    this.errorBlock.nativeElement.innerHTML = message;
  }

}
