import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxJsFormComponent } from './rx-js-form.component';

describe('RxJsFormComponent', () => {
  let component: RxJsFormComponent;
  let fixture: ComponentFixture<RxJsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxJsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxJsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
