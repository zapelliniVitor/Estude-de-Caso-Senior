import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteFormComponent } from './cliente-form.component';
import { ClienteService } from '../services/cliente.service';
import { ContatoService } from '../services/contato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('ClienteFormComponent', () => {
  let component: ClienteFormComponent;
  let fixture: ComponentFixture<ClienteFormComponent>;

  let mockClienteService: any;
  let mockContatoService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockClienteService = {
      getClientes: jasmine.createSpy('getClientes').and.returnValue([]),
      getClienteById: jasmine.createSpy('getClienteById').and.returnValue(undefined),
      addCliente: jasmine.createSpy('addCliente'),
      updateCliente: jasmine.createSpy('updateCliente')
    };

    mockContatoService = {
      getContatos: jasmine.createSpy('getContatos').and.returnValue([])
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [ClienteFormComponent],
      imports: [FormsModule],
      providers: [
        { provide: ClienteService, useValue: mockClienteService },
        { provide: ContatoService, useValue: mockContatoService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } }
        }
      ]
    });

    fixture = TestBed.createComponent(ClienteFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add email', () => {
    component.email = 'test@example.com';
    component.addEmail();
    expect(component.cliente.emails).toContain('test@example.com');
  });

  it('should not add invalid email', () => {
    component.email = 'invalid-email';
    component.addEmail();
    expect(component.cliente.emails).not.toContain('invalid-email');
    expect(component.errorMessage).toBe('O e-mail inserido não é válido.');
  });

  it('should add telefone', () => {
    component.telefone = '12345678901';
    component.addTelefone();
    expect(component.cliente.telefones).toContain('12345678901');
  });

  it('should not add invalid telefone', () => {
    component.telefone = '123';
    component.addTelefone();
    expect(component.cliente.telefones).not.toContain('123');
    expect(component.errorMessage).toBe('O número de telefone deve ter 11 dígitos.');
  });

  it('should add contato', () => {
    const mockContato = { id: 1, nomeCompleto: 'Teste Contato', emails: [], telefones: [] };
    mockContatoService.getContatos.and.returnValue([mockContato]);
    component.ngOnInit();
    component.contato.id = 1;
    component.addContato();
    expect(component.cliente.contatos).toContain(mockContato);
  });

  it('should not add existing contato', () => {
    const mockContato = { id: 1, nomeCompleto: 'Teste Contato', emails: [], telefones: [] };
    mockContatoService.getContatos.and.returnValue([mockContato]);
    component.ngOnInit();
    component.cliente.contatos.push(mockContato);
    component.contato.id = 1;
    component.addContato();
    expect(component.errorMessage).toBe('Este contato já foi adicionado ao cliente.');
  });

  it('should validate cliente form', () => {
    expect(component.isValid()).toBeFalse();
    component.cliente.nomeCompleto = 'Nome Teste';
    expect(component.isValid()).toBeFalse();
    component.cliente.emails.push('test@example.com');
    expect(component.isValid()).toBeFalse();
    component.cliente.telefones.push('12345678901');
    expect(component.isValid()).toBeTrue();
  });

  it('should save new cliente', () => {
    component.cliente = { id: 0, nomeCompleto: 'Nome Teste', emails: ['test@example.com'], telefones: ['12345678901'], dataRegistro: '2023-06-01', contatos: [] };

    component.saveCliente();

    expect(mockClienteService.addCliente).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/clientes']);
  });

  it('should update existing cliente', () => {
    component.cliente = { id: 1, nomeCompleto: 'Nome Teste', emails: ['test@example.com'], telefones: ['12345678901'], dataRegistro: '2023-06-01', contatos: [] };

    component.saveCliente();

    expect(mockClienteService.updateCliente).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/clientes']);
  });
});
