import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';

import { AlarmEvents } from './alarm-events';

describe('AlarmEvents', () => {
  let component: AlarmEvents;
  let fixture: ComponentFixture<AlarmEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmEvents],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
