# API Mulheres Empreendedoras

API para gerenciamento de usuários, empresas, categorias e eventos relacionados a mulheres empreendedoras.

## Rotas

### Autenticação

- `POST /api/login`: Faz login de um usuário. Requer email e senha.
- `DELETE /api/logout`: Faz logout do usuário autenticado.

### Usuários

- `GET /api/users`: Obtém a lista de todos os usuários cadastrados.
- `GET /api/users/:id`: Obtém os detalhes de um usuário específico.
- `POST /api/users`: Cria um novo usuário. Requer nome, email, senha, número de telefone e data de nascimento.
- `PUT /api/users/:id`: Atualiza os dados de um usuário específico.
- `DELETE /api/users/:id`: Exclui um usuário específico.

### Empresas

- `GET /api/companies`: Obtém a lista de todas as empresas cadastradas.
- `GET /api/companies/:id`: Obtém os detalhes de uma empresa específica.
- `POST /api/companies`: Cria uma nova empresa. Requer nome, descrição, tipo (física/virtual) e endereço.
- `PUT /api/companies/:id`: Atualiza os dados de uma empresa específica.
- `DELETE /api/companies/:id`: Exclui uma empresa específica.
- `GET /api/companies/filter/for`: Filtra empresas com base em critérios específicos. Pelo menos um filtro é obrigatório.

### Categorias

- `GET /api/categories`: Obtém a lista de todas as categorias cadastradas.
- `GET /api/categories/:id`: Obtém os detalhes de uma categoria específica.
- `POST /api/categories`: Cria uma nova categoria. Requer nome da categoria.
- `PUT /api/categories/:id`: Atualiza os dados de uma categoria específica.
- `DELETE /api/categories/:id`: Exclui uma categoria específica.

### Eventos

- `GET /api/events`: Obtém a lista de todos os eventos cadastrados.
- `GET /api/events/:id`: Obtém os detalhes de um evento específico.
- `POST /api/events`: Cria um novo evento. Requer título, descrição, data de início, data de término, local e ID do usuário.
- `PUT /api/events/:id`: Atualiza os dados de um evento específico.
- `DELETE /api/events/:id`: Exclui um evento específico.

## Observações

- Todas as rotas que exigem autenticação devem incluir um token de autenticação válido no header `Authorization`.
- As rotas de criação e atualização de entidades (usuários, empresas, categorias e eventos) têm validações de dados para garantir a integridade das informações.
- As rotas de filtragem permitem encontrar registros com base em critérios específicos.
- Para obter mais detalhes sobre os parâmetros e respostas de cada rota, consulte a documentação completa da API.
