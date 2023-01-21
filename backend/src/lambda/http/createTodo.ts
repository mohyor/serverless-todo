import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../businessLogic/toDo'


// TODO: Implement creating a new TODO item
export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("[Event Type] ", event)

  const authorization = event.headers.Authorization
  const jwtToken = authorization.split(" ")[1]

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoItem =  await createToDo(newTodo, jwtToken)

  return {
    statusCode: 201, 
    headers:{
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      "item": todoItem
    })
  }
}


