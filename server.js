const express = require("express");
const app = express();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://admin:admin@localhost:27017/trabalho1?authSource=trabalho1";
const ObjectId = require('mongodb').ObjectID;

var cors = require('cors');
app.use(cors({origin: 'http://localhost:3000'}));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err);
    db = client.db('trabalho1');
    app.listen(4000, function (){
        console.log('Running on PORT 4000');
    });
});

app.get('/users', (req, res, next) => {
    db.collection('usuario').find().toArray((err, results)=>{
        if (err) return console.log(err);
        res.json(results);
    });
});

app.post('/userInsert', (req, res, next) => {
    db.collection('usuario').insertOne(req.body, (err, result) => {
        if (err)
            return res.json({erro: "Erro no insert."});
        res.json({success: "Insert realizado."});
    })
});

app.put('/userUpdate/:id', (req, res) => {
    var id = req.params.id;
    db.collection('usuario').updateOne({_id: ObjectId(id)},
        {$set:{
                nome: req.body.nome,
                email: req.body.email,
                celular: req.body.celular,
                senha: req.body.senha
            }}
        , (err, result) => {
            if (result.result.n < 1)
                return res.json({aviso: "Nenhum usuário alterado."});
            if (err)
                return res.json({erro: "Erro ao alterar usuário."});
            res.json({success: "Usuário alterado com sucesso."});
        })
});

app.delete('/delete/:id', (req, res) => {
    var id = req.params.id;
    db.collection('collection').deleteOne({_id: ObjectId(id)}, (err, result)=>{
        if (result.result.n < 1)
            return res.json({aviso: "Nenhum objeto excluído."});
        if (err)
            return res.json({erro: "Erro ao excluir objeto."});
        res.json({success: "Objeto excluído com sucesso."});
    });
});


app.get('/', (req, res) => {
    res.send('Requisição atendida');
})
