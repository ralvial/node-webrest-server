import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres/index';


describe('Todo route testing', () => {

    beforeAll(()=>{
        testServer.start();
    });

    afterAll(()=>{
        testServer.close();
    });
    
    beforeEach(async()=>{
        await prisma.todo.deleteMany();
    });

    const todo1 = { text: 'Hola mundo 1'}
    const todo2 = { text: 'Hola mundo 2'}

    test('should return TODOs api/todos', async() => {
        
        await prisma.todo.createMany({
            data:[ todo1, todo2 ]
        })

        const { body } = await request( testServer.app )
        .get('/api/todos')
        .expect(200);
        
        expect( body ).toBeInstanceOf( Array );
        expect( body.length ).toBe(2);
        expect( body[0].text ).toBe( 'Hola mundo 1' );
        expect( body[1].text ).toBe( 'Hola mundo 2' );
        expect( body[1].completedAt ).toBeNull();
    });

    test('should return a TODO api/todos/:id', async() => {
        
        const todo = await prisma.todo.create({
            data:todo1,
        });

        const { body } = await request( testServer.app )
        .get(`/api/todos/${ todo.id }`)
        .expect(200);

        expect( body ).toEqual({
            "id": todo.id ,
            "text": todo.text,
            "completedAt": todo.completedAt,
        });
    });


    test('should return a 404 NotFound api/todos/:id', async() => {

        const todoId = 999;
        const { body } = await request( testServer.app )
        .get(`/api/todos/${ todoId }`)
        .expect(404);

        expect( body ). toEqual({ error: `Todo with id ${ todoId } not found` });
                
    });



    test('should return a new Todo  api/todo ', async() => {

        const { body } = await request( testServer.app )
        .post(`/api/todos`)
        .send(todo1)
        .expect(201);

        expect( body ).toEqual({ 
            id: expect.any(Number), 
            text: todo1.text, 
            completedAt: null 
        });
    });


    test('should return an error if text is missing', async() => {
        
        
        const { body } = await request( testServer.app )
        .post(`/api/todos`)
        .send({})
        .expect(400);

        expect( body ).toEqual({
            error: 'Text property is required'
        });
        
    });


    test('should return an error if text is empty', async() => {
        
        
        const { body } = await request( testServer.app )
        .post(`/api/todos`)
        .send('')
        .expect(400);

        expect( body ).toEqual({
            error: 'Text property is required'
        });
        
    });


    test('should return an updated TODO api/todos/:id', async() => {
        
        const todo = await prisma.todo.create({
            data:todo1,
        });
        const textUpdated = 'test UPDATED';
        const CompletedUpdated = '2024-03-12';
        const { body } = await request( testServer.app )
        .put(`/api/todos/${ todo.id }`)
        .send( { text: textUpdated, completedAt: CompletedUpdated})
        .expect(200); 

        expect( body ).toEqual( {            
              id: todo.id,
              text: textUpdated,
              completedAt: '2024-03-12T00:00:00.000Z'
          });
        
    });


    //TODO!: realizar la operacion con errores personalizados
    test('should return an 404 error if TODO not found api/todos/:id', async() => {
        
        const todoId = 999;
        const textUpdated = 'test UPDATED';
        const CompletedUpdated = '2024-03-12';
    
        const { body } = await request( testServer.app )
        .put(`/api/todos/${ todoId }`)
        .send( { text: textUpdated, completedAt: CompletedUpdated})
        .expect(404);

        expect( body ).toEqual({ error: 'Todo with id 999 not found' });
        
    });


    test('should return an updated TODO only the date api/todos/:id', async() => {
        
        const todo = await prisma.todo.create({ data:todo1 });

        const CompletedUpdated = '2024-03-12';
    
        const { body } = await request( testServer.app )
        .put(`/api/todos/${ todo.id }`)
        .send( { text:undefined, completedAt: CompletedUpdated})
        .expect(200); 

        expect( body ).toEqual({
            id: todo.id,
            text: todo.text,
            completedAt: '2024-03-12T00:00:00.000Z'
          });
        
    });

    test('should delete a TODO api/todos/:id', async() => {
        const todo = await prisma.todo.create({ data:todo1 });

        const { body } = await request( testServer.app )
        .delete(`/api/todos/${ todo.id }`)        
        .expect(200); 

        expect( body ).toEqual({ 
            id: todo.id, 
            text: todo.text, 
            completedAt: null 
        });
    });

    test('should return 400 when delete a TODO if not exists api/todos/:id', async() => {
        
        const todoId = 999;

        const { body } = await request( testServer.app )
        .delete(`/api/todos/${ todoId }`)        
        .expect(404); 

        expect( body ).toEqual({ error: 'Todo with id 999 not found' });
        
    });

    
});