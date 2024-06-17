import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../services/contato.service';
import { Contato } from '../models/contato.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contato-form',
  templateUrl: './contato-form.component.html',
  styleUrls: ['./contato-form.component.css']
})
export class ContatoFormComponent implements OnInit {
  contato: Contato = { id: 0, nomeCompleto: '', emails: [], telefones: [] };
  email: string = '';
  telefone: string = '';
  errorMessage: string = '';

  constructor(
    private contatoService: ContatoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const contatoId = this.route.snapshot.queryParams['id'];
    if (contatoId) {
      const contatoExistente = this.contatoService.getContatoById(+contatoId);
      if (contatoExistente) {
        this.contato = contatoExistente;
        this.contato.telefones = this.contato.telefones.map(tel => this.removeTelefoneFormat(tel));
      }
    }
  }

  addEmail(): void {
    if (this.isEmailValid(this.email)) {
      this.contato.emails.push(this.email);
      this.email = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'O e-mail inserido não é válido.';
    }
  }

  removeEmail(index: number): void {
    this.contato.emails.splice(index, 1);
  }

  addTelefone(): void {
    if (this.telefone.length === 11) {
      this.contato.telefones.push(this.telefone);
      this.telefone = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'O número de telefone deve ter 11 dígitos.';
    }
  }

  removeTelefone(index: number): void {
    this.contato.telefones.splice(index, 1);
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  removeTelefoneFormat(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }

  isValid(): boolean {
    if (!this.contato.nomeCompleto) {
      this.errorMessage = 'O nome completo é obrigatório.';
      return false;
    }

    if (this.contato.emails.length === 0) {
      this.errorMessage = 'É necessário ter ao menos um e-mail.';
      return false;
    }

    if (this.contato.telefones.length === 0) {
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

  saveContato(): void {
    if (!this.isValid()) {
      return;
    }
    this.contato.telefones = this.contato.telefones.map(tel => this.removeTelefoneFormat(tel));
    if (this.contato.id === 0) {
      this.contato.id = this.contatoService.getContatos().length + 1;
      this.contatoService.addContato(this.contato);
    } else {
      this.contatoService.updateContato(this.contato);
    }
    this.contato = { id: 0, nomeCompleto: '', emails: [], telefones: [] };
    this.router.navigate(['/contatos']);
  }
}
