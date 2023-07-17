import Route from '@ioc:Adonis/Core/Route'

// Rotas não autenticadas
Route.group(() => {
  Route.post('/login', 'SessionsController.store')
  Route.delete('/logout', 'SessionsController.destroy')

  Route.get('/users', 'UsersController.index')
  Route.get('/users/:id', 'UsersController.show')
  Route.post('/users', 'UsersController.store')

  Route.get('/companies', 'CompaniesController.index')
  Route.get('/companies/:id', 'CompaniesController.show')

  Route.get('/categories', 'CategoriesController.index')
  Route.get('/categories/:id', 'CategoriesController.show')

  Route.get('/events', 'EventController.index')
  Route.get('/events/:id', 'EventController.show')

  Route.get('/companies/filter/for/', 'CompaniesController.filter')
}).prefix('api')

// Rotas autenticadas e protegidas pelo middleware 'auth'
Route.group(() => {
  Route.put('/users/:id', 'UserController.update')
  Route.delete('/users/:id', 'UsersController.destroy')

  Route.post('/companies', 'CompaniesController.store')
  Route.put('/companies/:id', 'CompaniesController.update')
  Route.delete('/companies/:id', 'CompaniesController.destroy')

  Route.post('/categories', 'CategoriesController.store').middleware('admin')
  Route.put('/categories/:id', 'CategoriesController.update').middleware('admin')
  Route.delete('/categories/:id', 'CategoriesController.destroy').middleware('admin')

  Route.post('/events', 'EventController.store').middleware('admin')
  Route.put('/events/:id', 'EventController.update').middleware('admin')
  Route.delete('/events/:id', 'EventController.destroy').middleware('admin')
})
  .middleware(['auth'])
  .prefix('api')

export default Route
