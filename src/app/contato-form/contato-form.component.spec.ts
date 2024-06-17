import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContatoFormComponent } from './contato-form.component';
import { ContatoService } from '../services/contato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ContatoFormComponent', () => {
  let component: ContatoFormComponent;
  let fixture: ComponentFixture<ContatoFormComponent>;
  let mockContatoService: any;
  let mockRouter: any;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockContatoService = jasmine.createSpyObj(['getContatoById', 'getContatos', 'addContato', 'updateContato']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockActivatedRoute = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ContatoFormComponent],
      imports: [FormsModule],
      providers: [
        { provide: ContatoService, useValue: mockContatoService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContatoFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add valid email', () => {
    component.email = 'valid@example.com';
    component.addEmail();
    expect(component.contato.emails).toContain('valid@example.com');
    expect(component.email).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should not add invalid email', () => {
    component.email = 'invalid-email';
    component.addEmail();
    expect(component.contato.emails).not.toContain('invalid-email');
    expect(component.errorMessage).toBe('O e-mail inserido não é válido.');
  });

  it('should remove email', () => {
    component.contato.emails = ['test1@example.com', 'test2@example.com'];
    component.removeEmail(0);
    expect(component.contato.emails).not.toContain('test1@example.com');
  });

  it('should add valid telefone', () => {
    component.telefone = '12345678901';
    component.addTelefone();
    expect(component.contato.telefones).toContain('12345678901');
    expect(component.telefone).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should not add invalid telefone', () => {
    component.telefone = '12345';
    component.addTelefone();
    expect(component.contato.telefones).not.toContain('12345');
    expect(component.errorMessage).toBe('O número de telefone deve ter 11 dígitos.');
  });

  it('should remove telefone', () => {
    component.contato.telefones = ['12345678901', '09876543210'];
    component.removeTelefone(1);
    expect(component.contato.telefones).not.toContain('09876543210');
  });

  it('should validate valid email format', () => {
    expect(component.isEmailValid('test@example.com')).toBe(true);
    expect(component.isEmailValid('invalid-email')).toBe(false);
  });

  it('should validate only number key for telefone', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    const spy = spyOn(event, 'preventDefault');
    component.onlyNumberKey(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should save valid contato', () => {
    spyOn(component, 'isValid').and.returnValue(true);
    spyOn(component, 'removeTelefoneFormat').and.callThrough();
    mockContatoService.getContatos.and.returnValue([{ id: 1 }]);
    component.contato = { id: 0, nomeCompleto: 'John Doe', emails: ['john@example.com'], telefones: ['12345678901'] };
    component.saveContato();
    expect(mockContatoService.addContato).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/contatos']);
  });

  it('should not save invalid contato', () => {
    spyOn(component, 'isValid').and.returnValue(false);
    component.saveContato();
    expect(mockContatoService.addContato).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
