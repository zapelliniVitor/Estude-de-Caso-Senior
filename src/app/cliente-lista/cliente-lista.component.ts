import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements OnInit {
  clientes: Cliente[] = [];
  page: number = 1;
  itemsPerPage: number = 3;

  constructor(private clienteService: ClienteService, private router: Router) { }

  ngOnInit(): void {
    this.clientes = this.clienteService.getClientes();
  }

  editarCliente(clienteId: number): void {
    this.router.navigate(['/adicionar-cliente'], { queryParams: { id: clienteId } });
  }

  excluirCliente(clienteId: number): void {
    if (confirm('Você tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCliente(clienteId);
      this.clientes = this.clienteService.getClientes();
    }
  }

  formatTelefone(telefone: string): string {
    const cleaned = ('' + telefone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
    }
    return telefone;
  }

  getFormattedTelefones(telefones: string[]): string {
    return telefones.map(tel => this.formatTelefone(tel)).join(', ');
  }

  gerarExcel(cliente: Cliente): void {
    this.clienteService.gerarExcel(cliente);
  }

  gerarPdf(cliente: Cliente): void {
    this.clienteService.gerarPdf(cliente);
  }

  gerarExcelTodosClientes(): void {
    this.clienteService.gerarExcelTodosClientes();
  }

  gerarPdfTodosClientes(): void {
    this.clienteService.gerarPdfTodosClientes();
  }
}
