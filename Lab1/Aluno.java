import java.util.ArrayList;
import java.util.List;

public class Aluno extends Usuario {

    private static final int A_MAX_OBRIGATORIAS = 4;
    private static final int A_MAX_OPTATIVAS = 2;
    private List<Disciplina> A_disciplinasObrigatorias;
    private List<Disciplina> A_disciplinasOptativas;

    public Aluno(String nome, String codigoPessoa, String cpf, String senha){
        super(nome, codigoPessoa, cpf, senha);
        this.A_disciplinasObrigatorias = new ArrayList<Disciplina>();
        this.A_disciplinasOptativas = new ArrayList<Disciplina>();
    }

    public List<Disciplina> getDisciplinasObrigatorias() {
        return A_disciplinasObrigatorias;
    }

    public void setDisciplinasObrigatorias(List<Disciplina> A_disciplinasObrigatorias) {
        this.A_disciplinasObrigatorias = A_disciplinasObrigatorias;
    }

    public List<Disciplina> getDisciplinasOptativas() {
        return A_disciplinasOptativas;
    }

    public void setDisciplinasOptativas(List<Disciplina> A_disciplinasOptativas) {
        this.A_disciplinasOptativas = A_disciplinasOptativas;
    }

    public void addDisciplina(Disciplina disciplina) throws Exception{
        if(disciplina.getTipoDisciplina().equals(DisciplinaType.OBRIGATORIA)){
            if(A_disciplinasObrigatorias.size() < A_MAX_OBRIGATORIAS){
                A_disciplinasObrigatorias.add(disciplina);
            }else{
                throw new Exception("Limite de obrigatórias atingido.");
            }
        }
        else if(disciplina.getTipoDisciplina().equals(DisciplinaType.OPTATIVA)){
            if(A_disciplinasOptativas.size() < A_MAX_OPTATIVAS){
                A_disciplinasOptativas.add(disciplina);
            }else{
                throw new Exception("Limite de optativas atingido.");
            }
        }else {
            throw new Exception("Tipo de disciplina não encontrado.");
        }
    }

}
