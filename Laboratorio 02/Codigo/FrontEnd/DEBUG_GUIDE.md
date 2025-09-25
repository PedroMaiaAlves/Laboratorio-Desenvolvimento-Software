# 🔧 Debug do Sistema - Solução de Problemas

## ✅ Correções Implementadas

### 🐛 Problema no `api.js` Corrigido

O erro no método `request` foi corrigido com as seguintes melhorias:

1. **Tratamento robusto de erros JSON**
2. **Verificação de Content-Type**
3. **Fallback para texto quando JSON falha**
4. **Mensagens de erro mais específicas**
5. **Verificação de conectividade**

### 🛠️ Ferramentas de Debug Adicionadas

#### Script de Debug (`debug.js`)
- **Teste de conectividade** com o backend
- **Teste de CORS** para diferentes origens
- **Teste de login** para validar autenticação
- **Diagnóstico completo** do sistema

## 🚀 Como Usar o Debug

### 1. Abrir o Console do Navegador
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá para a aba "Console"

### 2. Comandos Disponíveis

```javascript
// Testar conectividade básica
testBackend()

// Testar login
testLogin()

// Diagnóstico completo
runDiagnostic()

// Testar CORS especificamente
testCORS()
```

### 3. Diagnóstico Automático
O sistema agora verifica automaticamente a conectividade ao carregar a página.

## 🔍 Solução de Problemas Comuns

### ❌ Erro: "Failed to fetch"
**Causa**: Backend não está rodando
**Solução**:
```bash
# Verificar se o backend está rodando
curl http://localhost:8080/auth/usuarios

# Se não estiver, iniciar o backend
mvn spring-boot:run
```

### ❌ Erro: "CORS policy"
**Causa**: Configuração de CORS incorreta
**Solução**:
1. Verificar se o backend foi reiniciado após as alterações de CORS
2. Confirmar que os arquivos de configuração estão corretos
3. Testar com `testCORS()` no console

### ❌ Erro: "HTTP error! status: 500"
**Causa**: Erro interno do servidor
**Solução**:
1. Verificar logs do Spring Boot
2. Confirmar se o banco de dados está rodando
3. Verificar se as tabelas foram criadas

### ❌ Erro: "HTTP error! status: 404"
**Causa**: Endpoint não encontrado
**Solução**:
1. Verificar se o endpoint existe no controller
2. Confirmar se o mapeamento está correto
3. Verificar se o contexto da aplicação está correto

## 📋 Checklist de Verificação

### Backend
- [ ] Spring Boot rodando na porta 8080
- [ ] Banco de dados MySQL rodando
- [ ] Configuração de CORS aplicada
- [ ] Controllers com anotação `@CrossOrigin`
- [ ] Logs sem erros de compilação

### Frontend
- [ ] Servidor local rodando (porta 8000)
- [ ] Console sem erros JavaScript
- [ ] Scripts carregando corretamente
- [ ] Debug tools funcionando

### Conectividade
- [ ] `testBackend()` retorna true
- [ ] `testCORS()` mostra headers corretos
- [ ] Login funcionando
- [ ] Todas as requisições AJAX funcionando

## 🎯 Testes Específicos

### Teste 1: Conectividade Básica
```javascript
// No console do navegador
testBackend()
```
**Resultado esperado**: `true` e dados no console

### Teste 2: CORS
```javascript
// No console do navegador
testCORS()
```
**Resultado esperado**: Headers CORS corretos para todas as origens

### Teste 3: Login
```javascript
// No console do navegador
testLogin()
```
**Resultado esperado**: Status 200 ou erro específico (não CORS)

### Teste 4: Diagnóstico Completo
```javascript
// No console do navegador
runDiagnostic()
```
**Resultado esperado**: Todos os testes passando

## 🔧 Configurações Adicionais

### Se ainda houver problemas de CORS:

1. **Verificar application.properties**:
```properties
# Adicionar se necessário
spring.web.cors.allowed-origins=http://localhost:8000,http://localhost:3000,http://127.0.0.1:8000,file://
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

2. **Verificar SecurityConfig**:
```java
// Deve ter esta linha
.cors(cors -> cors.configurationSource(corsConfigurationSource))
```

3. **Verificar Controllers**:
```java
// Deve ter esta anotação
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://127.0.0.1:8000", "file://"})
```

## 📞 Suporte

Se os problemas persistirem:

1. **Execute o diagnóstico completo**:
   ```javascript
   runDiagnostic()
   ```

2. **Copie os logs do console** e verifique:
   - Erros de JavaScript
   - Erros de rede
   - Headers de resposta

3. **Verifique os logs do Spring Boot**:
   - Erros de compilação
   - Erros de CORS
   - Erros de banco de dados

4. **Teste com curl**:
   ```bash
   curl -X GET http://localhost:8080/auth/usuarios
   curl -X OPTIONS http://localhost:8080/auth/usuarios -H "Origin: http://localhost:8000"
   ```

O sistema agora tem ferramentas robustas de debug para identificar e resolver problemas rapidamente!
