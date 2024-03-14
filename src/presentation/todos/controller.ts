import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";
import { error } from "console";



export class TodosController {

    //* DI
    constructor(
        private readonly todoRepository : TodoRepository
    ) { }

    private handleError = (resp: Response, error: unknown) =>{
        if (error instanceof CustomError){
            resp.status( error.statusCode ).json({ error: error.message});
            return;
        }

        // grabar log
        resp.status(500).json({ error: 'Internal server error - check logs'});

    }

    public getTodos = (req: Request, res: Response) => {

        new GetTodos( this.todoRepository )
            .excute()
            .then( todos => res.json(todos))
            .catch( error=>this.handleError(res, error) );
    }

    public getTodosById = (req: Request, res: Response) => {

        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ 'error': 'ID argument is not a number' });

        new GetTodo( this.todoRepository )
        .excute( id )
        .then( todo => res.json(todo))
        .catch( error=>this.handleError(res, error) );
    }

    public CreateTodo = async (req: Request, res: Response) => {        
        const [ error, createTodoDto ] = CreateTodoDto.create(req.body);        
        if ( error ) return res.status(400).json({ error });

        new CreateTodo( this.todoRepository )
        .excute( createTodoDto! )
        .then( todo => res.status(201).json(todo) )
        .catch( error=>this.handleError(res, error) );
        
    }

    public UpdateTodo = (req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
        if ( error ) return res.status(400).json({error});        

        new UpdateTodo( this.todoRepository )
        .excute( updateTodoDto! )
        .then( updatedTodo => res.json(updatedTodo))
        .catch( error=>this.handleError(res, error) );
        
    }

    public DeleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ 'error': 'ID argument is not a number' });

        new DeleteTodo( this.todoRepository )
        .excute( id )
        .then(deletedTodo => res.json( deletedTodo ))
        .catch( error=>this.handleError(res, error) );
    }
}