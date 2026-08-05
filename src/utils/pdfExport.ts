import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Helper to remove or replace unsupported CSS color functions (oklab, oklch, color-mix)
 * that cause html2canvas parser to fail in Tailwind v4 environments.
 */
function removeUnsupportedColors(cssText: string): string {
  if (!cssText) return '';
  return cssText
    .replace(/oklab\([^\)]*\)/gi, 'rgb(212, 160, 89)')
    .replace(/oklch\([^\)]*\)/gi, 'rgb(212, 160, 89)')
    .replace(/color-mix\([^\)]*\)/gi, 'rgb(212, 160, 89)')
    .replace(/oklab/gi, 'rgb')
    .replace(/oklch/gi, 'rgb');
}

/**
 * Exports a target DOM element to a high-resolution PDF download.
 */
export async function exportElementToPDF(
  element: HTMLElement,
  filename: string = 'Certificate.pdf'
): Promise<boolean> {
  try {
    // Hide actions or elements marked with .no-print during capture
    const hideElements = element.querySelectorAll<HTMLElement>('.no-print');
    const previousDisplays: string[] = [];
    hideElements.forEach(el => {
      previousDisplays.push(el.style.display);
      el.style.display = 'none';
    });

    // Render to high-DPI canvas with onclone hook to sanitize styles
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFDF8',
      logging: false,
      onclone: (clonedDoc, clonedElement) => {
        // 1. Sanitize all <style> tags in the cloned document
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach(style => {
          if (style.textContent) {
            style.textContent = removeUnsupportedColors(style.textContent);
          }
        });

        // 2. Walk original element tree and copy computed RGB values onto cloned elements
        const origList = [element, ...Array.from(element.querySelectorAll<HTMLElement>('*'))];
        const cloneList = [clonedElement, ...Array.from(clonedElement.querySelectorAll<HTMLElement>('*'))];

        origList.forEach((origEl, i) => {
          const cloneEl = cloneList[i];
          if (!cloneEl) return;

          try {
            const computed = window.getComputedStyle(origEl);
            if (computed.color && !computed.color.includes('oklab') && !computed.color.includes('oklch')) {
              cloneEl.style.color = computed.color;
            }
            if (computed.backgroundColor && !computed.backgroundColor.includes('oklab') && !computed.backgroundColor.includes('oklch')) {
              cloneEl.style.backgroundColor = computed.backgroundColor;
            }
            if (computed.borderColor && !computed.borderColor.includes('oklab') && !computed.borderColor.includes('oklch')) {
              cloneEl.style.borderColor = computed.borderColor;
            }
            if (computed.boxShadow && !computed.boxShadow.includes('oklab') && !computed.boxShadow.includes('oklch')) {
              cloneEl.style.boxShadow = computed.boxShadow;
            }
          } catch (e) {
            // ignore element style copy issues
          }

          // Sanitize inline style attribute if present
          const inlineStyle = cloneEl.getAttribute('style');
          if (inlineStyle && (inlineStyle.includes('oklab') || inlineStyle.includes('oklch'))) {
            cloneEl.setAttribute('style', removeUnsupportedColors(inlineStyle));
          }
        });
      },
    });

    // Restore hidden elements
    hideElements.forEach((el, i) => {
      el.style.display = previousDisplays[i] || '';
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Standard A4 dimensions in mm
    const orientation = imgWidth >= imgHeight ? 'landscape' : 'portrait';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Scale image proportionally within margins
    const margin = 10; // 10mm margins
    const availWidth = pdfWidth - margin * 2;
    const availHeight = pdfHeight - margin * 2;

    const ratio = Math.min(availWidth / (imgWidth / 2.5), availHeight / (imgHeight / 2.5));
    const renderWidth = (imgWidth / 2.5) * ratio;
    const renderHeight = (imgHeight / 2.5) * ratio;

    const x = (pdfWidth - renderWidth) / 2;
    const y = (pdfHeight - renderHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

/**
 * Print a DOM element in a clean print container or print window
 */
export function printElement(element: HTMLElement) {
  const printWindow = window.open('', '_blank');
  
  // Clone element & strip action buttons
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.no-print').forEach(el => el.remove());

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(s => s.outerHTML)
    .join('');

  if (!printWindow) {
    // Fallback: print current window
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Official Certificate - Abel Begena School</title>
        ${styles}
        <style>
          body { margin: 0; padding: 24px; background: #ffffff; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: sans-serif; }
          @media print {
            body { padding: 0; }
            @page { size: A4 landscape; margin: 8mm; }
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; max-width: 900px;">
          ${clone.outerHTML}
        </div>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            setTimeout(function() { window.close(); }, 800);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
