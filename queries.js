const Pool = require('pg').Pool
const { dbConection }= require('./dbConection')

const { USER, HOST, DATABASE, PASSWORD, PORT } = (dbConection)
const pool = new Pool({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
})

//GET TODOS ALUNOS
const getAluno = (req, res) => {
  pool.query(`
  SELECT id_aluno, tx_nome, 
    CASE
      WHEN tx_sexo = 'f' THEN 'Feminino'
      WHEN tx_sexo = 'm' THEN 'Masculino'
    END AS tx_sexo,
  dt_nascimento
  FROM production.aluno ORDER BY tx_nome`, (err, result) => {
    if (err) {
      throw err
    }
    res.status(200).json(result.rows)
  })
}


/* //TESTE GET ALUNOS TRY CATCH
// promise
const getAluno = (req, res) => {
  try {
    pool.query(`
    SELECT id_aluno, tx_nome, 
      CASE
        WHEN tx_sexo = 'f' THEN 'Feminino'
        WHEN tx_sexo = 'm' THEN 'Masculino'
      END AS tx_sexo,
    dt_nascimento
    FROM production.aluno ORDER BY tx_nome`, (err, result) => {
      if (err) {
        throw err
      }
      res.status(200).json(result.rows)
    })
  } catch {
    console.log(err)
  }
} */


//GET ALUNO POR ID
  const getAlunoById = (request, response) => {
    const id = parseInt(request.params.id_aluno)

    pool.query('SELECT * FROM production.aluno WHERE id_aluno = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

//POST ALUNO
  const createAluno = (request, response) => {
    const { tx_nome, tx_sexo, dt_nascimento } = request.body
  
    pool.query('INSERT INTO production.aluno (tx_nome, tx_sexo, dt_nascimento) VALUES ($1, $2, $3)', [tx_nome, tx_sexo, dt_nascimento], (error, results) => {
      if (error) {
        error.body = {inserted: false}
        response.status(201).send(error.body)
      } else {
        results.body = {inserted: true}
        response.status(201).send(results.body)
      }
    })
  }

  //PUT ALUNO
  const updateAluno = (request, response) => {
    const id = parseInt(request.params.id_aluno)
    const { tx_nome, tx_sexo, dt_nascimento, id_aluno } = request.body
  
    pool.query(
      'UPDATE production.aluno SET tx_nome = $1, tx_sexo = $2, dt_nascimento = $3 WHERE id_aluno = $4',
      [tx_nome, tx_sexo, dt_nascimento, id_aluno],
      (error, results) => {
        if (error) {
          error.body = {updated: false}
          response.status(200).send(error.body)
        } else {
          results.body = {updated: true}
          response.status(200).send(results.body)
        }
      }
    )
  }

  //DELETE ALUNO
  const deleteAluno = (request, response) => {
    const id_aluno = parseInt(request.params.id_aluno)
  
    pool.query('DELETE FROM production.aluno WHERE id_aluno = $1', [id_aluno], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Aluno deleted with ID: ${id_aluno}`)
    })
  }

//=======================================================================================================================
//QUERIES TABELA CURSO
//=======================================================================================================================

  //QUANTIDADE DE CURSOS POR INSTITUIÇÃO
  const getCursosPorInstituicao = (req, res) => {
    pool.query('SELECT curso.id_instituicao, instituicao.tx_descricao AS nome, COUNT(*) AS quantidade FROM "production"."curso", "production"."instituicao" WHERE curso.id_instituicao = instituicao.id_instituicao GROUP BY curso.id_instituicao, instituicao.tx_descricao ORDER BY COUNT(*) DESC;', (err, result) => {
      if (err) {
        throw err
      }
      res.status(200).json(result.rows)
    })
  }

//ID E NOME DE TODOS OS CURSOS
const getCursoIdNome = (req, res) => {
  pool.query('SELECT id_curso AS id, tx_descricao AS curso FROM "production"."curso";', (err, result) => {
    if (err) {
      throw err
    }
    res.status(200).json(result.rows)
  })
}

//=======================================================================================================================
//QUERIES TABELA PROFESSOR
//=======================================================================================================================

    //GET PROFESSORES
    const getProfessores = (req, res) => {
      pool.query('SELECT id_professor, tx_nome FROM "production"."professor";', (err, result) => {
        if (err) {
          throw err
        }
        res.status(200).json(result.rows)
      })
    }

    //GET QUNATIDADE DE DISCIPLINAS POR PROFESSOR
    const getDisciplinasPorProfessor = (req, res) => {
      pool.query('SELECT l.id_professor, p.tx_nome AS nome, COUNT(*) AS quantidade FROM "production"."leciona" l, "production"."professor" p WHERE l.id_professor = p.id_professor GROUP BY l.id_professor, p.tx_nome ORDER BY COUNT(*) DESC;', (err, result) => {
        if (err) {
          throw err
        }
        res.status(200).json(result.rows)
      })
    }

  //GET QUNATIDADE DE PROFESSORES POR ESTADO CIVIL
  /* SELECT tx_estado_civil AS estado_civil, COUNT(*) AS quantidade FROM "production"."professor" GROUP BY tx_estado_civil ORDER BY COUNT(*) DESC; */
  const getProfessorPorEstadoCivil = (req, res) => {
    pool.query(`
    SELECT
      CASE
        WHEN tx_estado_civil='s' THEN 'Solteiro'
        WHEN tx_estado_civil='c' THEN 'Casado'
        WHEN tx_estado_civil='d' THEN 'Divorciado'
        END AS estado_civil,
    COUNT(*) AS quantidade
    FROM "production"."professor"
    GROUP BY tx_estado_civil
    ORDER BY COUNT(*) DESC;`, (err, result) => {
      if (err) {
        throw err
      }
      res.status(200).json(result.rows)
    })
  }

//=======================================================================================================================
//QUERIES TABELA CURSA
//=======================================================================================================================

  //QUNATIDADE DE REPROVAÇÕES POR ANO
  const getReprovacoesPorAno = (req, res) => {
    pool.query('SELECT in_ano AS ano, COUNT(*) AS quantidade FROM "production"."cursa" WHERE bl_aprovado = FALSE GROUP BY in_ano ORDER BY in_ano;', (err, result) => {
      if (err) {
        throw err
      }
      res.status(200).json(result.rows)
    })
  }

//=======================================================================================================================
//QUERIES TABELA DISCIPLINA
//=======================================================================================================================

  //GET DISCIPLINAS
  const getDisciplinas = (req, res) => {
    pool.query('SELECT id_disciplina, tx_descricao FROM "production"."disciplina";', (err, result) => {
      if (err) {
        throw err
      }
      res.status(200).json(result.rows)
    })
  }
    
  //GET DISCIPLINA POR ID
  const getDisciplinasPorCurso = (request, response) => {
    const id_curso = parseInt(request.params.id_curso)

    pool.query('SELECT id_disciplina, tx_sigla, tx_descricao, in_periodo, in_carga_horaria FROM "production"."disciplina" WHERE id_curso = $1;', [id_curso], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

//=======================================================================================================================
//QUERIES TABELA LECIONA
//=======================================================================================================================

  //GET MATÉRIAS POR ID DO PROFESSOR
  const getDisciplinaPorProfessor = (request, response) => {
    const id = parseInt(request.params.id_professor)

    pool.query(`SELECT l.id_disciplina, d.tx_descricao
                FROM "production"."leciona" l, "production"."disciplina" d
                WHERE l.id_professor = $1
                GROUP BY l.id_disciplina, d.id_disciplina
                HAVING l.id_disciplina = d.id_disciplina;`,
    [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  module.exports = {
    getAluno,
    getAlunoById,
    createAluno,
    updateAluno,
    deleteAluno,
    getCursosPorInstituicao,
    getCursoIdNome,
    getProfessores,
    getDisciplinasPorProfessor,
    getProfessorPorEstadoCivil,
    getReprovacoesPorAno,
    getDisciplinasPorCurso,
    getDisciplinas,
    getDisciplinaPorProfessor,
  }