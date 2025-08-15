public class Curso {
    private String nome;
    private int credito;
    private Disciplina[] disciplinas[];

    public Curso(String nome, int credito){
        this.nome = nome;
        this.credito = credito;
    }

    public String getNome(){
        return this.nome;
    }

    public void setNome(String nome){
        this.nome = nome;
    }

    public int getCredito(){
        return this.credito;
    }

    public void setCredito(int credito){
        this.credito = credito;
    }
}
