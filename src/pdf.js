export const downloadPDF = (group) => {
			const {groupName, membersArr, expenses} = group;
			const { PDFDocument, StandardFonts, rgb} = PDFLib
			createPdf()
			async function createPdf() {
			  const pdfDoc = await PDFLib.PDFDocument.create();
			
			  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

			  const page = pdfDoc.addPage();
			  const { width, height } = page.getSize()

			  const fontSize = 30

			  page.drawText(`Expenses statistics for the "${groupName}" group`, {
				x: 50,
				y: height - 4 * fontSize,
				size: fontSize,
				font: timesRomanFont,
				color: rgb(.012, .376, .569),
			  })

			  const pdfBytes = await pdfDoc.save()

			  download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");
			}
}