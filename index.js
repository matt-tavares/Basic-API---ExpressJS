const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080

//======================================================================
const bodyParser = require('body-parser')

const db = require('./queries')

app.use(cors())

app.get('/', function (req, res, next) {
  res.json({msg: 'Servidor está rodando...'})
})

//======================================================================
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
//======================================================================

app.listen(port, function () {
  console.log(`Web server listening on port ${port}`)
})

app.get('/aluno', db.getAluno) // GET TODOS OS ALUNOS
app.get('/aluno/:id_aluno', db.getAlunoById) // GET ALUNO PELO ID
app.post('/aluno', db.createAluno) // POST CADASTRA ALUNO
app.put('/aluno/:id_aluno', db.updateAluno) // PUT UPDATE ALUNO
app.delete('/aluno/:id_aluno', db.deleteAluno) // DELETE ALUNO PELO ID

//======================================================================
app.get('/cursos/', db.getCursoIdNome) //GET TODOS OS CURSOS
app.get('/curso/qtdp/byinstituicao', db.getCursosPorInstituicao) //GET QUANTIDADE DE CURSOS POR INSTITUIÇÃO

//======================================================================
app.get('/professores', db.getProfessores)
app.get('/professor/qtd/ofdisciplina', db.getDisciplinasPorProfessor) // GET QUANTIDADE DE DISCIPLINAS POR PROFESSOR
app.get('/professor/qtd/byestadocivil', db.getProfessorPorEstadoCivil) // GET QUNATIDADE DE PROFESSORES POR ESTADO CIVIL

//======================================================================
app.get('/cursa/qtd/reprovacoes', db.getReprovacoesPorAno) // QUNATIDADE DE REPROVAÇÕES POR ANO

//======================================================================
app.get('/disciplinas/bycurso/:id_curso', db.getDisciplinasPorCurso) // GET DISCIPLINAS DE CADA CURSO
app.get('/disciplinas', db.getDisciplinas) // GET TODAS AS DISCIPLINAS

//======================================================================
app.get('/disciplinas/professor/:id_professor', db.getDisciplinaPorProfessor) //GET DISCIPLINAS DE CADA PROFESSOR
