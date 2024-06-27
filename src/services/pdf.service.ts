import fs from "fs";
import path from "path";
import * as cloudinary from "cloudinary";
var pdfcrowd = require("pdfcrowd");

export interface Product {
  name: string;
  price: number;
}

var client = new pdfcrowd.HtmlToPdfClient(
  process.env.PDF_USER,
  process.env.PDF_API
);

export async function generatePdf(
  costoTotal: number,
  nombreUsuario: string,
  productos: Product[]
): Promise<string> {
  try {
    const cssFilePath = path.join(__dirname, "pdf.styles.css");
    const cssContent = fs.readFileSync(cssFilePath, "utf8");

    // Cargar el contenido HTML con los estilos CSS
    const contentHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        ${cssContent}
    </style>
    <body>
        <div class="basic box">
            <h2 class="title">Cotización</h2>
            <div class="view">
                <div class="icon">
                    <img src="https://i.postimg.cc/2jcfMcf4/hot-air-balloon.png" alt="hot-air-balloon">
                </div>
                <div class="cost">
                    <p class="amount">Bs${costoTotal.toFixed(2)}</p>
                </div>
            </div>
            <div class="description">
                <ul>
                    ${productos
                      .map(
                        (product) => `
                        <li>${product.name}  Bs${product.price.toFixed(2)}</li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
            <div class="button">
                <button type="submit" >Solicitar Plan!</button>
            </div>
        </div> 
    </body>
</html>
    `;

    // Guardar el contenido HTML en un archivo temporal
    const htmlFilePath = path.join(__dirname, "temp.html");
    fs.writeFileSync(htmlFilePath, contentHtml, "utf-8");

    const pdfFilePath = path.join(__dirname, "MyLayout.pdf");

    // Generar el PDF con pdfcrowd
    await convertHtmlToPdf(htmlFilePath, pdfFilePath);

    let pdfUrl = await uploadPDF(pdfFilePath);

    fs.unlinkSync(htmlFilePath);
    fs.unlinkSync(pdfFilePath);

    return pdfUrl;
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw "error"; // Devuelve null en caso de error
  }
}

async function convertHtmlToPdf(
  htmlFilePath: string,
  pdfFilePath: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    client.setPageSize("A5");
    client.convertFileToFile(
      htmlFilePath,
      pdfFilePath,
      function (err: string, fileName: string) {
        if (err) {
          console.error("Pdfcrowd Error: " + err);
          reject(err);
        } else {
          console.log("PDF generado:", pdfFilePath);
          resolve();
        }
      }
    );
  });
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadPDF = async (filePath: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    uploadToCloudinary();

    function uploadToCloudinary() {
      if (fs.existsSync(filePath)) {
        cloudinary.v2.uploader.upload(
          filePath,
          { resource_type: "auto", folder: "pdf" },
          (err, url) => {
            if (err) return reject(err);

            return resolve(url?.secure_url || "");
          }
        );
      } else {
        setTimeout(uploadToCloudinary, 100);
      }
    }
  }).catch((error) => {
    console.error("Error al subir el pdf a cloudinary", error);
    throw error;
  });
};
