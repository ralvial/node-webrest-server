import { Router } from "express";
import { TodosController } from "./controller";


export class TodoRoutes{

    static get routes():Router {

        const router = Router();

        const todoController = new TodosController();
        
        router.get('/', todoController.getTodos );
        router.get('/:id', todoController.getTodosById );

        router.post('/', todoController.CreateTodo );

        router.put('/:id', todoController.UpdateTodo );

        router.delete('/:id', todoController.DeleteTodo );


        return router;
    }

}