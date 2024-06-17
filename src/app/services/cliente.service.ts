import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private storageKey = 'clientes';

  constructor() { }

  private loadClientes(): Cliente[] {
    const clientesJson = localStorage.getItem(this.storageKey);
    return clientesJson ? JSON.parse(clientesJson) : [];
  }

  private saveClientes(clientes: Cliente[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(clientes));
  }

  getClientes(): Cliente[] {
    return this.loadClientes();
  }

  getClienteById(id: number): Cliente | undefined {
    const clientes = this.loadClientes();
    return clientes.find(cliente => cliente.id === id);
  }

  addCliente(cliente: Cliente): void {
    const clientes = this.loadClientes();
    clientes.push(cliente);
    this.saveClientes(clientes);
  }

  updateCliente(updatedCliente: Cliente): void {
    let clientes = this.loadClientes();
    clientes = clientes.map(cliente => cliente.id === updatedCliente.id ? updatedCliente : cliente);
    this.saveClientes(clientes);
  }

  deleteCliente(id: number): void {
    let clientes = this.loadClientes();
    clientes = clientes.filter(cliente => cliente.id !== id);
    this.saveClientes(clientes);
  }

  gerarPdfTodosClientes(): void {
    const doc = new jsPDF();
    let finalY = 10;

    const clientes = this.getClientes();

    clientes.forEach((cliente, index) => {
      if (index !== 0 && finalY + 10 > doc.internal.pageSize.height) {
        doc.addPage();
        finalY = 10;
      }

      autoTable(doc, {
        head: [['Campo', 'Valor']],
        body: [
          ['Nome Completo', cliente.nomeCompleto],
          ['E-mails', cliente.emails.join(', ')],
          ['Telefones', this.getFormattedTelefones(cliente.telefones)],
          ['Data de Registro', this.formatDate(cliente.dataRegistro)],
          ...cliente.contatos.map(contato => [
            ['Nome Completo', contato.nomeCompleto],
            ['E-mails', contato.emails.join(', ')],
            ['Telefones', this.getFormattedTelefones(contato.telefones)]
          ]).reduce((a, b) => a.concat(b), [])
        ],
        startY: finalY + 10,
        margin: { top: 10 }
      });

      finalY = (doc as any).lastAutoTable.finalY;
    });

    doc.save('todos_clientes.pdf');
  }

  gerarPdf(cliente: Cliente): void {
    const doc = new jsPDF();
    doc.text('Cliente', 10, 10);
    const bodyData = [
      ['Nome Completo', cliente.nomeCompleto],
      ['E-mails', cliente.emails.join(', ')],
      ['Telefones', this.getFormattedTelefones(cliente.telefones)],
      ['Data de Registro', this.formatDate(cliente.dataRegistro)]
    ];

    cliente.contatos.forEach((contato, idx) => {
      bodyData.push([`Contato ${idx + 1}`, '']);
      bodyData.push(['Nome Completo', contato.nomeCompleto]);
      bodyData.push(['E-mails', contato.emails.join(', ')]);
      bodyData.push(['Telefones', this.getFormattedTelefones(contato.telefones)]);
    });

    (doc as any).autoTable({
      head: [['Campo', 'Valor']],
      body: bodyData,
    });
    doc.save(`cliente_${cliente.nomeCompleto}.pdf`);
  }

  gerarExcel(cliente: Cliente): void {
    const data: any[] = [
      ['Cliente', cliente.nomeCompleto],
      ['E-mails', cliente.emails.join(', ')],
      ['Telefones', this.getFormattedTelefones(cliente.telefones)],
      ['Data de Registro', this.formatDate(cliente.dataRegistro)]
    ];

    cliente.contatos.forEach((contato, idx) => {
      data.push([`Contato ${idx + 1}`, contato.nomeCompleto]);
      data.push(['E-mails', contato.emails.join(', ')]);
      data.push(['Telefones', this.getFormattedTelefones(contato.telefones)]);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Cliente': worksheet }, SheetNames: ['Cliente'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xls', type: 'array' });

    this.saveAsExcelFile(excelBuffer, `cliente_${cliente.nomeCompleto}`);
  }

  gerarExcelTodosClientes(): void {
    const data: any[] = [];

    this.getClientes().forEach((cliente) => {
      data.push(['Cliente', cliente.nomeCompleto]);
      data.push(['E-mails', cliente.emails.join(', ')]);
      data.push(['Telefones', this.getFormattedTelefones(cliente.telefones)]);
      data.push(['Data de Registro', this.formatDate(cliente.dataRegistro)]);

      cliente.contatos.forEach((contato, idx) => {
        data.push([`Contato ${idx + 1}`, contato.nomeCompleto]);
        data.push(['E-mails', contato.emails.join(', ')]);
        data.push(['Telefones', this.getFormattedTelefones(contato.telefones)]);
      });
      data.push([]);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Clientes': worksheet }, SheetNames: ['Clientes'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xls', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'todos_clientes');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
    saveAs(data, `${fileName}.xls`);
  }

  private getFormattedTelefones(telefones: string[]): string {
    return telefones.map(tel => `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 11)}`).join(', ');
  }

  private formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      return date;
    }
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
