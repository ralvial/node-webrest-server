import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";



export class TodosController {

    //* DI
    constructor(
        private readonly todoRepository : TodoRepository
    ) { }

    public getTodos = (req: Request, res: Response) => {

        new GetTodos( this.todoRepository )
            .excute()
            .then( todos => res.json(todos))
            .catch( error => res.status(400).json({error}));
    }

    public getTodosById = (req: Request, res: Response) => {

        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ 'error': 'ID argument is not a number' });

        new GetTodo( this.todoRepository )
        .excute( id )
        .then( todo => res.json(todo))
        .catch( error => res.status(400).json( {error} ) );
    }

    public CreateTodo = async (req: Request, res: Response) => {        
        const [ error, createTodoDto ] = CreateTodoDto.create(req.body);        
        if ( error ) return res.status(400).json({ error });

        new CreateTodo( this.todoRepository )
        .excute( createTodoDto! )
        .then( todo => res.json(todo) )
        .catch( error => res.status(400).json( {error} ) );
        
    }

    public UpdateTodo = (req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
        if ( error ) return res.status(400).json({error});        

        new UpdateTodo( this.todoRepository )
        .excute( updateTodoDto! )
        .then( updatedTodo => res.json(updatedTodo))
        .catch( error => res.status(400).json( {error} ));
        
    }

    public DeleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ 'error': 'ID argument is not a number' });

        new DeleteTodo( this.todoRepository )
        .excute( id )
        .then(deletedTodo => res.json( deletedTodo ))
        .catch( error => res.status(400).json( {error} ) );
    }
}