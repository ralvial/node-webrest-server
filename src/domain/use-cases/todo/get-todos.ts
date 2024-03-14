import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repository/todo.repository";


export interface GetTodosUseCase{
    excute(): Promise<TodoEntity[]>
}

export class GetTodos implements GetTodosUseCase{
    constructor(
        private readonly repository : TodoRepository
    ){}


    excute(): Promise<TodoEntity[]> {
        return this.repository.getAll();
    }    
}