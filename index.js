const userRandom = require("./userRandom");
const enviar = require("./mailer");
const http = require("http");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const server = http.createServer(async(req, res) => {

    const dataUsuarios = fs.readFileSync("usuarios.json", "utf8");
    const dataJSON = JSON.parse(dataUsuarios);
    let usuarios = dataJSON.usuarios; // tengo el arreglo

    // console.log("usuarios:", usuarios);

    if (req.url == '/') {
        res.setHeader('content-type', 'text/html');
        fs.readFile('index.html', 'utf8', (err, html) => {
            res.end(html);
        })
    }

    if ((req.url == '/usuarios') && (req.method == "GET")) {
        res.end(JSON.stringify(dataJSON));
    }

    if ((req.url == "/usuario") && (req.method == "POST")) {
        try {
            const user = await userRandom();
            // console.log(user);

            let nombreCompleto = `${user.titulo} ${user.nombre} ${user.apellido}`;
            const id = uuid().slice(0, 6);

            let usuario = {
                id: id,
                correo: user.email,
                nombre: nombreCompleto,
                pais: user.pais,
                foto: user.img
            }
            usuarios.push(usuario);
            fs.writeFileSync("usuarios.json", JSON.stringify(dataJSON));
            res.end('Usuario agregado')
        } catch (e) {
            res.write("Algo salio mal :");
            res.end(`${e}`);
        }
    }

    if ((req.url == "/premio") && (req.method == "GET")) {

        const dataPremio = fs.readFileSync("premio.json", "utf8");
        let premio = JSON.parse(dataPremio);
        console.log(premio);
        res.end(dataPremio)
    }

    if ((req.url.startsWith("/premio")) && (req.method == "PUT")) {

        let nuevopremio;
        req.on("data", (payload) => {
            nuevopremio = JSON.parse(payload);
        });
        req.on("end", () => {
            fs.writeFileSync("premio.json", JSON.stringify(nuevopremio));
            res.end("Premio modificado")
        })
    }

    if ((req.url.startsWith("/ganador")) && (req.method == "GET")) {
        let ganador = Math.floor(Math.random() * usuarios.length);
        let indiceGanador = usuarios[ganador];
        let contenido = `Anuncio: El ganador de Loteria ¿Quién ganará? fue: ${indiceGanador.nombre}, gracias a todos por participar.`;
        let asunto = "Anuncio Importante - Ganador Concurso ¿Quién Ganará?"
        let correos = [];
        usuarios.forEach((u) => {
            correos.push(u.correo)
        })
        await enviar(correos.join(","), asunto, contenido);
        res.end(JSON.stringify(indiceGanador));
    }
})

server.listen(3000, () => console.log('Server ON'));