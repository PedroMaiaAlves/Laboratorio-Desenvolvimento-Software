public class Aluno extends Usuario{

    private static final int MAX_OBRIGATORIAS = 4;
    private static final int MAX_OPTATIVAS = 2;

    public Aluno(String nome, String codigoPessoa, String cpf, String senha){
        super(nome, codigoPessoa, cpf, senha);
    }

}
