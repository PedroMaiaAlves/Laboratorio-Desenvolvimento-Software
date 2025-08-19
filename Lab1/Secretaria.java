import java.util.ArrayList;
import java.util.List;

public class Secretaria {
    private List<Disciplina> disciplinas;
    private List<Professor> professores;
    private List<Aluno> alunos;

    public Secretaria(){
        this.disciplinas = new ArrayList<Disciplina>();
        this.alunos = new ArrayList<Aluno>();
        this.professores = new ArrayList<Professor>();
    }

    public List<Disciplina> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplinas(Disciplina disciplina) {
        this.disciplinas.add(disciplina);
    }

    public List<Professor> getProfessores() {
        return professores;
    }

    public void setProfessores(Professor professor) {
        this.professores.add(professor);
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(Aluno alunos) {
        this.alunos.add(alunos);
    }

    public String gerarCurriculoDoSemestre(){
        String retorno = "";

        if (disciplinas == null) {
            return "Nenhuma disciplina encontrada.";
        }

        for (Disciplina disciplina : disciplinas) {
            retorno += "Nome da Disciplina: " + disciplina.getNome() + "\n" +
                    "Carga Horária: " + disciplina.getCarga() + "\n" +
                    "Preco da Matéria " + disciplina.getPreco() + "\n";
        }

        return retorno;
    }

}
