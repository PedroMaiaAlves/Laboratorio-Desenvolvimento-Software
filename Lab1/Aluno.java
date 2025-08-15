import java.util.ArrayList;
import java.util.List;

public class Aluno extends Usuario{

    private static final int MAX_OBRIGATORIAS = 4;
    private static final int MAX_OPTATIVAS = 2;
    private List<Disciplina> disciplinasObrigatorias;
    private List<Disciplina> disciplinasOptativas;

    public Aluno(String nome, String codigoPessoa, String cpf, String senha){
        super(nome, codigoPessoa, cpf, senha);
        this.disciplinasObrigatorias = new ArrayList<Disciplina>();
        this.disciplinasOptativas = new ArrayList<Disciplina>();
    }

    public void addDisciplina(Disciplina disciplina) throws Exception{
        if(disciplina.getTipoDisciplina().equals(DisciplinaType.OBRIGATORIA)){
            if(disciplinasObrigatorias.size() < MAX_OBRIGATORIAS){
                disciplinasObrigatorias.add(disciplina);
            }else{
                throw new Exception("Limite de obrigatórias atingido.");
            }
        }
        else if(disciplina.getTipoDisciplina().equals(DisciplinaType.OPTATIVA)){
            if(disciplinasOptativas.size() < MAX_OPTATIVAS){
                disciplinasOptativas.add(disciplina);
            }else{
                throw new Exception("Limite de optativas atingido.");
            }
        }else {
            throw new Exception("Tipo de disciplina não encontrado.");
        }
    }

}
