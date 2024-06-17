import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContatoListaComponent } from './contato-lista.component';
import { ContatoService } from '../services/contato.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Contato } from '../models/contato.model';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

describe('ContatoListaComponent', () => {
  let component: ContatoListaComponent;
  let fixture: ComponentFixture<ContatoListaComponent>;
  let mockContatoService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockContatoService = jasmine.createSpyObj(['getContatos', 'deleteContato', 'gerarExcel', 'gerarPdf', 'gerarExcelTodosContatos', 'gerarPdfTodosContatos']);
    mockRouter = jasmine.createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ContatoListaComponent],
      imports: [FormsModule, NgxPaginationModule],
      providers: [
        { provide: ContatoService, useValue: mockContatoService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContatoListaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contatos on init', () => {
    const contatos: Contato[] = [{ id: 1, nomeCompleto: 'Teste', emails: ['teste@teste.com'], telefones: ['12345678901'] }];
    mockContatoService.getContatos.and.returnValue(contatos);

    component.ngOnInit();

    expect(component.contatos).toEqual(contatos);
  });

  it('should navigate to edit contato', () => {
    component.editarContato(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/adicionar-contato'], { queryParams: { id: 1 } });
  });

  it('should delete contato and refresh list', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const contatos: Contato[] = [{ id: 1, nomeCompleto: 'Teste', emails: ['teste@teste.com'], telefones: ['12345678901'] }];
    mockContatoService.getContatos.and.returnValue(contatos);

    component.excluirContato(1);

    expect(mockContatoService.deleteContato).toHaveBeenCalledWith(1);
    expect(mockContatoService.getContatos).toHaveBeenCalled();
    expect(component.contatos).toEqual(contatos);
  });

  it('should not delete contato if confirm is canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.excluirContato(1);

    expect(mockContatoService.deleteContato).not.toHaveBeenCalled();
    expect(mockContatoService.getContatos).not.toHaveBeenCalled();
  });

  it('should format telefone correctly', () => {
    const formatted = component.formatTelefone('12345678901');
    expect(formatted).toBe('(12) 3 4567-8901');
  });

  it('should not format invalid telefone', () => {
    const formatted = component.formatTelefone('123');
    expect(formatted).toBe('123');
  });

  it('should format a list of telefones correctly', () => {
    const formatted = component.getFormattedTelefones(['12345678901', '09876543210']);
    expect(formatted).toBe('(12) 3 4567-8901, (09) 8 7654-3210');
  });

  it('should call gerarExcel on service', () => {
    const contato: Contato = { id: 1, nomeCompleto: 'Teste', emails: ['teste@teste.com'], telefones: ['12345678901'] };

    component.gerarExcel(contato);

    expect(mockContatoService.gerarExcel).toHaveBeenCalledWith(contato);
  });

  it('should call gerarPdf on service', () => {
    const contato: Contato = { id: 1, nomeCompleto: 'Teste', emails: ['teste@teste.com'], telefones: ['12345678901'] };

    component.gerarPdf(contato);

    expect(mockContatoService.gerarPdf).toHaveBeenCalledWith(contato);
  });

  it('should call gerarExcelTodosContatos on service', () => {
    component.gerarExcelTodosContatos();

    expect(mockContatoService.gerarExcelTodosContatos).toHaveBeenCalled();
  });

  it('should call gerarPdfTodosContatos on service', () => {
    component.gerarPdfTodosContatos();

    expect(mockContatoService.gerarPdfTodosContatos).toHaveBeenCalled();
  });
});

