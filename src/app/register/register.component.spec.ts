import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ FormsModule ],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if username is empty', () => {
    component.username = '';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.register();
    fixture.detectChanges();

    expect(component.usernameError).toBeTrue();
    expect(component.generalError).toBe('Por favor, preencha todos os campos.');
  });

  it('should show error if password is empty', () => {
    component.username = 'username';
    component.password = '';
    component.confirmPassword = 'password';
    component.register();
    fixture.detectChanges();

    expect(component.passwordError).toBeTrue();
    expect(component.generalError).toBe('Por favor, preencha todos os campos.');
  });

  it('should show error if confirmPassword is empty', () => {
    component.username = 'username';
    component.password = 'password';
    component.confirmPassword = '';
    component.register();
    fixture.detectChanges();

    expect(component.confirmPasswordError).toBeTrue();
    expect(component.generalError).toBe('Por favor, preencha todos os campos.');
  });

  it('should show error if passwords do not match', () => {
    component.username = 'username';
    component.password = 'password';
    component.confirmPassword = 'differentpassword';
    component.register();
    fixture.detectChanges();

    expect(component.generalError).toBe('As senhas não coincidem.');
  });

  it('should show error if username already exists', () => {
    localStorage.setItem('users', JSON.stringify([{ username: 'username', password: 'password' }]));
    component.username = 'username';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.register();
    fixture.detectChanges();

    expect(component.generalError).toBe('Nome de usuário já existe.');
  });

  it('should navigate to login on successful registration', () => {
    localStorage.setItem('users', JSON.stringify([]));
    component.username = 'newuser';
    component.password = 'password';
    component.confirmPassword = 'password';
    component.register();
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to login on goToLogin call', () => {
    component.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
