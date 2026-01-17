/**
 * Print Service
 *
 * 提供列印功能
 * 支援整頁、元素、HTML 內容列印
 *
 * @example
 * ```typescript
 * // Print current page
 * this.printService.print();
 *
 * // Print element
 * this.printService.printElement('#report');
 *
 * // Print HTML content
 * this.printService.printHTML('<h1>Report</h1><p>Content...</p>');
 * ```
 */

import { Injectable } from '@angular/core';

export interface PrintOptions {
  title?: string;
  stylesheets?: string[];
  styles?: string;
  removeAfterPrint?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  /**
   * 列印當前頁面
   */
  print(): void {
    window.print();
  }

  /**
   * 列印指定元素
   *
   * @param selector - CSS 選擇器或 HTMLElement
   * @param options - 列印選項
   */
  printElement(
    selector: string | HTMLElement,
    options: PrintOptions = {}
  ): void {
    const element =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) {
      console.error(`Element not found: ${selector}`);
      return;
    }

    const html = element.innerHTML;
    this.printHTML(html, options);
  }

  /**
   * 列印 HTML 內容
   *
   * @param html - HTML 內容
   * @param options - 列印選項
   */
  printHTML(html: string, options: PrintOptions = {}): void {
    const {
      title = document.title,
      stylesheets = [],
      styles = '',
      removeAfterPrint = true,
    } = options;

    // Create print iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      console.error('Failed to access iframe document');
      return;
    }

    // Build print content
    let printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
    `;

    // Add stylesheets
    stylesheets.forEach((href) => {
      printContent += `<link rel="stylesheet" href="${href}">`;
    });

    // Add inline styles
    if (styles) {
      printContent += `<style>${styles}</style>`;
    }

    // Add print media query styles
    printContent += `
          <style>
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
              @page {
                margin: 1cm;
              }
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Write content to iframe
    iframeDoc.open();
    iframeDoc.write(printContent);
    iframeDoc.close();

    // Wait for content to load, then print
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Remove iframe after printing
      if (removeAfterPrint) {
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }
    };
  }

  /**
   * 列印圖片
   *
   * @param src - 圖片 URL
   * @param title - 標題
   */
  printImage(src: string, title: string = 'Image'): void {
    const html = `
      <div style="text-align: center;">
        <h2>${title}</h2>
        <img src="${src}" style="max-width: 100%; height: auto;" />
      </div>
    `;

    this.printHTML(html, { title });
  }

  /**
   * 列印表格
   *
   * @param selector - 表格選擇器或 HTMLTableElement
   * @param title - 標題
   * @param options - 列印選項
   */
  printTable(
    selector: string | HTMLTableElement,
    title?: string,
    options: PrintOptions = {}
  ): void {
    const table =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!table || !(table instanceof HTMLTableElement)) {
      console.error('Table element not found');
      return;
    }

    let html = '';
    if (title) {
      html += `<h2 style="text-align: center;">${title}</h2>`;
    }
    html += table.outerHTML;

    const tableStyles = `
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
    `;

    this.printHTML(html, {
      ...options,
      title: title || options.title,
      styles: tableStyles + (options.styles || ''),
    });
  }

  /**
   * 列印 PDF (透過 iframe)
   *
   * @param url - PDF URL
   */
  printPDF(url: string): void {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = url;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  }

  /**
   * 開啟列印預覽
   *
   * @param html - HTML 內容
   * @param options - 列印選項
   */
  openPrintPreview(html: string, options: PrintOptions = {}): void {
    this.printHTML(html, {
      ...options,
      removeAfterPrint: false, // Keep iframe for preview
    });
  }
}
