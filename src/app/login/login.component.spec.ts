import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to register page when goToRegister is called', () => {
    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should authenticate and navigate to clientes when valid credentials are provided', () => {
    const users = [{ username: 'teste123', password: 'teste123' }];
    localStorage.setItem('users', JSON.stringify(users));

    component.username = 'teste123';
    component.password = 'teste123';
    component.login();

    expect(localStorage.getItem('isAuthenticated')).toBe('true');
    expect(router.navigate).toHaveBeenCalledWith(['/clientes']);
  });

  it('should display error message when invalid credentials are provided', () => {
    component.username = 'wrongUser';
    component.password = 'wrongPassword';
    component.login();

    expect(component.errorMessage).toBe('Nome de usuário ou senha incorretos.');
    expect(localStorage.getItem('isAuthenticated')).toBeNull();
  });

  afterEach(() => {
    localStorage.removeItem('users');
    localStorage.removeItem('isAuthenticated');
  });
});
