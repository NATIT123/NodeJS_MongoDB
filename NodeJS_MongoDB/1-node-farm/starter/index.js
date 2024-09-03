///Read - Write File
const fs = require("fs");
const http = require("http");

/////////FILES

// ////Blocking,synchronous way
// //Read File
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// //Write File

// const textOut = `This is what we know about the avocado: ${textIn}.\Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written");

// //Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data1) => {
//     console.log(data1);

//     fs.readFile("./txt/append.txt", "utf-8", (err, data2) => {
//       console.log(data2);

//       fs.writeFile("./txt/final.txt", `${data1}\n${data2}`, (err, data) => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });

// console.log("Read File....");

/////////SERVER

// JSON.parse; // convert json to object
// JSON.stringify; // convert object to JSON
//data.json() // convert json to object using with async/await
///Read File Sync

///////TEMPLATE

const replaceTemplate = (cards, product) => {
  const output = cards.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
  output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients);
  output.replace(/{%PRODUCT_FROM%}/g, product.from);
  output.replace(/{%PRODUCT_QUANTITY%}/g, product.quantity);
  output.replace(/{%PRODUCT_PRICE%}/g, product.price);
  output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
  if (!product.organic) output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  "utf-8"
);

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);

const templateCards = fs.readFileSync(
  `${__dirname}/templates/template_cards.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const objectProduct = JSON.parse(data);

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === "/" || url === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = objectProduct.map((el) =>
      replaceTemplate(templateCards, el)
    );
    const data = cardsHtml.join("");
    console.log(data);

    templateOverview.replace(/{%PRODUCT_CARDS%}/g, data);
    res.end(templateOverview);
  } else if (url === "/product") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-headers": "Hello World",
    });
    res.end(`<h1>Page not found</h1>`);
  }
});

server.listen(8080, () => {
  console.log("Listening on Port:8080");
});
