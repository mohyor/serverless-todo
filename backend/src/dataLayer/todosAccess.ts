import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

var AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndex = process.env.INDEX_NAME
   ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    
    logger.info('Get all todos function called')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    }).promise()

    const items = result.Items 
    return items as TodoItem[]
  }

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {

    logger.info('Create todo item function called')

    const result = await this.docClient.put({
      TableName: this.todosTable, Item: todoItem
    }).promise()

    logger.info('Todo item created', result)

    return todoItem as TodoItem
  }

  async updateTodoItem(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {

    logger.info('Update todo function called')

    const result = await this.docClient.update({
      TableName: this.todosTable, 
      Key: { todoId, userId },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': todoUpdate.name, ':dueDate': todoUpdate.dueDate, ':done': todoUpdate.done
      },
      ExpressionAttributeNames: { '#name': 'name' },
      ReturnValues: 'ALL_NEW'
    }).promise()

    const todoItemUpdate = result.Attributes

    logger.info('Todo item updated', todoItemUpdate)

    return todoItemUpdate as TodoUpdate
  }

  async deleteTodoItem(todoId: string, userId: string): Promise<string> {

    logger.info('Delete todo item function called')

    const result = await this.docClient.delete({
      TableName: this.todosTable, Key: { todoId, userId }
    }).promise()

    logger.info('Todo item deleted', result)

    return todoId as string
  }

  async updateTodoAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<void> {

    logger.info('Update todo attachment url function called.')

    await this.docClient.update({
      TableName: this.todosTable, Key: { todoId, userId }, 
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: { ':attachmentUrl': attachmentUrl }
    }).promise()
  }

}

/*
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Todo } from "../models/Todo";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoItem } from '../../../../../../../Github/Node/Express/General/courses/alx/cloud-developer/course-04/project/c4-final-project-starter-code/backend/src/models/TodoItem';

const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly todoIndex = process.env.TODO_USER_INDEX,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.S3_URL_EXPIRATION,
    private readonly s3 = new XAWS.S3({
      signatureVersion: "v4",
    })
  ) {}

  async getAllTodosForUser(userId: String): Promise<any> {
    const result = this.docClient
      .query({
        TableName: this.todoTable,
        IndexName: this.todoIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    return result;
  }

  async createTodo(todo: Todo): Promise<Todo> {
    this.docClient
      .put({
        TableName: this.todoTable,
        Item: todo,
      })
      .promise();

    return todo;
  }

  async updateTodo(
    todoId: String,
    updatedTodo: UpdateTodoRequest,
    userId: String
  ): Promise<void> {
    console.log("Updating todoId: ", todoId, " userId: ", userId);

    this.docClient.update(
      {
        TableName: this.todoTable,
        Key: {
          todoId,
          userId,
        },
        UpdateExpression: "set #name = :n, #dueDate = :due, #done = :d",
        ExpressionAttributeValues: {
          ":n": updatedTodo.name,
          ":due": updatedTodo.dueDate,
          ":d": updatedTodo.done,
        },
        ExpressionAttributeNames: {
          "#name": "name",
          "#dueDate": "dueDate",
          "#done": "done",
        },
      },
      function (err, data) {
        if (err) {
          console.log("ERRROR " + err);
          throw new Error("Error " + err);
        } else {
          console.log("Element updated " + data);
        }
      }
    );
  }

  async deleteTodo(todoId: String, userId: String): Promise<void> {
    this.docClient.delete(
      {
        TableName: this.todoTable,
        Key: {
          todoId,
          userId,
        },
      },
      function (err, data) {
        if (err) {
          console.log("ERRROR " + err);
          throw new Error("Error " + err);
        } else {
          console.log("Element deleted " + data);
        }
      }
    );
  }
  async getPresignedImageUrl(
    todoId: String,
    imageId: String,
    userId: String
  ): Promise<string> {
    const attachmentUrl = await this.s3.getSignedUrl("putObject", {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.urlExpiration,
    });

    this.docClient.update(
      {
        TableName: this.todoTable,
        Key: {
          todoId,
          userId,
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
        },
      },
      function (err, data) {
        if (err) {
          console.log("ERRROR " + err);
          throw new Error("Error " + err);
        } else {
          console.log("Element updated " + data);
        }
      }
    );
    return attachmentUrl;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
*/
