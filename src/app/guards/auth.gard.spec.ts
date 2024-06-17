import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should allow activation when user is authenticated', () => {
    localStorage.setItem('isAuthenticated', 'true');
    const route: any = {};
    const state: any = {};

    expect(authGuard.canActivate(route, state)).toBe(true);
  });

  it('should not allow activation and redirect to login when user is not authenticated', () => {
    localStorage.setItem('isAuthenticated', 'false');
    const route: any = {};
    const state: any = {};

    expect(authGuard.canActivate(route, state)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  afterEach(() => {
    localStorage.removeItem('isAuthenticated');
  });
});
