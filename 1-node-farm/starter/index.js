///Read - Write File
const fs = require("fs");
const http = require("http");
const url = require("url");
const slugs = require("slugify");

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

const replaceTemplate = require("./modules.js/replaceTemplate");

let templateProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  "utf-8"
);

let templateOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);

let templateCards = fs.readFileSync(
  `${__dirname}/templates/template_cards.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const objectProduct = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = objectProduct.map((el) =>
      replaceTemplate(templateCards, el)
    );
    const data = cardsHtml.join("");

    templateOverview = templateOverview.replace(/{%PRODUCTCARDS%}/g, data);
    res.end(templateOverview);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = objectProduct[query.id];
    templateProduct = replaceTemplate(templateProduct, product);
    res.end(templateProduct);
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
