import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteListaComponent } from './cliente-lista.component';
import { ClienteService } from '../services/cliente.service';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import { Cliente } from '../models/cliente.model';

describe('ClienteListaComponent', () => {
  let component: ClienteListaComponent;
  let fixture: ComponentFixture<ClienteListaComponent>;
  let mockClienteService: jasmine.SpyObj<ClienteService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const clienteServiceSpy = jasmine.createSpyObj('ClienteService', [
      'getClientes',
      'deleteCliente',
      'gerarExcel',
      'gerarPdf',
      'gerarExcelTodosClientes',
      'gerarPdfTodosClientes'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ClienteListaComponent],
      imports: [NgxPaginationModule],
      providers: [
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteListaComponent);
    component = fixture.componentInstance;
    mockClienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockClienteService.getClientes.and.returnValue([
      { id: 1, nomeCompleto: 'Cliente 1', emails: ['cliente1@example.com'], telefones: ['12345678901'], dataRegistro: '2024-06-17', contatos: [] },
      { id: 2, nomeCompleto: 'Cliente 2', emails: ['cliente2@example.com'], telefones: ['12345678902'], dataRegistro: '2024-06-17', contatos: [] },
      { id: 3, nomeCompleto: 'Cliente 3', emails: ['cliente3@example.com'], telefones: ['12345678903'], dataRegistro: '2024-06-17', contatos: [] }
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize clientes on ngOnInit', () => {
    component.ngOnInit();
    expect(mockClienteService.getClientes).toHaveBeenCalled();
    expect(component.clientes.length).toBe(3);
  });

  it('should navigate to edit cliente on editarCliente', () => {
    const clienteId = 1;
    component.editarCliente(clienteId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/adicionar-cliente'], { queryParams: { id: clienteId } });
  });

  it('should call deleteCliente and refresh clientes on excluirCliente', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const clienteId = 1;
    component.excluirCliente(clienteId);
    expect(mockClienteService.deleteCliente).toHaveBeenCalledWith(clienteId);
    expect(mockClienteService.getClientes).toHaveBeenCalled();
  });

  it('should format telefone correctly', () => {
    const formatted = component.formatTelefone('12345678901');
    expect(formatted).toBe('(12) 3 4567-8901');
  });

  it('should return formatted telefones string', () => {
    const formatted = component.getFormattedTelefones(['12345678901', '12345678902']);
    expect(formatted).toBe('(12) 3 4567-8901, (12) 3 4567-8902');
  });

  it('should call gerarExcel on gerarExcel', () => {
    const cliente: Cliente = { id: 1, nomeCompleto: 'Cliente 1', emails: ['cliente1@example.com'], telefones: ['12345678901'], dataRegistro: '2024-06-17', contatos: [] };
    component.gerarExcel(cliente);
    expect(mockClienteService.gerarExcel).toHaveBeenCalledWith(cliente);
  });

  it('should call gerarPdf on gerarPdf', () => {
    const cliente: Cliente = { id: 1, nomeCompleto: 'Cliente 1', emails: ['cliente1@example.com'], telefones: ['12345678901'], dataRegistro: '2024-06-17', contatos: [] };
    component.gerarPdf(cliente);
    expect(mockClienteService.gerarPdf).toHaveBeenCalledWith(cliente);
  });

  it('should call gerarExcelTodosClientes on gerarExcelTodosClientes', () => {
    component.gerarExcelTodosClientes();
    expect(mockClienteService.gerarExcelTodosClientes).toHaveBeenCalled();
  });

  it('should call gerarPdfTodosClientes on gerarPdfTodosClientes', () => {
    component.gerarPdfTodosClientes();
    expect(mockClienteService.gerarPdfTodosClientes).toHaveBeenCalled();
  });
});
