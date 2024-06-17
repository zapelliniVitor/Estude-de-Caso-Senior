import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../services/contato.service';
import { Contato } from '../models/contato.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contato-lista',
  templateUrl: './contato-lista.component.html',
  styleUrls: ['./contato-lista.component.css']
})
export class ContatoListaComponent implements OnInit {
  contatos: Contato[] = [];
  page: number = 1;
  itemsPerPage: number = 3;

  constructor(private contatoService: ContatoService, private router: Router) { }

  ngOnInit(): void {
    this.contatos = this.contatoService.getContatos();
  }

  editarContato(contatoId: number): void {
    this.router.navigate(['/adicionar-contato'], { queryParams: { id: contatoId } });
  }

  excluirContato(contatoId: number): void {
    if (confirm('Você tem certeza que deseja excluir este contato?')) {
      this.contatoService.deleteContato(contatoId);
      this.contatos = this.contatoService.getContatos();
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

  gerarExcel(contato: Contato): void {
    this.contatoService.gerarExcel(contato);
  }

  gerarPdf(contato: Contato): void {
    this.contatoService.gerarPdf(contato);
  }

  gerarExcelTodosContatos(): void {
    this.contatoService.gerarExcelTodosContatos();
  }

  gerarPdfTodosContatos(): void {
    this.contatoService.gerarPdfTodosContatos();
  }
}
