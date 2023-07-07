import Route from '@ioc:Adonis/Core/Route'

Route.get('/users', 'UsersController.index')
Route.get('/users/:id', 'UsersController.show')
Route.post('/users', 'UsersController.store')
Route.put('/users/:id', 'UserController.update')
Route.delete('/users/:id', 'UsersController.destroy')

Route.get('/companies', 'CompaniesController.index')
Route.get('/companies/:id', 'CompaniesController.show')
Route.post('/companies', 'CompaniesController.store')
Route.put('/companies/:id', 'CompaniesController.update')
Route.delete('/companies/:id', 'CompaniesController.destroy')

Route.get('/categories', 'CategoriesController.index')
Route.get('/categories/:id', 'CategoriesController.show')
Route.post('/categories', 'CategoriesController.store')
Route.put('/categories/:id', 'CategoriesController.update')
Route.delete('/categories/:id', 'CategoriesController.destroy')
