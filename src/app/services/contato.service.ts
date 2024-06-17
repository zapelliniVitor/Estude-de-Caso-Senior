import { Injectable } from '@angular/core';
import { Contato } from '../models/contato.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private storageKey = 'contatos';

  constructor() { }

  private loadContatos(): Contato[] {
    const contatosJson = localStorage.getItem(this.storageKey);
    return contatosJson ? JSON.parse(contatosJson) : [];
  }

  private saveContatos(contatos: Contato[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(contatos));
  }

  getContatos(): Contato[] {
    return this.loadContatos();
  }

  getContatoById(id: number): Contato | undefined {
    const contatos = this.loadContatos();
    return contatos.find(contato => contato.id === id);
  }

  addContato(contato: Contato): void {
    const contatos = this.loadContatos();
    contatos.push(contato);
    this.saveContatos(contatos);
  }

  updateContato(updatedContato: Contato): void {
    let contatos = this.loadContatos();
    contatos = contatos.map(contato => contato.id === updatedContato.id ? updatedContato : contato);
    this.saveContatos(contatos);
  }

  deleteContato(id: number): void {
    let contatos = this.loadContatos();
    contatos = contatos.filter(contato => contato.id !== id);
    this.saveContatos(contatos);
  }

  gerarPdf(contato: Contato): void {
    const doc = new jsPDF();
    doc.text('Contato', 10, 10);
    const bodyData = [
      ['Nome Completo', contato.nomeCompleto],
      ['E-mails', contato.emails.join(', ')],
      ['Telefones', this.getFormattedTelefones(contato.telefones)]
    ];

    (doc as any).autoTable({
      head: [['Campo', 'Valor']],
      body: bodyData,
    });
    doc.save(`contato_${contato.nomeCompleto}.pdf`);
  }

  gerarExcel(contato: Contato): void {
    const data: any[] = [
      ['Nome Completo', contato.nomeCompleto],
      ['E-mails', contato.emails.join(', ')],
      ['Telefones', this.getFormattedTelefones(contato.telefones)]
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Contato': worksheet }, SheetNames: ['Contato'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xls', type: 'array' });

    this.saveAsExcelFile(excelBuffer, `contato_${contato.nomeCompleto}`);
  }

  gerarPdfTodosContatos(): void {
    const doc = new jsPDF();
    let finalY = 10;

    const contatos = this.getContatos();

    contatos.forEach((contato, index) => {
      if (index !== 0 && finalY + 10 > doc.internal.pageSize.height) {
        doc.addPage();
        finalY = 10;
      }

      autoTable(doc, {
        head: [['Campo', 'Valor']],
        body: [
          ['Nome Completo', contato.nomeCompleto],
          ['E-mails', contato.emails.join(', ')],
          ['Telefones', this.getFormattedTelefones(contato.telefones)]
        ],
        startY: finalY + 10,
        margin: { top: 10 }
      });

      finalY = (doc as any).lastAutoTable.finalY;
    });

    doc.save('todos_contatos.pdf');
  }

  gerarExcelTodosContatos(): void {
    const data: any[] = [];

    const contatos = this.getContatos();

    contatos.forEach((contato) => {
      data.push(['Nome Completo', contato.nomeCompleto]);
      data.push(['E-mails', contato.emails.join(', ')]);
      data.push(['Telefones', this.getFormattedTelefones(contato.telefones)]);
      data.push([]);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Contatos': worksheet }, SheetNames: ['Contatos'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xls', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'todos_contatos');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
    saveAs(data, `${fileName}.xls`);
  }

  private getFormattedTelefones(telefones: string[]): string {
    return telefones.map(tel => `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 11)}`).join(', ');
  }
}
