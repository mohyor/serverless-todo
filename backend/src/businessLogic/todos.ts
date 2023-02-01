import { TodosAccess } from '../dataLayer/todosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// write get todos function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {

  logger.info("Get todos for user function called")

  return todosAccess.getAllTodos(userId)
}

// write create todo function
export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {

  logger.info('Create todo function called')

  const todoId = uuid.v4()

  const createdAt = new Date().toISOString()

  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)

  const newItem = { userId, todoId, createdAt, done: false, attachmentUrl: s3AttachmentUrl, ...newTodo }

  return await todosAccess.createTodoItem(newItem)
}

export async function updateTodo(todoId: string, todoUpdate: UpdateTodoRequest, userId: string): 
 Promise<TodoUpdate> {

  logger.info('Update todo function called')

  return todosAccess.updateTodoItem(todoId, userId, todoUpdate)
} 

export async function deleteTodo(todoId: string, userId: string): Promise<string> {

  logger.info('Delete todo function called')

  return todosAccess.deleteTodoItem(todoId, userId)
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {

  logger.info('Create attachment function called by user', userId, todoId)

  return attachmentUtils.getUploadUrl(todoId)
}

/*
const todoAccess = new TodoAccess();

export async function getAllTodosForUser(userId: string): Promise<any> {
  return todoAccess.getAllTodosForUser(userId);
}

export async function createTodo(
  todoId: String,
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<Todo> {
  const todo = todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: undefined,
  } as Todo);

  return todo;
}

export async function updateTodo(
  todoId: String,
  updatedTodo: UpdateTodoRequest,
  userId: String
): Promise<void> {
  todoAccess.updateTodo(todoId, updatedTodo, userId);
}

export async function deleteTodo(
  todoId: String,
  userId: String
): Promise<void> {
  todoAccess.deleteTodo(todoId, userId);
}

export async function getPresignedImageUrl(
  todoId: String,
  imageId: String,
  userId: String
): Promise<string> {
  return todoAccess.getPresignedImageUrl(todoId, imageId, userId);
}
*/
