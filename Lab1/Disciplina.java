import java.util.ArrayList;
import java.util.List;

public class Disciplina {
    private int carga;
    private String nome;
    private boolean ativo;
    private List<Aluno> alunos;
    private static final int MIN_ALUNO = 3;
    private static final int MAX_ALUNO = 60;
    private int totalALunos;
    private double preco;
    private DisciplinaType tipoDisciplina;

    public Disciplina(int carga, String nome, double preco, DisciplinaType tipoDisciplina) {
        this.carga = carga;
        this.nome = nome;
        this.preco = preco;
        this.ativo = false;
        this.totalALunos = 0;
        this.alunos = new ArrayList<Aluno>();
        this.tipoDisciplina = tipoDisciplina;
    }

    public int getCarga() {
        return carga;
    }

    public void setCarga(int carga) {
        this.carga = carga;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<Aluno> alunos) {
        this.alunos = alunos;
    }

    public int getTotalALunos() {
        return totalALunos;
    }

    public void setTotalALunos(int totalALunos) {
        this.totalALunos = totalALunos;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    public DisciplinaType getTipoDisciplina() {
        return tipoDisciplina;
    }

    public void setTipoDisciplina(DisciplinaType tipoDisciplina) {
        this.tipoDisciplina = tipoDisciplina;
    }
}
