import { CreateTodoDto } from "../../dtos";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repository/todo.repository";


export interface CreateTodoUseCase{
    excute( dto: CreateTodoDto ): Promise<TodoEntity>
}

export class CreateTodo implements CreateTodoUseCase{
    constructor(
        private readonly repository : TodoRepository
    ){}


    excute(dto: CreateTodoDto): Promise<TodoEntity> {
        return this.repository.create(dto);
    }    
}