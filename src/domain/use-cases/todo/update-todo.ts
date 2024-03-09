import { UpdateTodoDto } from "../../dtos";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repository/todo.repository";


export interface UpdateTodoUseCase{
    excute( dto: UpdateTodoDto ): Promise<TodoEntity>
}

export class UpdateTodo implements UpdateTodoUseCase{
    constructor(
        private readonly repository : TodoRepository
    ){}


    excute(dto: UpdateTodoDto): Promise<TodoEntity> {
        return this.repository.updateById(dto);
    }    
}