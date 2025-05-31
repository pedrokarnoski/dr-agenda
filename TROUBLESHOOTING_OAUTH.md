# 🚨 Solução para o Erro: redirect_uri_mismatch

## Problema
Erro 400: redirect_uri_mismatch - "Não foi possível fazer login, porque esse app enviou uma solicitação inválida"

## ✅ Solução Passo a Passo

### 1. Verificar Google Cloud Console

Acesse: https://console.cloud.google.com/apis/credentials

1. **Selecione seu projeto**
2. **Clique no seu OAuth 2.0 Client ID**
3. **Verifique se estas URLs estão EXATAMENTE assim:**

#### Authorized JavaScript origins:
```
http://localhost:3000
```

#### Authorized redirect URIs:
```
http://localhost:3000/api/auth/callback/google
```

### 2. Verificar Arquivo .env.local

Certifique-se que seu arquivo `.env.local` tem:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="seu-client-id-do-google"
GOOGLE_CLIENT_SECRET="seu-client-secret-do-google"
BETTER_AUTH_SECRET="uma-chave-secreta-aleatoria"
```

### 3. Verificar se o servidor está rodando na porta correta

```bash
npm run dev
```

O servidor deve estar em: http://localhost:3000

### 4. Limpar cache do navegador

1. Abra as ferramentas do desenvolvedor (F12)
2. Clique com botão direito no botão de reload
3. Selecione "Empty Cache and Hard Reload"

### 5. Se ainda não funcionar

#### Opção A: Usar HTTPS em desenvolvimento
Se estiver testando com domínio personalizado, use HTTPS:

```env
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
```

E no Google Cloud Console:
```
https://seu-dominio.com
https://seu-dominio.com/api/auth/callback/google
```

#### Opção B: Verificar se não há trailing slash
❌ Errado: `http://localhost:3000/`
✅ Correto: `http://localhost:3000`

### 6. Teste Passo a Passo

1. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse:** http://localhost:3000/auth

3. **Clique em "Continuar com Google"**

4. **Verifique se a URL de redirecionamento na barra do navegador contém:**
   ```
   redirect_uri=http%3A//localhost%3A3000/api/auth/callback/google
   ```

### 🔧 URLs de Callback Válidas para Better Auth

- **Google**: `/api/auth/callback/google`
- **GitHub**: `/api/auth/callback/github`
- **Discord**: `/api/auth/callback/discord`

### 📝 Checklist Final

- [ ] URLs no Google Cloud Console estão corretas
- [ ] Arquivo .env.local configurado corretamente
- [ ] Servidor rodando em localhost:3000
- [ ] Cache do navegador limpo
- [ ] Credenciais Google válidas e ativas

## 🆘 Se o problema persistir

1. **Verifique os logs do console do navegador** (F12)
2. **Teste com uma nova aba incógnita**
3. **Recrie as credenciais OAuth no Google Cloud Console**
4. **Verifique se o projeto Google tem as APIs necessárias habilitadas**

### APIs necessárias no Google Cloud:
- Google+ API (ou People API)
- Google OAuth2 API
