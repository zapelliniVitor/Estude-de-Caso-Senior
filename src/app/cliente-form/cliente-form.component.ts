import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { ContatoService } from '../services/contato.service';
import { Cliente } from '../models/cliente.model';
import { Contato } from '../models/contato.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  cliente: Cliente = { id: 0, nomeCompleto: '', emails: [], telefones: [], dataRegistro: '', contatos: [] };
  contato: Contato = { id: 0, nomeCompleto: '', emails: [], telefones: [] };
  contatos: Contato[] = [];
  email: string = '';
  telefone: string = '';
  errorMessage: string = '';

  constructor(
    private clienteService: ClienteService,
    private contatoService: ContatoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const hoje = new Date();
    this.cliente.dataRegistro = hoje.toISOString().split('T')[0];
    this.contatos = this.contatoService.getContatos();
    this.updateContatosDisponiveis();

    const clienteId = this.route.snapshot.queryParams['id'];
    if (clienteId) {
      const clienteExistente = this.clienteService.getClienteById(+clienteId);
      if (clienteExistente) {
        this.cliente = clienteExistente;
        this.cliente.telefones = this.cliente.telefones.map(tel => this.removeTelefoneFormat(tel));
        this.updateContatosDisponiveis();
      }
    }
  }

  addEmail(): void {
    if (this.isEmailValid(this.email)) {
      this.cliente.emails.push(this.email);
      this.email = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'O e-mail inserido não é válido.';
    }
  }

  removeEmail(index: number): void {
    this.cliente.emails.splice(index, 1);
  }

  addTelefone(): void {
    if (this.telefone.length === 11) {
      this.cliente.telefones.push(this.telefone);
      this.telefone = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'O número de telefone deve ter 11 dígitos.';
    }
  }

  removeTelefone(index: number): void {
    this.cliente.telefones.splice(index, 1);
  }

  addContato(): void {
    const contatoExistente = this.contatos.find(c => c.id === +this.contato.id);
    if (contatoExistente && !this.cliente.contatos.some(c => c.id === contatoExistente.id)) {
      this.cliente.contatos.push(contatoExistente);
      this.updateContatosDisponiveis();
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Este contato já foi adicionado ao cliente.';
    }
  }

  removeContato(index: number): void {
    this.cliente.contatos.splice(index, 1);
    this.updateContatosDisponiveis();
  }

  updateContatosDisponiveis(): void {
    this.contatos = this.contatoService.getContatos().filter(c => !this.cliente.contatos.some(cc => cc.id === c.id));
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  removeTelefoneFormat(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }

  isValid(): boolean {
    if (!this.cliente.nomeCompleto) {
      this.errorMessage = 'O nome completo é obrigatório.';
      return false;
    }

    if (this.cliente.emails.length === 0) {
      this.errorMessage = 'É necessário ter ao menos um e-mail.';
      return false;
    }

    if (this.cliente.telefones.length === 0) {
      this.errorMessage = 'É necessário ter ao menos um número de telefone.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  onlyNumberKey(event: KeyboardEvent): boolean {
    const char = event.key;
    if (!char.match(/[0-9]/)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  saveCliente(): void {
    if (!this.isValid()) {
      return;
    }
    this.cliente.telefones = this.cliente.telefones.map(tel => this.removeTelefoneFormat(tel));
    if (this.cliente.id === 0) {
      this.cliente.id = this.clienteService.getClientes().length + 1;
      this.clienteService.addCliente(this.cliente);
    } else {
      this.clienteService.updateCliente(this.cliente);
    }
    this.cliente = { id: 0, nomeCompleto: '', emails: [], telefones: [], dataRegistro: new Date().toISOString().split('T')[0], contatos: [] };
    this.router.navigate(['/clientes']);
  }
}
