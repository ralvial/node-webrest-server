import fs from "fs";
import http2 from "http2";

const server = http2.createSecureServer({
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt'),
}, (req, resp) => {

    console.log(req.url);

    //resp.writeHead(200, {'Content-type': 'text-html'});
    //resp.write('<h1>Hola Mundo !!!</h1>');
    //resp.write(`<h1>${ req.url }</h1>`);
    // const data = { name: 'John Doe', age:30, city: 'New York'};
    // resp.writeHead( 200, {'Content-type': 'application/json'});

    // resp.end( JSON.stringify(data) );


    if (req.url === '/') {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
        resp.writeHead(200, { 'Content-type': 'text-html' });
        resp.end(htmlFile);
        return;
    }

    if (req.url?.endsWith('.css')) {
        resp.writeHead(200, { 'Content-type': 'text/css' });
    } else if (req.url?.endsWith('.js')) {
        resp.writeHead(200, { 'Content-type': 'application/javascript' });
    }


    try {
        resp.end(fs.readFileSync(`./public${req.url}`, 'utf-8'));
    } catch (error) {
        resp.writeHead(404, { 'Content-type': 'text-html' });
        resp.end();
    }

});


server.listen(8080, () => {

    console.log('Server running on port 8080');

});